import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// TODO: Remove mock data - replace with real product search
const mockSearchResults = [
  { id: 1, name: "Wireless Headphones", price: 79.99, category: "Electronics" },
  { id: 2, name: "Leather Wallet", price: 49.99, category: "Accessories" },
  { id: 3, name: "Smart Watch", price: 199.99, category: "Electronics" },
  { id: 4, name: "Laptop Backpack", price: 89.99, category: "Bags" },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // TODO: Replace with actual search API call with debouncing
  const filteredResults = searchQuery.length > 0
    ? mockSearchResults.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/">
            <a className="text-xl font-bold text-primary hover-elevate px-3 py-2 rounded-md" data-testid="link-home">
              CommerceCanvas
            </a>
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
                data-testid="input-search"
              />
            </div>

            {/* Live Search Results Dropdown */}
            {showResults && filteredResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-popover border border-popover-border rounded-md shadow-lg overflow-hidden">
                {filteredResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      console.log(`Navigate to product ${product.id}`);
                      setShowResults(false);
                      setSearchQuery("");
                    }}
                    className="w-full flex items-center justify-between p-3 hover-elevate active-elevate-2 text-left"
                    data-testid={`search-result-${product.id}`}
                  >
                    <div>
                      <div className="font-medium text-foreground">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.category}</div>
                    </div>
                    <div className="font-semibold text-foreground">${product.price}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/about">
              <a>
                <Button variant="ghost" data-testid="link-about">About</Button>
              </a>
            </Link>
            <Link href="/contact">
              <a>
                <Button variant="ghost" data-testid="link-contact">Contact</Button>
              </a>
            </Link>
            <Link href="/feedback">
              <a>
                <Button variant="ghost" data-testid="link-feedback">Feedback</Button>
              </a>
            </Link>
            <Link href="/user-dashboard">
              <a>
                <Button variant="ghost" size="icon" data-testid="button-user">
                  <User className="h-5 w-5" />
                </Button>
              </a>
            </Link>
            <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
              <ShoppingCart className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                3
              </Badge>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
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
                data-testid="input-search-mobile"
              />
              {showResults && filteredResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-popover border border-popover-border rounded-md shadow-lg overflow-hidden z-10">
                  {filteredResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        console.log(`Navigate to product ${product.id}`);
                        setShowResults(false);
                        setSearchQuery("");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-3 hover-elevate active-elevate-2 text-left"
                      data-testid={`search-result-mobile-${product.id}`}
                    >
                      <div>
                        <div className="font-medium text-foreground">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.category}</div>
                      </div>
                      <div className="font-semibold text-foreground">${product.price}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <nav className="flex flex-col gap-2">
              <Link href="/about">
                <a className="w-full">
                  <Button variant="ghost" className="w-full justify-start" data-testid="link-about-mobile">About</Button>
                </a>
              </Link>
              <Link href="/contact">
                <a className="w-full">
                  <Button variant="ghost" className="w-full justify-start" data-testid="link-contact-mobile">Contact</Button>
                </a>
              </Link>
              <Link href="/feedback">
                <a className="w-full">
                  <Button variant="ghost" className="w-full justify-start" data-testid="link-feedback-mobile">Feedback</Button>
                </a>
              </Link>
              <Link href="/user-dashboard">
                <a className="w-full">
                  <Button variant="ghost" className="w-full justify-start" data-testid="link-user-mobile">
                    <User className="h-5 w-5 mr-2" />
                    My Account
                  </Button>
                </a>
              </Link>
              <Button variant="ghost" className="w-full justify-start relative" data-testid="button-cart-mobile">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
                <Badge className="ml-2">3</Badge>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
