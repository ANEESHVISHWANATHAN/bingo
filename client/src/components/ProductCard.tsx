import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart, Eye } from "lucide-react";
import { Link } from "wouter";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

export default function ProductCard({ id, name, price, image, category, stock }: ProductCardProps) {
  const handleQuickView = () => {
    console.log("Quick view triggered for product:", id);
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", id);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1" data-testid={`card-product-${id}`}>
      <Link href={`/product/${id}`}>
        <div className="aspect-square relative overflow-hidden bg-muted">
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-accent/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl text-muted-foreground/20">{name[0]}</span>
          </div>
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/90 hover:bg-white text-foreground"
              onClick={(e) => {
                e.preventDefault();
                handleQuickView();
              }}
              data-testid={`button-quick-view-${id}`}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-white/90 hover:bg-white text-foreground"
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              data-testid={`button-add-to-cart-${id}`}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Badge variant="secondary" className="mb-2" data-testid={`badge-category-${id}`}>
              {category}
            </Badge>
            <Link href={`/product/${id}`}>
              <h3 className="font-semibold text-base truncate hover:text-primary transition-colors" data-testid={`text-product-name-${id}`}>
                {name}
              </h3>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold" data-testid={`text-price-${id}`}>
            ${price}
          </p>
          <p className="text-sm text-muted-foreground" data-testid={`text-stock-${id}`}>
            {stock} in stock
          </p>
        </div>
      </div>
    </Card>
  );
}
