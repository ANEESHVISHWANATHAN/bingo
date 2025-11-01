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
// 🎠 LOAD USER DASHBOARD CONFIG
// ===============================
app.get("/api/load-user-dashboard-config", (req, res) => {
  const configPath = path.join(__dirname, "config", "userdashboard.json");

  try {
    const data = fs.readFileSync(configPath, "utf-8");
    res.json(JSON.parse(data));
  } catch (err) {
    console.error("Error reading user dashboard config:", err);
    res.status(500).json({ error: "Failed to read config" });
  }
});

// ===============================
// 🎠 LOAD CAROUSEL CONFIG
// ===============================
app.get("/api/load-carousel", (req, res) => {
  const configPath = path.join(configBase, "carousel.config.json");
  console.log("🟢 [GET] /api/load-carousel");

  if (!fs.existsSync(configPath)) {
    console.log("⚠️ No carousel config found — sending defaults.");
    return res.json({
      slides: [
        {
          id: 1,
          image: "/default-slide-1.png",
          title: "Welcome to CommerceCanvas",
          subtitle: "Discover premium products at unbeatable prices",
        },
      ],
    });
  }

  try {
    const data = JSON.parse(fs.readFileSync(configPath, "utf8"));
    res.json(data);
  } catch (err) {
    console.error("❌ Failed to read carousel config:", err);
    res.status(500).json({ error: "Failed to read carousel config" });
  }
});

// ===============================
// 💾 SAVE CAROUSEL CONFIG
// ===============================
app.post("/api/save-carousel", (req, res) => {
  const configPath = path.join(configBase, "carousel.config.json");
  console.log("🟢 [POST] /api/save-carousel");

  try {
    fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));
    console.log("✅ Carousel config saved");
    // Note: WebSocket broadcasts are handled in the WebSocket handler
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error saving carousel config:", err);
    res.status(500).json({ error: "Failed to save carousel config" });
  }
});

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
    // Note: WebSocket broadcasts are handled in the WebSocket handler
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error saving header config:", err);
    res.status(500).json({ error: "Failed to save config" });
  }
});

// ===============================
// 💾 SAVE USER DASHBOARD CONFIG
// ===============================
app.post("/api/save-user-dashboard-config", (req, res) => {
  const configPath = path.join(__dirname, "config", "userdashboard.json");
  console.log("🟢 [POST] /api/save-user-dashboard-config");

  try {
    fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));
    console.log("✅ User dashboard config saved");
    // Note: WebSocket broadcasts are handled in the WebSocket handler
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error saving user dashboard config:", err);
    res.status(500).json({ error: "Failed to save config" });
  }
});

// ===============================
// 🔄 LOAD FOOTER CONFIG
// ===============================
app.get("/api/load-footer", (req, res) => {
  const configPath = path.join(__dirname, "config", "footer.json");
  console.log("🟢 [GET] /api/load-footer");

  if (!fs.existsSync(configPath)) {
    console.log("⚠️ No footer config found — sending defaults.");
    return res.json({
      siteName: "CommerceCanvas",
      tagline: "Your premium e-commerce destination for quality products.",
      sections: [
        {
          title: "Shop",
          links: [
            { label: "All Products", path: "/" },
            { label: "New Arrivals", path: "/?filter=new" },
            { label: "Best Sellers", path: "/?filter=bestsellers" },
          ],
        },
      ],
      socialLinks: [
        { platform: "Facebook", url: "https://facebook.com", enabled: true },
        { platform: "Twitter", url: "https://twitter.com", enabled: true },
      ],
      copyright: "© 2024 CommerceCanvas. All rights reserved.",
      newsletter: {
        enabled: true,
        title: "Subscribe to our newsletter",
        placeholder: "Enter your email",
        buttonText: "Subscribe",
      },
    });
  }

  try {
    const data = JSON.parse(fs.readFileSync(configPath, "utf8"));
    res.json(data);
  } catch (err) {
    console.error("❌ Failed to read footer config:", err);
    res.status(500).json({ error: "Failed to read footer config" });
  }
});

// ===============================
// 💾 SAVE FOOTER CONFIG
// ===============================
app.post("/api/save-footer", (req, res) => {
  const configPath = path.join(__dirname, "config", "footer.json");
  console.log("🟢 [POST] /api/save-footer");

  try {
    fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2));
    console.log("✅ Footer config saved");
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error saving footer config:", err);
    res.status(500).json({ error: "Failed to save footer config" });
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
          let compPath: string;
          // Handle userdashboard specially (no .config.json suffix)
          if (comp === "userdashboard") {
            compPath = path.join(__dirname, "config", "userdashboard.json");
          } else {
            compPath = path.join(configBase, `${comp}.config.json`);
          }
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
