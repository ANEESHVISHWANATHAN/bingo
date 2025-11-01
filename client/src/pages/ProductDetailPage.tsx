import { useRoute, Link } from "wouter";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, Star, Truck, Shield, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Image paths - use static paths that work in both dev and production
// In production, images are served from /assets endpoint (configured in server)
const imageBase = "/assets/generated_images";

const headphonesImg = `${imageBase}/Bluetooth_headphones_product_image_293d0afb.png`;
const walletImg = `${imageBase}/Leather_wallet_product_image_6964689a.png`;
const smartwatchImg = `${imageBase}/Smartwatch_product_image_9f288674.png`;
const backpackImg = `${imageBase}/Laptop_backpack_product_image_23ad0421.png`;
const bottleImg = `${imageBase}/Water_bottle_product_image_92e5f2dc.png`;
const lampImg = `${imageBase}/Desk_lamp_product_image_9d89bccf.png`;

// TODO: Remove mock data - fetch product details from backend API
const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    image: headphonesImg,
    category: "Electronics",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio quality. Perfect for music lovers and professionals.",
    features: [
      "Active Noise Cancellation",
      "30-hour battery life",
      "Bluetooth 5.0 connectivity",
      "Built-in microphone",
      "Foldable design",
      "Premium leather ear cushions"
    ],
    specifications: {
      "Brand": "AudioTech",
      "Color": "Black",
      "Connectivity": "Wireless",
      "Battery Life": "30 hours",
      "Weight": "250g"
    }
  },
  {
    id: 2,
    name: "Premium Leather Wallet",
    price: 49.99,
    image: walletImg,
    category: "Accessories",
    rating: 4.8,
    reviews: 95,
    inStock: true,
    description: "Handcrafted genuine leather wallet with RFID protection. Features multiple card slots and a sleek, minimalist design that ages beautifully.",
    features: [
      "Genuine leather construction",
      "RFID blocking technology",
      "8 card slots",
      "2 bill compartments",
      "Slim profile design",
      "Premium stitching"
    ],
    specifications: {
      "Material": "Genuine Leather",
      "Color": "Brown",
      "Dimensions": "11 x 9 x 2 cm",
      "Card Slots": "8",
      "Weight": "80g"
    }
  },
  {
    id: 3,
    name: "Smart Watch Pro",
    price: 199.99,
    image: smartwatchImg,
    category: "Wearables",
    rating: 4.7,
    reviews: 203,
    inStock: true,
    description: "Advanced smartwatch with health tracking, GPS, and smartphone integration. Monitor your fitness goals and stay connected on the go.",
    features: [
      "Heart rate monitoring",
      "GPS tracking",
      "Water resistant (50m)",
      "7-day battery life",
      "Sleep tracking",
      "Smartphone notifications"
    ],
    specifications: {
      "Display": "1.4-inch AMOLED",
      "Battery": "7 days",
      "Water Resistance": "5 ATM",
      "Connectivity": "Bluetooth, WiFi",
      "Compatibility": "iOS & Android"
    }
  },
  {
    id: 4,
    name: "Laptop Backpack",
    price: 89.99,
    image: backpackImg,
    category: "Bags",
    rating: 4.6,
    reviews: 156,
    inStock: true,
    description: "Durable laptop backpack with anti-theft features and USB charging port. Perfect for commuters and travelers.",
    features: [
      "Fits up to 17-inch laptop",
      "USB charging port",
      "Anti-theft back pocket",
      "Water-resistant material",
      "Padded shoulder straps",
      "Multiple compartments"
    ],
    specifications: {
      "Capacity": "35L",
      "Material": "Waterproof Nylon",
      "Laptop Size": "Up to 17 inches",
      "Dimensions": "45 x 30 x 15 cm",
      "Weight": "900g"
    }
  },
  {
    id: 5,
    name: "Insulated Water Bottle",
    price: 29.99,
    image: bottleImg,
    category: "Home & Living",
    rating: 4.4,
    reviews: 87,
    inStock: true,
    description: "Double-wall vacuum insulated stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours.",
    features: [
      "Double-wall insulation",
      "Leak-proof lid",
      "BPA-free materials",
      "Wide mouth opening",
      "Easy to clean",
      "Fits cup holders"
    ],
    specifications: {
      "Capacity": "750ml",
      "Material": "Stainless Steel",
      "Insulation": "24h cold / 12h hot",
      "Dimensions": "27 x 7.5 cm",
      "Weight": "350g"
    }
  },
  {
    id: 6,
    name: "Modern Desk Lamp",
    price: 59.99,
    image: lampImg,
    category: "Lighting",
    rating: 4.5,
    reviews: 112,
    inStock: true,
    description: "LED desk lamp with adjustable brightness and color temperature. Perfect for reading, studying, or working.",
    features: [
      "Adjustable brightness",
      "3 color temperatures",
      "Flexible arm",
      "Energy efficient LED",
      "Touch controls",
      "USB charging port"
    ],
    specifications: {
      "Light Source": "LED",
      "Power": "12W",
      "Color Temperature": "3000K - 6000K",
      "Brightness Levels": "5",
      "Dimensions": "40 x 15 x 8 cm"
    }
  },
  {
    id: 7,
    name: "Wireless Earbuds",
    price: 129.99,
    image: headphonesImg,
    category: "Electronics",
    rating: 4.6,
    reviews: 178,
    inStock: false,
    description: "True wireless earbuds with premium sound quality and active noise cancellation. Compact charging case included.",
    features: [
      "Active noise cancellation",
      "6-hour playback",
      "Wireless charging case",
      "IPX4 water resistance",
      "Touch controls",
      "Premium sound quality"
    ],
    specifications: {
      "Battery": "6h + 24h case",
      "Connectivity": "Bluetooth 5.2",
      "Water Resistance": "IPX4",
      "Weight": "5g per earbud",
      "Charging": "USB-C"
    }
  },
  {
    id: 8,
    name: "Minimalist Wallet",
    price: 39.99,
    image: walletImg,
    category: "Accessories",
    rating: 4.3,
    reviews: 64,
    inStock: true,
    description: "Ultra-slim minimalist wallet with carbon fiber construction. Hold your essentials without the bulk.",
    features: [
      "Carbon fiber material",
      "RFID protection",
      "Holds 6-12 cards",
      "Money clip included",
      "Ultra-slim design",
      "Lifetime warranty"
    ],
    specifications: {
      "Material": "Carbon Fiber",
      "Capacity": "6-12 cards",
      "Dimensions": "9 x 6 x 0.5 cm",
      "Weight": "45g",
      "Color": "Black"
    }
  },
];

