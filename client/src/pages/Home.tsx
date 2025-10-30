import { useState } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

export default function Home() {
  const [filterOpen, setFilterOpen] = useState(false);

  const mockProducts = [
    { id: '1', name: 'Premium Wireless Headphones', price: 199, image: '', category: 'Electronics', stock: 15 },
    { id: '2', name: 'Leather Messenger Bag', price: 129, image: '', category: 'Fashion', stock: 8 },
    { id: '3', name: 'Ceramic Coffee Mug Set', price: 45, image: '', category: 'Home & Living', stock: 23 },
    { id: '4', name: 'Yoga Mat Pro', price: 79, image: '', category: 'Sports & Outdoors', stock: 12 },
    { id: '5', name: 'Stainless Steel Water Bottle', price: 35, image: '', category: 'Sports & Outdoors', stock: 42 },
    { id: '6', name: 'Minimalist Desk Lamp', price: 89, image: '', category: 'Home & Living', stock: 18 },
    { id: '7', name: 'Organic Cotton T-Shirt', price: 29, image: '', category: 'Fashion', stock: 56 },
    { id: '8', name: 'Bluetooth Speaker', price: 149, image: '', category: 'Electronics', stock: 9 },
    { id: '9', name: 'Wool Throw Blanket', price: 95, image: '', category: 'Home & Living', stock: 14 },
    { id: '10', name: 'Running Shoes', price: 159, image: '', category: 'Sports & Outdoors', stock: 21 },
    { id: '11', name: 'Smart Watch', price: 299, image: '', category: 'Electronics', stock: 7 },
    { id: '12', name: 'Leather Wallet', price: 59, image: '', category: 'Fashion', stock: 33 },
  ];

  return (
    <div className="min-h-screen">
      <HeroCarousel />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-20">
        <div className="flex gap-8">
          <div className="hidden md:block flex-shrink-0">
            <FilterSidebar 
              isOpen={true} 
              onClose={() => {}} 
              onFilterChange={(filters) => console.log('Filters:', filters)}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-semibold mb-2">
                  All Products
                </h2>
                <p className="text-muted-foreground" data-testid="text-product-count">
                  {mockProducts.length} products available
                </p>
              </div>
              
              <Button
                variant="outline"
                className="md:hidden"
                onClick={() => setFilterOpen(true)}
                data-testid="button-open-filters"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            <ProductGrid products={mockProducts} />
          </div>
        </div>
      </div>

      <FilterSidebar 
        isOpen={filterOpen} 
        onClose={() => setFilterOpen(false)}
        onFilterChange={(filters) => console.log('Filters:', filters)}
      />
    </div>
  );
}
