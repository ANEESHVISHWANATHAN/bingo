import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";
import http from "http";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ===============================
// 📁 CONFIG DIRECTORY
// ===============================
const configBase = path.resolve(process.cwd(), "server/config");
if (!fs.existsSync(configBase)) fs.mkdirSync(configBase, { recursive: true });

// ===============================
// 🔄 LOAD HEADER CONFIG
// ===============================
app.get("/api/load-header", (req, res) => {
  const configPath = path.join(configBase, "header.config.json");
  console.log("🟢 [GET] /api/load-header");

  if (!fs.existsSync(configPath)) {
    console.log("⚠️ No header config found — sending defaults.");
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
    console.error("❌ Failed to read header config:", err);
    res.status(500).json({ error: "Failed to read header config" });
  }
});

// ===============================
// 💾 SAVE HEADER CONFIG (HTTP fallback)
// ===============================
app.post("/api/save-header", (req, res) => {
  const configPath = path.join(configBase, "header.config.json");
  console.log("🟢 [POST] /api/save-header");

  try {
    fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));
    console.log("✅ Header config saved");
    broadcast({ type: "header-update", data: req.body });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error saving header config:", err);
    res.status(500).json({ error: "Failed to save config" });
  }
});

// ===============================
// ⚡ WS SERVER
// ===============================
(async () => {
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });
  const clients = new Set();
  console.log("🔌 WebSocket server ready.");

  wss.on("connection", (ws) => {
    clients.add(ws);
    console.log(`🟢 WS client connected (${clients.size} total)`);

    ws.on("message", (msg) => {
      try {
        const data = JSON.parse(msg.toString());

        // 🧩 Update Header
        if (data.type === "update-header") {
          const filePath = path.join(configBase, "header.config.json");
          fs.writeFileSync(filePath, JSON.stringify(data.data, null, 2));
          console.log("🧠 WS update-header received.");
          broadcast({ type: "header-update", data: data.data }, ws);
        }

        // 🧩 Generic Component
        else if (data.type === "update-component") {
          const comp = data.component;
          const compPath = path.join(configBase, `${comp}.json`);
          fs.writeFileSync(compPath, JSON.stringify(data.data, null, 2));
          console.log(`🧩 WS update-component for ${comp}.`);
          broadcast({ type: "component-update", component: comp, data: data.data }, ws);
        }
      } catch (err) {
        console.error("❌ WS message parse error:", err);
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
      console.log(`🔴 WS client disconnected (${clients.size} left)`);
    });
  });

  function broadcast(message, exclude?) {
    const payload = JSON.stringify(message);
    for (const client of clients) {
      if (client !== exclude && client.readyState === 1) {
        client.send(payload);
      }
    }
  }

  // ===============================
  // 🧰 Serve Frontend
  // ===============================
  await registerRoutes(app);
  if (app.get("env") === "development") await setupVite(app, server);
  else serveStatic(app);

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "0.0.0.0", () =>
    log(`🚀 Server running on port ${port}`)
  );
})();
