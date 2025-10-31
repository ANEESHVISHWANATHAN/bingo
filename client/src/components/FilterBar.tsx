import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Laptop, Headphones, Watch, ShoppingBag, Home, Lightbulb, X } from "lucide-react";

// TODO: Remove mock data - replace with admin-managed categories
const categories = [
  { id: "all", name: "All Products", icon: ShoppingBag },
  { id: "electronics", name: "Electronics", icon: Laptop },
  { id: "accessories", name: "Accessories", icon: Headphones },
  { id: "wearables", name: "Wearables", icon: Watch },
  { id: "home", name: "Home & Living", icon: Home },
  { id: "lighting", name: "Lighting", icon: Lightbulb },
];

export default function FilterBar() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    console.log(`Filter by category: ${categoryId}`);
  };

  const handlePriceFilter = (range: string) => {
    setPriceRange(priceRange === range ? null : range);
    console.log(`Filter by price: ${range}`);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setPriceRange(null);
    console.log("Filters cleared");
  };

  const hasActiveFilters = selectedCategory !== "all" || priceRange !== null;

  return (
    <div className="bg-card border-y py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4">
          {/* Categories */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Categories</h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  data-testid="button-clear-filters"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <Button
                    key={category.id}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryClick(category.id)}
                    className="gap-2"
                    data-testid={`filter-category-${category.id}`}
                  >
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Price Range</h3>
            <div className="flex flex-wrap gap-2">
              {["Under $50", "$50-$100", "$100-$200", "Over $200"].map((range) => (
                <Badge
                  key={range}
                  variant={priceRange === range ? "default" : "outline"}
                  className="cursor-pointer hover-elevate active-elevate-2 px-3 py-1"
                  onClick={() => handlePriceFilter(range)}
                  data-testid={`filter-price-${range.replace(/\s/g, '-').toLowerCase()}`}
                >
                  {range}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
