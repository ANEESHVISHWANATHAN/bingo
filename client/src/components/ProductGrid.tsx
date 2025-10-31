import ProductCard from "./ProductCard";
import headphonesImg from "@assets/generated_images/Bluetooth_headphones_product_image_293d0afb.png";
import walletImg from "@assets/generated_images/Leather_wallet_product_image_6964689a.png";
import smartwatchImg from "@assets/generated_images/Smartwatch_product_image_9f288674.png";
import backpackImg from "@assets/generated_images/Laptop_backpack_product_image_23ad0421.png";
import bottleImg from "@assets/generated_images/Water_bottle_product_image_92e5f2dc.png";
import lampImg from "@assets/generated_images/Desk_lamp_product_image_9d89bccf.png";

// TODO: Remove mock data - replace with real product data from backend
const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    image: headphonesImg,
    category: "Electronics",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 2,
    name: "Premium Leather Wallet",
    price: 49.99,
    image: walletImg,
    category: "Accessories",
    rating: 4.8,
    inStock: true,
  },
  {
    id: 3,
    name: "Smart Watch Pro",
    price: 199.99,
    image: smartwatchImg,
    category: "Wearables",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 4,
    name: "Laptop Backpack",
    price: 89.99,
    image: backpackImg,
    category: "Bags",
    rating: 4.6,
    inStock: true,
  },
  {
    id: 5,
    name: "Insulated Water Bottle",
    price: 29.99,
    image: bottleImg,
    category: "Home & Living",
    rating: 4.4,
    inStock: true,
  },
  {
    id: 6,
    name: "Modern Desk Lamp",
    price: 59.99,
    image: lampImg,
    category: "Lighting",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 7,
    name: "Wireless Earbuds",
    price: 129.99,
    image: headphonesImg,
    category: "Electronics",
    rating: 4.6,
    inStock: false,
  },
  {
    id: 8,
    name: "Minimalist Wallet",
    price: 39.99,
    image: walletImg,
    category: "Accessories",
    rating: 4.3,
    inStock: true,
  },
];

export default function ProductGrid() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Featured Products</h2>
        <p className="text-muted-foreground">{products.length} products</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
