import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { headerConfig as initialConfig } from "../../config/header.config";

export default function AdminPanel() {
  const [config, setConfig] = useState({ ...initialConfig });
  const [newLabel, setNewLabel] = useState("");
  const [newPath, setNewPath] = useState("");

  const handleAddLink = () => {
    if (!newLabel || !newPath) return;
    const updatedLinks = [...config.links, { label: newLabel, path: newPath }];
    setConfig({ ...config, links: updatedLinks });
    setNewLabel("");
    setNewPath("");
  };

  const handleDeleteLink = (index: number) => {
    const updatedLinks = config.links.filter((_, i) => i !== index);
    setConfig({ ...config, links: updatedLinks });
  };

  const handleSave = () => {
    // For now, this just shows in console.
    // Later, we’ll send this to your server.
    console.log("📝 Saved Header Config:", config);
    alert("Header configuration saved successfully!");
  };
  const handleSave = async () => {
  const res = await fetch("/api/save-header", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });

  if (res.ok) alert("✅ Saved to server!");
  else alert("❌ Failed to save");
};

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-primary">Admin Panel — Header Configuration</h1>

      {/* Site Name & Cart Count */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <div>
            <label className="font-medium">Site Name</label>
            <Input
              value={config.siteName}
              onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
              placeholder="Enter site name"
            />
          </div>
          <div>
            <label className="font-medium">Cart Count</label>
            <Input
              type="number"
              value={config.cartCount}
              onChange={(e) =>
                setConfig({ ...config, cartCount: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Header Links */}
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
                    setConfig({ ...config, links: updated });
                  }}
                />
                <Input
                  value={link.path}
                  onChange={(e) => {
                    const updated = [...config.links];
                    updated[index].path = e.target.value;
                    setConfig({ ...config, links: updated });
                  }}
                />
              </div>
              <Button variant="destructive" onClick={() => handleDeleteLink(index)}>
                Delete
              </Button>
            </div>
          ))}

          {/* Add new link */}
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

      {/* Live Preview */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold text-lg">🔍 Live Preview</h2>
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
