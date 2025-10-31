import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: false }));

// ✅ Path helper for config file
const getConfigPath = (): string => {
  if (process.env.RENDER) {
    return "/tmp/header.config.json"; // writable in Render
  } else {
    return path.resolve(process.cwd(), "client/public/config/header.config.json");
  }
};

// 🟢 Save Header Config
app.post("/api/save-header", (req, res) => {
  console.log("🟢 [save-header] Received save request...");
  console.log("📦 Body:", req.body);

  let configPath = getConfigPath();
  console.log("📁 Target path:", configPath);

  try {
    // Ensure directory exists
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log("📂 Created directory:", dir);
    }

    // Write config JSON
    fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));
    console.log("✅ Successfully wrote config file.");

    const newData = fs.readFileSync(configPath, "utf8");
    console.log("📖 File contents after write:", newData.slice(0, 200));

    res.json({ success: true, message: "Config updated successfully!" });
  } catch (err: any) {
    console.error("❌ Failed to write header config:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// 🟢 Load Header Config
app.get("/api/load-header", (req, res) => {
  try {
    const configPath = getConfigPath();
    console.log("🟢 [load-header] Reading from:", configPath);

    if (!fs.existsSync(configPath)) {
      console.log("⚠️ Config file not found, sending empty object.");
      return res.json({});
    }

    const data = fs.readFileSync(configPath, "utf8");
    res.json(JSON.parse(data));
  } catch (err: any) {
    console.error("❌ Failed to load header config:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  const pathUrl = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (pathUrl.startsWith("/api")) {
      let logLine = `${req.method} ${pathUrl} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 120) logLine = logLine.slice(0, 119) + "…";
      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Only use Vite in development
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`🚀 Server running on port ${port}`);
    }
  );
})();
