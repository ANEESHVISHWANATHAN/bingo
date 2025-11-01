import React, { useEffect, useState } from "react";

interface SubField {
  name: string;
  value: string;
}

interface Section {
  title: string;
  subfields: SubField[];
}

export default function UserDashboard() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch config from server
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/load-user-dashboard-config");
        if (!res.ok) throw new Error("Failed to load user dashboard config");
        const data = await res.json();
        setSections(data.sections || []);
      } catch (err) {
        console.error("Error loading config:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500 text-center">Loading dashboard...</div>;
  }

  if (!sections.length) {
    return <div className="p-6 text-gray-400 text-center">No sections found.</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center mb-4 text-blue-700">
        User Dashboard
      </h1>

      {sections.map((section, i) => (
        <div
          key={i}
          className="border border-gray-300 rounded-2xl shadow-md p-5 bg-white hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">
            {section.title}
          </h2>

          <div className="space-y-2">
            {section.subfields.map((sf, j) => (
              <div
                key={j}
                className="flex justify-between border-b border-gray-100 pb-1 text-gray-700"
              >
                <span className="font-medium">{sf.name}</span>
                <span className="text-gray-600">{sf.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
