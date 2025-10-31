import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-card border-t mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">CommerceCanvas</h3>
            <p className="text-sm text-muted-foreground">
              Your premium e-commerce destination for quality products.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <a className="text-muted-foreground hover:text-foreground">All Products</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-muted-foreground hover:text-foreground">New Arrivals</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-muted-foreground hover:text-foreground">Best Sellers</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about">
                  <a className="text-muted-foreground hover:text-foreground">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-muted-foreground hover:text-foreground">Contact</a>
                </Link>
              </li>
              <li>
                <Link href="/feedback">
                  <a className="text-muted-foreground hover:text-foreground">Feedback</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Connect</h4>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" data-testid="button-facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-youtube">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 CommerceCanvas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
