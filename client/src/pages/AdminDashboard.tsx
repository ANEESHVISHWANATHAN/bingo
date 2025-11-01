import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { headerConfig as initialConfig } from "../../config/header.config";

export default function AdminPanel() {
  const [config, setConfig] = useState({ ...initialConfig });
  const [newLabel, setNewLabel] = useState("");
  const [newPath, setNewPath] = useState("");
  const wsRef = useRef<WebSocket | null>(null); // ✅ Fixed variable name

  // ✅ Connect WebSocket once
  useEffect(() => {
    const wsUrl =
      window.location.origin.replace(/^http/, "ws") || "wss://bingo-1-13zd.onrender.com";
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => console.log("✅ [Admin WS] Connected");
    ws.onclose = () => console.warn("⚠️ [Admin WS] Disconnected");
    ws.onerror = (e) => console.error("❌ [Admin WS] Error:", e);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "component-update" && msg.component === "header") {
          console.log("[Admin WS] Live update received:", msg.data);
          setConfig(msg.data);
        }
      } catch (err) {
        console.error("❌ Invalid WS message:", event.data);
      }
    };

    return () => ws.close();
  }, []);

  // ✅ Helper to send messages via WS
  const sendWS = (msg: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN)
      wsRef.current.send(JSON.stringify(msg));
    else console.warn("[Admin WS] Not connected");
  };

  // ✅ Add new link
  const handleAddLink = () => {
    if (!newLabel.trim() || !newPath.trim()) return;
    const updatedLinks = [...config.links, { label: newLabel.trim(), path: newPath.trim() }];
    const updatedConfig = { ...config, links: updatedLinks };
    setConfig(updatedConfig);
    setNewLabel("");
    setNewPath("");
    sendWS({
      type: "update-component",
      component: "header",
      data: updatedConfig,
      createPage: newPath, // optional
    });
  };

  // ✅ Delete link
  const handleDeleteLink = (index: number) => {
    const updatedLinks = config.links.filter((_, i) => i !== index);
    const updatedConfig = { ...config, links: updatedLinks };
    setConfig(updatedConfig);
    sendWS({ type: "update-component", component: "header", data: updatedConfig });
  };

  // ✅ Manual save
  const handleSave = () => {
    sendWS({ type: "update-component", component: "header", data: config });
    alert("✅ Configuration sent to server!");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-primary">
        Admin Panel — Header Configuration
      </h1>

      {/* 🌐 Site Name & Cart Count */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <div>
            <label className="font-medium">Site Name</label>
            <Input
              value={config.siteName}
              onChange={(e) => {
                const updated = { ...config, siteName: e.target.value };
                setConfig(updated);
                sendWS({ type: "update-component", component: "header", data: updated });
              }}
              placeholder="Enter site name"
            />
          </div>
          <div>
            <label className="font-medium">Cart Count</label>
            <Input
              type="number"
              value={config.cartCount}
              onChange={(e) => {
                const updated = { ...config, cartCount: parseInt(e.target.value) || 0 };
                setConfig(updated);
                sendWS({ type: "update-component", component: "header", data: updated });
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* 🧭 Header Links */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="font-semibold text-lg">Header Links</h2>

          {config.links.map((link, index) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex-1 flex gap-3">
                <Input
                  value={link.label}
                  onChange={(e) => {
                    const updated = [...config.links];
                    updated[index].label = e.target.value;
                    const updatedConfig = { ...config, links: updated };
                    setConfig(updatedConfig);
                    sendWS({
                      type: "update-component",
                      component: "header",
                      data: updatedConfig,
                    });
                  }}
                />
                <Input
                  value={link.path}
                  onChange={(e) => {
                    const updated = [...config.links];
                    updated[index].path = e.target.value;
                    const updatedConfig = { ...config, links: updated };
                    setConfig(updatedConfig);
                    sendWS({
                      type: "update-component",
                      component: "header",
                      data: updatedConfig,
                    });
                  }}
                />
              </div>
              <Button variant="destructive" onClick={() => handleDeleteLink(index)}>
                Delete
              </Button>
            </div>
          ))}

          {/* ➕ Add new link */}
          <div className="flex gap-3">
            <Input
              placeholder="New label"
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

      <Button className="w-full" onClick={handleSave}>
        💾 Save Configuration
      </Button>

      {/* 🔍 Live Preview */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold text-lg">Live Preview</h2>
          <p>Site: {config.siteName}</p>
          <p>Cart Count: {config.cartCount}</p>
          <ul className="list-disc pl-6">
            {config.links.map((l, i) => (
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
