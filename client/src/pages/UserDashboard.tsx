import React, { useEffect, useState } from "react";

interface Field {
  name: string;
  value: string;
}

interface Tab {
  title: string;
  fields: Field[];
}

export default function UserDashboard() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch config from server
  useEffect(() => {
    async function fetchConfig() {
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
        if (tabsData.length > 0) {
          setActiveTab(0);
        }
      } catch (err) {
        console.error("Error loading config:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-500 text-center">
        Loading dashboard...
      </div>
    );
  }

  if (!tabs.length) {
    return (
      <div className="p-6 text-gray-400 text-center">
        No tabs configured. Please configure tabs in the admin panel.
      </div>
    );
  }

  const currentTab = tabs[activeTab];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          User Dashboard
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Tab Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Navigation
                </h2>
              </div>
              <nav className="p-2">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-all ${
                      activeTab === index
                        ? "bg-blue-600 text-white font-medium shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area - Active Tab Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
                {currentTab?.title}
              </h2>

              {currentTab?.fields && currentTab.fields.length > 0 ? (
                <div className="space-y-4">
                  {currentTab.fields.map((field, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition"
                    >
                      <span className="font-medium text-gray-800">
                        {field.name}
                      </span>
                      <span className="text-gray-600 font-semibold">
                        {field.value || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p>No fields configured for this tab.</p>
                  <p className="text-sm mt-2">
                    Add fields in the admin panel.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
