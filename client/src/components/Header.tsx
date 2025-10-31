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
  const searchRef = useRef<HTMLDivElement>(null);

  // 🔁 Auto-fetch header config every 5 seconds
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/load-header", { cache: "no-store" });
        if (!res.ok) {
          console.error("❌ Failed to fetch header config:", res.statusText);
          return;
        }

        const text = await res.text();
        console.log("📥 Raw header response:", text);

        const data = JSON.parse(text);
        console.log("🟢 Parsed header config:", data);
        setHeaderConfig(data);
      } catch (err) {
        console.error("❌ Header load failed:", err);
      }
    };

    fetchConfig();
    const interval = setInterval(fetchConfig, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!headerConfig)
    return <div className="text-center p-4">Loading header...</div>;

  if (!headerConfig.links || !Array.isArray(headerConfig.links))
    return (
      <div className="text-center p-4 text-red-500">
        Invalid header configuration
      </div>
    );

  const filteredResults =
    searchQuery.length > 0
      ? mockSearchResults.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node))
        setShowResults(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

          {/* 🛒 Mobile / Cart button */}
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
