import { useState } from "react";
import { useRoute } from "wouter";
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

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const mockProduct = {
    id: params?.id || '1',
    name: 'Premium Wireless Headphones',
    price: 199,
    category: 'Electronics',
    stock: 15,
    rating: 4.5,
    reviews: 127,
    description: 'Experience superior sound quality with our premium wireless headphones. Featuring active noise cancellation, 40-hour battery life, and premium materials for all-day comfort.',
    images: 4,
    specifications: [
      { label: 'Battery Life', value: '40 hours' },
      { label: 'Connectivity', value: 'Bluetooth 5.0' },
      { label: 'Weight', value: '250g' },
      { label: 'Warranty', value: '2 years' },
    ],
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} items to cart`);
  };

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
                <span className="text-9xl text-muted-foreground/20">{mockProduct.name[0]}</span>
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
              {Array.from({ length: mockProduct.images }).map((_, idx) => (
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
                {mockProduct.category}
              </Badge>
              <h1 className="font-display text-4xl font-semibold mb-4" data-testid="text-product-name">
                {mockProduct.name}
              </h1>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 ${
                        idx < Math.floor(mockProduct.rating)
                          ? 'fill-primary text-primary'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground" data-testid="text-rating">
                  {mockProduct.rating} ({mockProduct.reviews} reviews)
                </span>
              </div>

              <p className="text-5xl font-semibold mb-6" data-testid="text-price">
                ${mockProduct.price}
              </p>
              
              <p className="text-muted-foreground leading-relaxed" data-testid="text-description">
                {mockProduct.description}
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
                    onClick={() => setQuantity(Math.min(mockProduct.stock, quantity + 1))}
                    disabled={quantity >= mockProduct.stock}
                    data-testid="button-increase-quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground" data-testid="text-stock">
                  {mockProduct.stock} available
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
                    {mockProduct.specifications.map((spec, idx) => (
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
