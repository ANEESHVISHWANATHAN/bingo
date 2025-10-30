import { ShoppingCart, Search, Moon, Sun, User, Menu } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { Link } from "wouter";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      window.dispatchEvent(new CustomEvent('search', { detail: { query: searchValue } }));
      setSearchOpen(false);
      setSearchValue("");
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <Link href="/">
              <h1 className="font-display text-xl md:text-2xl font-semibold cursor-pointer" data-testid="link-home">
                Premium
              </h1>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-shop">
              Shop
            </Link>
            <Link href="/about" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-about">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-contact">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2 animate-fade-in">
                <input
                  type="search"
                  placeholder="Search products..."
                  className="h-9 px-4 rounded-full bg-muted border-0 focus:outline-none focus:ring-2 focus:ring-ring w-48 md:w-64"
                  autoFocus
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onBlur={(e) => {
                    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
                      setTimeout(() => setSearchOpen(false), 200);
                    }
                  }}
                  data-testid="input-search"
                />
              </form>
            ) : (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSearchOpen(true)}
                  data-testid="button-search"
                >
                  <Search className="w-5 h-5" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleTheme}
                  data-testid="button-theme-toggle"
                >
                  {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>

                <Link href="/login">
                  <Button size="icon" variant="ghost" data-testid="button-account">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>

                <div className="relative">
                  <Button size="icon" variant="ghost" data-testid="button-cart">
                    <ShoppingCart className="w-5 h-5" />
                  </Button>
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs" data-testid="badge-cart-count">
                    3
                  </Badge>
                </div>
              </>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-2 animate-fade-in">
            <Link href="/" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-shop">
              Shop
            </Link>
            <Link href="/about" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-about">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-contact">
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
