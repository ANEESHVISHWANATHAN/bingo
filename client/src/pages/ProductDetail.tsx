import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart, Heart, Share2, ChevronLeft, Star } from "lucide-react";
import { Link } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  rating: number;
  reviews: number;
  specifications: Record<string, string>;
};

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const [, setLocation] = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: products } = useQuery<Product[]>({
  queryKey: ['/api/products'],
  queryFn: async () => {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to load products');
    return res.json();
  },
});


  const product = products?.find(p => p.id === params?.id);

  const handleAddToCart = () => {
    console.log(`Added ${quantity} items to cart`);
  };

  const handleBuyNow = () => {
    console.log('Proceeding to checkout');
    // TODO: Backend integration - Navigate to checkout with product in cart
    setLocation('/checkout');
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
          <Link href="/">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const specificationsList = Object.entries(product.specifications).map(([label, value]) => ({
    label,
    value
  }));

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-muted to-accent/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-9xl text-muted-foreground/20">{product.name[0]}</span>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button size="icon" variant="ghost" className="bg-white/90 hover:bg-white" data-testid="button-favorite">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" className="bg-white/90 hover:bg-white" data-testid="button-share">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square bg-muted rounded-lg overflow-hidden relative hover-elevate active-elevate-2 ${
                    selectedImage === idx ? 'ring-2 ring-primary' : ''
                  }`}
                  data-testid={`button-thumbnail-${idx}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-muted to-accent/20" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3" data-testid="badge-category">
                {product.category}
              </Badge>
              <h1 className="font-display text-4xl font-semibold mb-4" data-testid="text-product-name">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${
                        idx < Math.floor(product.rating)
                          ? 'fill-primary text-primary'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground" data-testid="text-rating">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <p className="text-5xl font-semibold mb-6" data-testid="text-price">
                ${product.price}
              </p>
              
              <p className="text-muted-foreground leading-relaxed" data-testid="text-description">
                {product.description}
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    data-testid="button-decrease-quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold" data-testid="text-quantity">
                    {quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    data-testid="button-increase-quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground" data-testid="text-stock">
                  {product.stock} available
                </span>
              </div>

              <Button
                size="lg"
                className="w-full rounded-full"
                onClick={handleAddToCart}
                data-testid="button-add-to-cart"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full rounded-full"
                onClick={handleBuyNow}
                data-testid="button-checkout"
              >
                Buy Now
              </Button>
            </div>

            <Accordion type="single" collapsible className="pt-6 border-t">
              <AccordionItem value="specs">
                <AccordionTrigger data-testid="accordion-specifications">
                  Specifications
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {specificationsList.map((spec, idx) => (
                      <div key={idx} className="flex justify-between py-2 border-b last:border-0">
                        <span className="text-muted-foreground">{spec.label}</span>
                        <span className="font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="shipping">
                <AccordionTrigger data-testid="accordion-shipping">
                  Shipping & Returns
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Free standard shipping on orders over $50</p>
                    <p>Express shipping available at checkout</p>
                    <p>30-day return policy for unopened items</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
