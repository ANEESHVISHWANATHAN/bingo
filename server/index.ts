import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  const [config, setConfig] = useState<any>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newPath, setNewPath] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  // 🟢 Load config once
  useEffect(() => {
    fetch("/api/load-header")
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Loaded initial header config:", data);
        setConfig(data);
      })
      .catch((err) => console.error("❌ Failed to load config:", err));
  }, []);

  // 🌐 Setup WebSocket
  useEffect(() => {
    const wsUrl =
      window.location.origin.replace(/^http/, "ws") ||
      "wss://bingo-1-13zd.onrender.com";
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => console.log("✅ [Admin WS] Connected");
    ws.onclose = () => console.warn("⚠️ [Admin WS] Disconnected");
    ws.onerror = (e) => console.error("❌ [Admin WS] Error:", e);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "component-update" && msg.component === "header") {
          console.log("🔄 [Admin WS] Live header update received:", msg.data);
          setConfig(msg.data);
        }
      } catch (err) {
        console.error("❌ Invalid WS message:", event.data);
      }
    };

    return () => ws.close();
  }, []);

  // 📨 Helper to send WS messages
  const sendWS = (msg: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN)
      wsRef.current.send(JSON.stringify(msg));
    else console.warn("[Admin WS] Not connected");
  };

  // 🧩 Save new site name
  const handleSiteNameChange = (value: string) => {
    const updated = { ...config, siteName: value };
    setConfig(updated);
    sendWS({ type: "update-component", component: "header", data: updated });
  };

  // 🧩 Save cart count
  const handleCartCountChange = (value: number) => {
    const updated = { ...config, cartCount: value };
    setConfig(updated);
    sendWS({ type: "update-component", component: "header", data: updated });
  };

  // ➕ Add new link
  const handleAddLink = () => {
    if (!newLabel.trim() || !newPath.trim()) return;
    const updatedLinks = [...config.links, { label: newLabel, path: newPath }];
    const updated = { ...config, links: updatedLinks };
    setConfig(updated);
    setNewLabel("");
    setNewPath("");
    sendWS({ type: "update-component", component: "header", data: updated });
  };

  // ❌ Delete link
  const handleDeleteLink = (index: number) => {
    const updatedLinks = config.links.filter((_, i) => i !== index);
    const updated = { ...config, links: updatedLinks };
    setConfig(updated);
    sendWS({ type: "update-component", component: "header", data: updated });
  };

  if (!config) return <p className="p-6">Loading header configuration...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-primary">
        🛠 Admin Dashboard — Header Manager
      </h1>

      {/* 🧠 Site Config */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <div>
            <label className="font-medium">Site Name</label>
            <Input
              value={config.siteName}
              onChange={(e) => handleSiteNameChange(e.target.value)}
            />
          </div>
          <div>
            <label className="font-medium">Cart Count</label>
            <Input
              type="number"
              value={config.cartCount}
              onChange={(e) => handleCartCountChange(Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* 🧭 Header Links */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="font-semibold text-lg">Header Links</h2>

          {config.links.map((link: any, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <Input
                value={link.label}
                onChange={(e) => {
                  const updatedLinks = [...config.links];
                  updatedLinks[i].label = e.target.value;
                  const updated = { ...config, links: updatedLinks };
                  setConfig(updated);
                  sendWS({
                    type: "update-component",
                    component: "header",
                    data: updated,
                  });
                }}
              />
              <Input
                value={link.path}
                onChange={(e) => {
                  const updatedLinks = [...config.links];
                  updatedLinks[i].path = e.target.value;
                  const updated = { ...config, links: updatedLinks };
                  setConfig(updated);
                  sendWS({
                    type: "update-component",
                    component: "header",
                    data: updated,
                  });
                }}
              />
              <Button variant="destructive" onClick={() => handleDeleteLink(i)}>
                Delete
              </Button>
            </div>
          ))}

          {/* ➕ Add new link */}
          <div className="flex gap-3">
            <Input
              placeholder="Label"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
            <Input
              placeholder="/path"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
            />
            <Button onClick={handleAddLink}>Add</Button>
          </div>
        </CardContent>
      </Card>

      {/* 💾 Manual Save */}
      <Button
        className="w-full"
        onClick={() =>
          sendWS({ type: "update-component", component: "header", data: config })
        }
      >
        💾 Save Configuration
      </Button>

      {/* 👀 Live Preview */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold text-lg">Live Preview</h2>
          <p>Site Name: {config.siteName}</p>
          <p>Cart Count: {config.cartCount}</p>
          <ul className="list-disc pl-6">
            {config.links.map((l: any, i: number) => (
              <li key={i}>
                {l.label} — <code>{l.path}</code>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
