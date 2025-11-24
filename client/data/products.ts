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

  
];
