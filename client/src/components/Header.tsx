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

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/api/load-header");
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
          <Link
            href="/"
            className="text-xl font-bold text-primary hover-elevate px-3 py-2 rounded-md"
          >
            {headerConfig.siteName || "MyShop"}
          </Link>

          {/* Desktop Search */}
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
              <div className="absolute top-full mt-2 w-full bg-popover border border-popover-border rounded-md shadow-lg overflow-hidden z-50">
                {filteredResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="block w-full text-left p-3 hover-elevate active-elevate-2"
                    onClick={() => {
                      setShowResults(false);
                      setSearchQuery("");
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.category}
                        </div>
                      </div>
                      <div className="font-semibold text-foreground">
                        ${product.price}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-3 relative">
            {headerConfig.links.map((link: any, index: number) => (
              <Link key={index} href={link.path}>
                <Button variant="ghost">{link.label}</Button>
              </Link>
            ))}
            <div className="relative">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {headerConfig.cartCount ?? 0}
              </Badge>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            <div className="relative" ref={searchRef}>
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

              {showResults && filteredResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-popover border border-popover-border rounded-md shadow-lg overflow-hidden z-10">
                  {filteredResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="block w-full text-left p-3 hover-elevate active-elevate-2"
                      onClick={() => {
                        setShowResults(false);
                        setSearchQuery("");
                        setMobileMenuOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-foreground">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.category}
                          </div>
                        </div>
                        <div className="font-semibold text-foreground">
                          ${product.price}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <nav className="flex flex-col gap-2">
              {headerConfig.links.map((link: any, index: number) => (
                <Link key={index} href={link.path}>
                  <Button variant="ghost" className="w-full justify-start">
                    {link.label}
                  </Button>
                </Link>
              ))}
              <div className="flex items-center justify-between px-3">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                </div>
                <Badge>{headerConfig.cartCount ?? 0}</Badge>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
