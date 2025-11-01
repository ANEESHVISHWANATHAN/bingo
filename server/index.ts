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
// 🗂 CONFIG BASE PATH
// ===============================
const configBase = path.resolve(process.cwd(), "server/config");

// Ensure config folder exists
if (!fs.existsSync(configBase)) fs.mkdirSync(configBase, { recursive: true });

// ===============================
// 🔄 LOAD HEADER CONFIG
// ===============================
app.get("/api/load-header", (req, res) => {
  const configPath = path.join(configBase, "header.config.json");
  console.log("🟢 [load-header] Reading from:", configPath);

  if (!fs.existsSync(configPath)) {
    console.log("⚠️ Config not found, sending default header");
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

  try {
    const data = JSON.parse(fs.readFileSync(configPath, "utf8"));
    res.json(data);
  } catch (err) {
    console.error("❌ Error reading header config:", err);
    res.status(500).json({ error: "Failed to read header config" });
  }
});

// ===============================
// 💾 SAVE HEADER CONFIG (HTTP fallback)
// ===============================
app.post("/api/save-header", (req, res) => {
  const configPath = path.join(configBase, "header.config.json");
  console.log("🟢 [save-header] HTTP update received");
  try {
    fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));
    console.log("✅ Header config saved");
    broadcast({ type: "header-update", data: req.body });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error saving config:", err);
    res.status(500).json({ error: "Failed to save config" });
  }
});

// ===============================
// 📡 SERVER + WEBSOCKET SETUP
// ===============================
(async () => {
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });
  console.log("🔌 WebSocket server started");

  const clients = new Set();

  wss.on("connection", (ws) => {
    clients.add(ws);
    console.log(`🟢 New WS client connected (${clients.size} total)`);

    ws.on("message", (msg) => {
      try {
        const parsed = JSON.parse(msg.toString());

        // --- Header Update ---
        if (parsed.type === "update-header") {
          const headerPath = path.join(configBase, "header.config.json");
          console.log("🧠 WS update-header:", parsed.data);
          fs.writeFileSync(headerPath, JSON.stringify(parsed.data, null, 2));
          broadcast({ type: "header-update", data: parsed.data }, ws);
        }

        // --- Generic Component Update ---
        else if (parsed.type === "update-component") {
          const compName = parsed.component;
          if (!compName) {
            console.error("❌ Missing component name in WS update-component");
            return;
          }

          const compPath = path.join(configBase, `${compName}.json`);
          console.log(`🧩 WS update-component for ${compName}:`, parsed.data);
          fs.writeFileSync(compPath, JSON.stringify(parsed.data, null, 2));
          broadcast({ type: "component-update", component: compName, data: parsed.data }, ws);
        }

      } catch (err) {
        console.error("❌ WS message error:", err);
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
      console.log(`🔴 WS client disconnected (${clients.size} left)`);
    });
  });

  function broadcast(message, exclude) {
    const data = JSON.stringify(message);
    for (const client of clients) {
      if (client !== exclude && client.readyState === 1) {
        client.send(data);
      }
    }
  }

  // ===============================
  // 🧰 VITE / STATIC ROUTES
  // ===============================
  await registerRoutes(app);
  if (app.get("env") === "development") await setupVite(app, server);
  else serveStatic(app);

  // ===============================
  // 🚀 SERVER START
  // ===============================
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () => log(`🟢 Server running on port ${port}`));
})();
