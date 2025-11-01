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

// ===============================
// 🟢 LOAD HEADER CONFIG
// ===============================
app.get("/api/load-header", (req, res) => {
  const configPath = path.resolve(
    const configPath = path.resolve(process.cwd(), "server/config/header.config.json");

  console.log("🟢 [load-header] Reading from:", configPath);

  if (!fs.existsSync(configPath)) {
    console.log("⚠️ Config file not found, sending default object.");
    return res.json({
      siteName: "ShopSmart",
      cartCount: 3,
      links: [
        { label: "Home", path: "/", showBadge: false },
        { label: "About", path: "/about", showBadge: false },
        { label: "Contact", path: "/contact", showBadge: false },
        { label: "Cart", path: "/cart", showBadge: true },
      ],
      mobileLinks: [
        { label: "Feedback", path: "/feedback" },
        { label: "My Account", path: "/user-dashboard" },
      ],
    });
  }

  const data = JSON.parse(fs.readFileSync(configPath, "utf8"));
  res.json(data);
});

// ===============================
// 💾 SAVE HEADER CONFIG
// ===============================
app.post("/api/save-header", (req, res) => {
  console.log("🟢 [save-header] Received save request...");
  console.log("📦 Body:", req.body);

  const configPath = path.resolve(
   const configPath = path.resolve(process.cwd(), "server/config/header.config.json");

  console.log("📁 Saving to:", configPath);

  try {
    fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));
    console.log("✅ Successfully saved header config!");
    res.json({ success: true, message: "Config updated successfully!" });
  } catch (err) {
    console.error("❌ Failed to write header config:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// Logging Middleware (Keep same)
// ===============================
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

      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

// ===============================
// Vite + Server setup (same as before)
// ===============================
(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

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
      log(`serving on port ${port}`);
    }
  );
})();
