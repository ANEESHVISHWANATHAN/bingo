import { useLocation } from "wouter";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  inStock?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  rating = 4.5,
  inStock = true,
}: ProductCardProps) {
  const [, setLocation] = useLocation();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Add to cart: ${name}`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Add to wishlist: ${name}`);
  };

  const handleCardClick = () => {
    setLocation(`/product/${id}`);
  };

  return (
    <Card 
      className="group hover-elevate overflow-visible cursor-pointer" 
      data-testid={`product-card-${id}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-md bg-muted">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          {!inStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={handleWishlist}
            data-testid={`button-wishlist-${id}`}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <Badge variant="secondary" className="mb-2 text-xs">
                {category}
              </Badge>
              <h3 className="font-semibold text-foreground line-clamp-2" data-testid={`text-product-name-${id}`}>
                {name}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-primary">★</span>
            <span className="text-muted-foreground">{rating}</span>
          </div>
          <div className="flex items-center justify-between gap-2 pt-2">
            <span className="text-2xl font-bold text-foreground" data-testid={`text-product-price-${id}`}>
              ${price.toFixed(2)}
            </span>
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!inStock}
              data-testid={`button-add-cart-${id}`}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
