import React, { useEffect, useState } from "react";
import BackButton from "@/components/BackButton";

interface Field {
  name: string;
  value: string;
}

interface Tab {
  title: string;
  fields: Field[];
}

export default function AdminUserDashboard() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingTab, setEditingTab] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<{ tabIndex: number; fieldIndex: number } | null>(null);
  const [tempTabTitle, setTempTabTitle] = useState("");
  const [tempFieldName, setTempFieldName] = useState("");
  const [tempFieldValue, setTempFieldValue] = useState("");

  // WebSocket setup
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => console.log("✅ [Admin WS] Connected");
    ws.onclose = () => console.log("❌ [Admin WS] Disconnected");
    ws.onerror = (err) => console.error("⚠️ WS Error:", err);
    setSocket(ws);

    return () => ws.close();
  }, []);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/load-user-dashboard-config");
        if (!res.ok) throw new Error("Failed to load user dashboard config");
        const data = await res.json();
        // Support both old format (sections) and new format (tabs)
        const tabsData = data.tabs || data.sections?.map((s: any) => ({
          title: s.title,
          fields: s.subfields || s.fields || []
        })) || [];
        setTabs(tabsData);
      } catch (err) {
        console.error("Error loading config:", err);
      }
    }
    loadData();
  }, []);

  // Save changes via WebSocket
  const saveChanges = async () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      setSaving(true);
      socket.send(
        JSON.stringify({
          type: "update-component",
          component: "userdashboard",
          data: { tabs },
        })
      );
      setTimeout(() => setSaving(false), 800);
    } else {
      // Fallback to HTTP POST
      try {
        setSaving(true);
        const res = await fetch("/api/save-user-dashboard-config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tabs }),
        });
        if (!res.ok) throw new Error("Failed to save");
        alert("✅ Changes saved successfully!");
      } catch (err) {
        console.error("Error saving:", err);
        alert("❌ Failed to save changes");
      } finally {
        setSaving(false);
      }
    }
  };

  // Add new tab
  const addTab = () => {
    const title = prompt("Enter tab title (e.g., 'My Orders', 'My Activity'):");
    if (!title) return;
    setTabs([...tabs, { title, fields: [] }]);
  };

  // Edit tab title
  const startEditTab = (index: number) => {
    setEditingTab(index);
    setTempTabTitle(tabs[index].title);
  };

  const saveTabTitle = (index: number) => {
    if (!tempTabTitle.trim()) return;
    const newTabs = [...tabs];
    newTabs[index].title = tempTabTitle.trim();
    setTabs(newTabs);
    setEditingTab(null);
  };

  const cancelEditTab = () => {
    setEditingTab(null);
    setTempTabTitle("");
  };

  // Delete tab
  const deleteTab = (index: number) => {
    if (!window.confirm(`Delete tab "${tabs[index].title}"?`)) return;
    const newTabs = [...tabs];
    newTabs.splice(index, 1);
    setTabs(newTabs);
  };

  // Add field to tab
  const addField = (tabIndex: number) => {
    const name = prompt("Enter field name (e.g., 'Completed Orders', 'Orders Pending'):");
    if (!name) return;
    const value = prompt("Enter placeholder value (this will be replaced with real data):", "");
    const newTabs = [...tabs];
    newTabs[tabIndex].fields.push({ name, value: value || "—" });
    setTabs(newTabs);
  };

  // Edit field
  const startEditField = (tabIndex: number, fieldIndex: number) => {
    setEditingField({ tabIndex, fieldIndex });
    const field = tabs[tabIndex].fields[fieldIndex];
    setTempFieldName(field.name);
    setTempFieldValue(field.value);
  };

  const saveField = () => {
    if (!editingField || !tempFieldName.trim()) return;
    const newTabs = [...tabs];
    newTabs[editingField.tabIndex].fields[editingField.fieldIndex] = {
      name: tempFieldName.trim(),
      value: tempFieldValue || "—",
    };
    setTabs(newTabs);
    setEditingField(null);
    setTempFieldName("");
    setTempFieldValue("");
  };

  const cancelEditField = () => {
    setEditingField(null);
    setTempFieldName("");
    setTempFieldValue("");
  };

  // Delete field
  const deleteField = (tabIndex: number, fieldIndex: number) => {
    if (!window.confirm("Delete this field?")) return;
    const newTabs = [...tabs];
    newTabs[tabIndex].fields.splice(fieldIndex, 1);
    setTabs(newTabs);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <BackButton fallbackPath="/admin-panel" />
      </div>
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
        Admin User Dashboard Configuration
      </h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>💡 Instructions:</strong> Configure tabs and fields that will appear in the user dashboard. 
          Tab names will appear in the sidebar navigation. Field values are placeholders and will be replaced 
          with real data when connected to your backend/database.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={addTab}
          className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition font-medium"
        >
          ➕ Add New Tab
        </button>

        <button
          onClick={saveChanges}
          disabled={saving}
          className={`px-6 py-2 rounded-lg text-white transition font-medium ${
            saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "💾 Saving..." : "💾 Save Changes"}
        </button>
      </div>

      {tabs.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No tabs configured yet.</p>
          <button
            onClick={addTab}
            className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition"
          >
            ➕ Add Your First Tab
          </button>
        </div>
      )}

      <div className="space-y-6">
        {tabs.map((tab, tabIndex) => (
          <div
            key={tabIndex}
            className="border border-gray-300 rounded-xl shadow-lg p-6 bg-white"
          >
            {/* Tab Header */}
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              {editingTab === tabIndex ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={tempTabTitle}
                    onChange={(e) => setTempTabTitle(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg flex-1"
                    placeholder="Tab title"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveTabTitle(tabIndex);
                      if (e.key === "Escape") cancelEditTab();
                    }}
                  />
                  <button
                    onClick={() => saveTabTitle(tabIndex)}
                    className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    ✓ Save
                  </button>
                  <button
                    onClick={cancelEditTab}
                    className="bg-gray-400 text-white px-3 py-2 rounded-lg hover:bg-gray-500 transition"
                  >
                    ✕ Cancel
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {tab.title}
                  </h2>
                  <div className="space-x-2">
                    <button
                      onClick={() => startEditTab(tabIndex)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition text-sm"
                      title="Edit tab name"
                    >
                      ✏️ Edit Name
                    </button>
                    <button
                      onClick={() => addField(tabIndex)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition text-sm"
                    >
                      ➕ Add Field
                    </button>
                    <button
                      onClick={() => deleteTab(tabIndex)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition text-sm"
                      title="Delete tab"
                    >
                      🗑️ Delete Tab
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Fields List */}
            {tab.fields.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500 mb-2">No fields in this tab yet.</p>
                <button
                  onClick={() => addField(tabIndex)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  ➕ Add a field
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {tab.fields.map((field, fieldIndex) => (
                  <div
                    key={fieldIndex}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    {editingField?.tabIndex === tabIndex && editingField?.fieldIndex === fieldIndex ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={tempFieldName}
                          onChange={(e) => setTempFieldName(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg flex-1"
                          placeholder="Field name"
                          autoFocus
                        />
                        <input
                          type="text"
                          value={tempFieldValue}
                          onChange={(e) => setTempFieldValue(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg w-48"
                          placeholder="Placeholder value"
                        />
                        <button
                          onClick={saveField}
                          className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition"
                        >
                          ✓
                        </button>
                        <button
                          onClick={cancelEditField}
                          className="bg-gray-400 text-white px-3 py-2 rounded-lg hover:bg-gray-500 transition"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1">
                          <span className="font-medium text-gray-800">
                            {field.name}
                          </span>
                          <span className="text-gray-500 ml-4">
                            Value: <span className="font-semibold">{field.value}</span>
                          </span>
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() => startEditField(tabIndex, fieldIndex)}
                            className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition text-sm"
                            title="Edit field"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => deleteField(tabIndex, fieldIndex)}
                            className="bg-red-400 text-white px-3 py-1 rounded-md hover:bg-red-500 transition text-sm"
                            title="Delete field"
                          >
                            ❌ Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
