/* FULL FILE WITH RESPONSIVE FIXES ONLY */

import { useRoute, Link } from "wouter";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, Star, Truck, Shield, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const imageBase = "/assets/generated_images";

const headphonesImg = `${imageBase}/Bluetooth_headphones_product_image_293d0afb.png`;
const walletImg = `${imageBase}/Leather_wallet_product_image_6964689a.png`;
const smartwatchImg = `${imageBase}/Smartwatch_product_image_9f288674.png`;
const backpackImg = `${imageBase}/Laptop_backpack_product_image_23ad0421.png`;
const bottleImg = `${imageBase}/Water_bottle_product_image_92e5f2dc.png`;
const lampImg = `${imageBase}/Desk_lamp_product_image_9d89bccf.png`;

const products = [/* same data */];

export default function ProductDetailPage() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : null;
  const product = products.find((p) => p.id === productId);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-6">
              <BackButton fallbackPath="/" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Product Not Found</h1>
            <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.name}`,
    });
  };

  const handleWishlist = () => {
    toast({
      title: "Added to wishlist!",
      description: product.name,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <BackButton fallbackPath="/" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* IMAGE */}
            <div className="relative max-w-full mx-auto">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {!product.inStock && (
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="text-base">Out of Stock</Badge>
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-2">{product.category}</Badge>

                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted"}`}
                      />
                    ))}
                    <span className="text-muted-foreground ml-2 whitespace-nowrap">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                </div>

                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                  ${product.price.toFixed(2)}
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* QUANTITY + BTNS */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    -
                  </Button>

                  <span className="w-12 text-center font-medium">{quantity}</span>

                  <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                    +
                  </Button>
                </div>

                <Button
                  className="flex-1 min-w-[150px]"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>

                <Link href="/checkout">
                  <Button variant="default" className="flex-1 min-w-[150px]" disabled={!product.inStock}>
                    Buy Now
                  </Button>
                </Link>

                <Button variant="outline" size="icon" onClick={handleWishlist}>
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* FEATURES CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-sm font-medium">Free Shipping</div>
                    <div className="text-xs text-muted-foreground">On orders over $50</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-sm font-medium">Warranty</div>
                    <div className="text-xs text-muted-foreground">2 year guarantee</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <RefreshCw className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-sm font-medium">Returns</div>
                    <div className="text-xs text-muted-foreground">30-day return</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* FEATURES + SPECS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Features</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Specifications</h2>
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b pb-2">
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground break-all">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
