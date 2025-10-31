import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));


app.post("/api/save-header", (req, res) => {
  console.log("🟢 [save-header] Received save request...");
  console.log("📦 Body:", req.body);

  // Try to locate the config file
  const configPath = path.resolve(process.cwd(), "client/config/header.config.json");
  console.log("📁 Target path:", configPath);

  try {
    // Check if directory exists
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      console.log("⚠️ Directory does not exist:", dir);
    } else {
      console.log("✅ Directory exists:", dir);
    }

    // Try writing
    fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));
    console.log("✅ Successfully wrote config file.");

    // Verify content
    const newData = fs.readFileSync(configPath, "utf8");
    console.log("📖 File contents after write:", newData.slice(0, 200));

    res.json({ success: true, message: "Config updated successfully!" });

  } catch (err) {
    console.error("❌ Failed to write header config:", err);

    // Try fallback to /tmp/
    try {
      const fallbackPath = "/tmp/header.config.json";
      fs.writeFileSync(fallbackPath, JSON.stringify(req.body, null, 2));
      console.log("🟡 Fallback success: saved to /tmp/header.config.json");
      res.json({
        success: true,
        fallback: true,
        message: "Saved temporarily to /tmp/",
      });
    } catch (fallbackErr) {
      console.error("🔴 Fallback also failed:", fallbackErr);
      res.status(500).json({
        success: false,
        error: err.message,
        fallbackError: fallbackErr.message,
      });
    }
  }
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

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

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