export default function ProductDetailPage() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : null;
  const product = products.find(p => p.id === productId);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Product Not Found</h1>
            <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    console.log(`Add ${quantity} of ${product.name} to cart`);
    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.name}`,
    });
  };

  const handleWishlist = () => {
    console.log(`Add ${product.name} to wishlist`);
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
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  data-testid="img-product-detail"
                />
              </div>
              {!product.inStock && (
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="text-base">Out of Stock</Badge>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-product-title">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted"}`}
                      />
                    ))}
                    <span className="text-muted-foreground ml-2">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                </div>
                <div className="text-4xl font-bold text-foreground mb-6" data-testid="text-product-price">
                  ${product.price.toFixed(2)}
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    data-testid="button-decrease-quantity"
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium" data-testid="text-quantity">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    data-testid="button-increase-quantity"
                  >
                    +
                  </Button>
                </div>
                <Button
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Link href="/checkout">
                  <Button variant="default" className="flex-1" disabled={!product.inStock}>
                    Buy Now
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleWishlist}
                  data-testid="button-add-wishlist"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
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

          {/* Product Details Tabs */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Features</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Specifications</h2>
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b pb-2">
                      <span className="font-medium text-foreground">{key}</span>
                      <span className="text-muted-foreground">{value}</span>
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
