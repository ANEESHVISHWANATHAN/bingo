import React, { useEffect, useState } from "react";

interface SubField {
  name: string;
  value: string;
}

interface Section {
  title: string;
  subfields: SubField[];
}

export default function AdminUserDashboard() {
  const [sections, setSections] = useState<Section[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [saving, setSaving] = useState(false);

  // WebSocket setup
  useEffect(() => {
    const ws = new WebSocket("wss://bingo-1-13zd.onrender.com");
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
        setSections(data.sections || []);
      } catch (err) {
        console.error("Error loading config:", err);
      }
    }
    loadData();
  }, []);

  // Save changes via WebSocket
  const saveChanges = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      alert("WebSocket not connected!");
      return;
    }
    setSaving(true);
    socket.send(
      JSON.stringify({
        type: "update-component",
        component: "userdashboard",
        data: { sections },
      })
    );
    setTimeout(() => setSaving(false), 800);
  };

  // Add section
  const addSection = () => {
    const title = prompt("Enter section title:");
    if (!title) return;
    setSections([...sections, { title, subfields: [] }]);
  };

  // Add subfield
  const addSubField = (i: number) => {
    const name = prompt("Enter field name:");
    const value = prompt("Enter field value:");
    if (!name) return;
    const newSections = [...sections];
    newSections[i].subfields.push({ name, value: value || "" });
    setSections(newSections);
  };

  // Edit field
  const editField = (i: number, j: number) => {
    const value = prompt("New value:", sections[i].subfields[j].value);
    if (value === null) return;
    const newSections = [...sections];
    newSections[i].subfields[j].value = value;
    setSections(newSections);
  };

  // Delete subfield
  const deleteSubField = (i: number, j: number) => {
    if (!window.confirm("Delete this field?")) return;
    const newSections = [...sections];
    newSections[i].subfields.splice(j, 1);
    setSections(newSections);
  };

  // Delete section
  const deleteSection = (i: number) => {
    if (!window.confirm("Delete this section?")) return;
    const newSections = [...sections];
    newSections.splice(i, 1);
    setSections(newSections);
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
        Admin User Dashboard
      </h1>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={addSection}
          className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
        >
          ➕ Add Section
        </button>

        <button
          onClick={saveChanges}
          disabled={saving}
          className={`px-5 py-2 rounded-xl text-white transition ${
            saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "💾 Saving..." : "💾 Save Changes"}
        </button>
      </div>

      {sections.map((section, i) => (
        <div
          key={i}
          className="border border-gray-300 rounded-2xl shadow-md p-5 bg-white space-y-4"
        >
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-800">
              {section.title}
            </h2>
            <div className="space-x-3">
              <button
                onClick={() => addSubField(i)}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
              >
                + Field
              </button>
              <button
                onClick={() => deleteSection(i)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
              >
                🗑
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {section.subfields.map((sf, j) => (
              <div
                key={j}
                className="flex justify-between items-center border-b border-gray-100 pb-1"
              >
                <span className="font-medium text-gray-700">
                  {sf.name}: <span className="text-gray-500">{sf.value}</span>
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => editField(i, j)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 transition"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteSubField(i, j)}
                    className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500 transition"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {sections.length === 0 && (
        <div className="text-center text-gray-500">No sections yet.</div>
      )}
    </div>
  );
}
