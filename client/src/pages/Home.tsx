import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import HeroCarousel from "@/components/HeroCarousel";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
};

export default function Home() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<any>({
    categories: [],
    delivery: [],
    priceRange: [0, 1000]
  });

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  useEffect(() => {
    const handleSearch = (event: CustomEvent) => {
      setSearchQuery(event.detail.query);
    };

    window.addEventListener('search', handleSearch as EventListener);
    return () => window.removeEventListener('search', handleSearch as EventListener);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filters.categories.length === 0 || 
      filters.categories.includes(product.category);
    
    const matchesPrice = product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen">
      <HeroCarousel />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-20">
        <div className="flex gap-8">
          <div className="hidden md:block flex-shrink-0">
            <FilterSidebar 
              isOpen={true} 
              onClose={() => {}} 
              onFilterChange={setFilters}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-semibold mb-2">
                  {searchQuery ? `Search: "${searchQuery}"` : "All Products"}
                </h2>
                <p className="text-muted-foreground" data-testid="text-product-count">
                  {filteredProducts.length} products available
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

            {isLoading ? (
              <div className="text-center py-12">Loading products...</div>
            ) : (
              <ProductGrid products={filteredProducts.map(p => ({
                ...p,
                image: p.images[0] || ''
              }))} />
            )}
          </div>
        </div>
      </div>

      <FilterSidebar 
        isOpen={filterOpen} 
        onClose={() => setFilterOpen(false)}
        onFilterChange={setFilters}
      />
    </div>
  );
}
