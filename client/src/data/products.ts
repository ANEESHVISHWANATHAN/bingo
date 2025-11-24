
const imageBase = "/assets/generated_images";

export const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    image: `${imageBase}/Bluetooth_headphones_product_image_293d0afb.png`,
    category: "Electronics",
    rating: 4.5,
    inStock: true,
    description: "High-quality wireless sound.",
    reviews: 12,
    features: ["Bluetooth 5.2", "Fast charging", "Noise isolation"],
    specifications: { Weight: "200g", Battery: "24h" }
  },

  {
    id: 2,
    name: "Premium Leather Wallet",
    price: 49.99,
    image: `${imageBase}/Leather_wallet_product_image_6964689a.png`,
    category: "Accessories",
    rating: 4.8,
    inStock: true,
    description: "Hand-crafted premium wallet.",
    reviews: 18,
    features: ["Genuine leather", "Slim build"],
    specifications: { Material: "Leather", Slots: "8" }
  },

  {
    id: 3,
    name: "Smart Watch Pro",
    price: 199.99,
    image: `${imageBase}/Smartwatch_product_image_9f288674.png`,
    category: "Wearables",
    rating: 4.7,
    inStock: true,
    description: "A premium smartwatch with health tracking.",
    reviews: 23,
    features: ["Heart rate monitor", "GPS tracking", "Fast charging"],
    specifications: { Battery: "36h", Weight: "120g" }
  },

  {
    id: 4,
    name: "Laptop Backpack",
    price: 89.99,
    image: `${imageBase}/Laptop_backpack_product_image_23ad0421.png`,
    category: "Bags",
    rating: 4.6,
    inStock: true,
    description: "Durable backpack for laptops up to 17 inches.",
    reviews: 32,
    features: ["Waterproof", "Anti-theft pocket"],
    specifications: { Capacity: "25L", Material: "Nylon" }
  },

  {
    id: 5,
    name: "Insulated Water Bottle",
    price: 29.99,
    image: `${imageBase}/Water_bottle_product_image_92e5f2dc.png`,
    category: "Home & Living",
    rating: 4.4,
    inStock: true,
    description: "Stainless steel insulated bottle.",
    reviews: 41,
    features: ["Keeps hot 12h", "Keeps cold 24h"],
    specifications: { Capacity: "1L", Material: "Stainless steel" }
  },

  {
    id: 6,
    name: "Modern Desk Lamp",
    price: 59.99,
    image: `${imageBase}/Desk_lamp_product_image_9d89bccf.png`,
    category: "Lighting",
    rating: 4.5,
    inStock: true,
    description: "Minimal desk lamp with LED lighting.",
    reviews: 15,
    features: ["Adjustable arm", "Warm & cool lights"],
    specifications: { Power: "12W", Weight: "500g" }
  },

  {
    id: 7,
    name: "Wireless Earbuds",
    price: 129.99,
    image: `${imageBase}/Bluetooth_headphones_product_image_293d0afb.png`,
    category: "Electronics",
    rating: 4.6,
    inStock: false,
    description: "Compact earbuds with premium sound.",
    reviews: 50,
    features: ["ANC", "Touch controls"],
    specifications: { Battery: "20h", Weight: "50g" }
  },

  {
    id: 8,
    name: "Minimalist Wallet",
    price: 39.99,
    image: `${imageBase}/Leather_wallet_product_image_6964689a.png`,
    category: "Accessories",
    rating: 4.3,
    inStock: true,
    description: "Slim and lightweight minimalist wallet.",
    reviews: 22,
    features: ["RFID protection", "Slim design"],
    specifications: { Material: "Faux leather", Slots: "6" }
  }
];
