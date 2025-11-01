import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ===============================
// 🟢 CONFIG PATH
// ===============================
const configPath = path.resolve(process.cwd(), "server/config/header.config.json");

// ===============================
// 🔄 LOAD HEADER CONFIG
// ===============================
app.get("/api/load-header", (req, res) => {
  console.log("🟢 [load-header] Reading from:", configPath);
  if (!fs.existsSync(configPath)) {
    console.log("⚠️ Config file not found, sending default object.");
    return res.json({
      siteName: "ShopSmart",
      cartCount: 3,
      links: [
        { label: "Home", path: "/" },
        { label: "About", path: "/about" },
        { label: "Contact", path: "/contact" },
      ],
    });
  }
  const data = JSON.parse(fs.readFileSync(configPath, "utf8"));
  res.json(data);
});

// ===============================
// 💾 SAVE HEADER CONFIG (API fallback)
// ===============================
app.post("/api/save-header", (req, res) => {
  console.log("🟢 [save-header] HTTP update received");
  try {
    fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));
    console.log("✅ Header config saved");
    // Broadcast to WS clients
    broadcast({ type: "header-update", data: req.body });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error saving config:", err);
    res.status(500).json({ error: "Failed to save config" });
  }
});

// ===============================
// Logging Middleware
// ===============================
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

// ===============================
// 🚀 Start HTTP + WebSocket
// ===============================
(async () => {
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });
  console.log("🔌 WebSocket server started");

  // Store all active clients
  const clients = new Set<any>();

  wss.on("connection", (ws) => {
    clients.add(ws);
    console.log(`🟢 New WebSocket client connected (${clients.size} total)`);

    ws.on("message", (msg) => {
      try {
        const parsed = JSON.parse(msg.toString());
        if (parsed.type === "update-header") {
          console.log("🧠 WS update-header received:", parsed.data);
          fs.writeFileSync(configPath, JSON.stringify(parsed.data, null, 2));
          broadcast({ type: "header-update", data: parsed.data }, ws);
        }
      } catch (err) {
        console.error("❌ WS message error:", err);
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
      console.log(`🔴 WebSocket client disconnected (${clients.size} left)`);
    });
  });

  function broadcast(message: any, exclude?: any) {
    const data = JSON.stringify(message);
    for (const client of clients) {
      if (client !== exclude && client.readyState === 1) {
        client.send(data);
      }
    }
  }

  // Vite/static setup (same)
  await registerRoutes(app);
  if (app.get("env") === "development") await setupVite(app, server);
  else serveStatic(app);

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => log(`🟢 Server running on port ${port}`));
})();
