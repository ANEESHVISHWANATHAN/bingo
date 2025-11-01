import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockSearchResults = [
  { id: 1, name: "Wireless Headphones", price: 79.99, category: "Electronics" },
  { id: 2, name: "Leather Wallet", price: 49.99, category: "Accessories" },
  { id: 3, name: "Smart Watch", price: 199.99, category: "Electronics" },
  { id: 4, name: "Laptop Backpack", price: 89.99, category: "Bags" },
];

export default function Header() {
  const [headerConfig, setHeaderConfig] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // 🧠 Load initial header
  useEffect(() => {
    const loadHeader = async () => {
      try {
        console.log("🌐 Fetching initial header config...");
        const res = await fetch("/api/load-header", { cache: "no-store" });
        const data = await res.json();
        console.log("🟢 Initial header data received:", data);
        setHeaderConfig(data);
      } catch (err) {
        console.error("❌ Failed to fetch header:", err);
        setError("Failed to load header");
      }
    };
    loadHeader();
  }, []);

  // 🔁 WebSocket setup for live updates
  useEffect(() => {
    console.log("🔌 Connecting WebSocket for live header updates...");

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const ws = new WebSocket(`${protocol}://${window.location.host}`);
    wsRef.current = ws;

    ws.onopen = () => console.log("🟢 Header WebSocket connected.");

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log("📨 WS message received:", msg);

        if (msg.type === "header-update" && msg.data) {
          console.log("✨ Live header update:", msg.data);
          setHeaderConfig(msg.data);
        }
      } catch (err) {
        console.error("❌ WS message parse failed:", err);
      }
    };

    ws.onerror = (err) => console.error("❌ WebSocket error:", err);
    ws.onclose = () => console.warn("⚠️ WebSocket disconnected.");

    return () => {
      console.log("🔌 Closing Header WS connection.");
      ws.close();
    };
  }, []);

  // 🧠 Hide search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ⚠️ Error / Loading States
  if (error)
    return (
      <div className="text-center p-4 bg-red-100 text-red-600 font-medium">
        ⚠️ Header load failed: {error}.
      </div>
    );

  if (!headerConfig)
    return <div className="text-center p-4">⏳ Loading header...</div>;

  // ✅ Filtered results
  const filteredResults =
    searchQuery.length > 0
      ? mockSearchResults.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* 🏷️ Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-primary hover-elevate px-3 py-2 rounded-md"
          >
            {headerConfig.siteName || "MyShop"}
          </Link>

          {/* 🔍 Desktop Search */}
          <div className="hidden md:block flex-1 max-w-xl relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                className="pl-9"
              />
            </div>

            {showResults && filteredResults.length > 0 && (
              <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg z-50">
                {filteredResults.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setShowResults(false)}
                  >
                    {item.name} - ${item.price}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🧭 Desktop Nav */}
          <nav className="hidden md:flex gap-6 items-center">
            {headerConfig.links.map((link: any, i: number) => (
              <Link
                key={i}
                href={link.path}
                className="text-sm font-medium hover:text-primary transition-colors relative"
              >
                {link.label}
                {link.showBadge && (
                  <Badge className="ml-1 bg-primary text-white">
                    {headerConfig.cartCount || 0}
                  </Badge>
                )}
              </Link>
            ))}
            <ShoppingCart className="h-5 w-5 text-primary" />
          </nav>

          {/* 🛒 Mobile Menu */}
          <div className="flex items-center gap-3 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* 📱 Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-3">
            {headerConfig.mobileLinks?.map((link: any, i: number) => (
              <Link
                key={i}
                href={link.path}
                className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
