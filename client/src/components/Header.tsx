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

  // 🔁 Safely auto-fetch header config
  useEffect(() => {
    let isMounted = true;
    let interval: NodeJS.Timeout;

    const fetchConfig = async () => {
      try {
        console.log("🌐 Fetching header config...");
        const res = await fetch("/api/load-header", { cache: "no-store" });
        if (!res.ok) {
          console.error("❌ Failed to fetch header config:", res.statusText);
          setError("Server returned error " + res.status);
          return;
        }

        const text = await res.text();
        console.log("📥 Raw header response:", text);

        let data: any;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("❌ JSON parse failed:", e);
          setError("Invalid JSON format");
          return;
        }

        if (
          !data ||
          typeof data !== "object" ||
          !data.siteName ||
          !Array.isArray(data.links)
        ) {
          console.error("❌ Malformed header data:", data);
          setError("Malformed config structure");
          return;
        }

        console.log("🟢 Parsed header config:", data);

        if (isMounted) {
          setHeaderConfig(data);
          setError(null);
          console.log("✅ Header config updated in state.");
        }
      } catch (err) {
        console.error("❌ Header load failed:", err);
        setError("Network or server error");
      }
    };

    fetchConfig();
    interval = setInterval(fetchConfig, 5000);

    return () => {
      console.log("🛑 Header unmounted, stopping interval.");
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // 🧠 Handle clicks outside search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node))
        setShowResults(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ⚠️ Fallbacks for loading or errors
  if (error)
    return (
      <div className="text-center p-4 bg-red-100 text-red-600 font-medium">
        ⚠️ Header load failed: {error}. Retrying...
      </div>
    );

  if (!headerConfig)
    return <div className="text-center p-4">⏳ Loading header...</div>;

  // ✅ Safe render
  const filteredResults =
    searchQuery.length > 0
      ? mockSearchResults.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* 🏷️ Logo / site name */}
          <Link
            href="/"
            className="text-xl font-bold text-primary hover-elevate px-3 py-2 rounded-md"
          >
            {headerConfig.siteName || "MyShop"}
          </Link>

          {/* 🔍 Desktop Search */}
          <div
            className="hidden md:block flex-1 max-w-xl relative"
            ref={searchRef}
          >
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
          </nav>

          {/* 🛒 Mobile Menu Button */}
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

        {/* 📱 Mobile menu */}
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
