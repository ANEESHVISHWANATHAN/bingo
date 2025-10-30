import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { X } from "lucide-react";
import { Button } from "./ui/button";

type FilterSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onFilterChange?: (filters: any) => void;
};

export default function FilterSidebar({ isOpen, onClose, onFilterChange }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<string[]>([]);

  const categories = ["Electronics", "Home & Living", "Fashion", "Sports & Outdoors", "Books"];
  const deliveryOptions = ["Standard", "Express", "Same Day"];

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updated = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category);
    setSelectedCategories(updated);
    onFilterChange?.({ categories: updated, delivery: selectedDelivery, priceRange });
  };

  const handleDeliveryChange = (delivery: string, checked: boolean) => {
    const updated = checked
      ? [...selectedDelivery, delivery]
      : selectedDelivery.filter(d => d !== delivery);
    setSelectedDelivery(updated);
    onFilterChange?.({ categories: selectedCategories, delivery: updated, priceRange });
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    onFilterChange?.({ categories: selectedCategories, delivery: selectedDelivery, priceRange: value });
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          data-testid="overlay-filter"
        />
      )}
      
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen md:top-24 md:h-auto w-80 md:w-64 bg-background border-r md:border-r-0 z-50 md:z-auto transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } overflow-y-auto p-6`}
        data-testid="sidebar-filters"
      >
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h3 className="font-semibold text-lg">Filters</h3>
          <Button size="icon" variant="ghost" onClick={onClose} data-testid="button-close-filters">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="font-semibold text-sm mb-4">Category</h3>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center gap-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    data-testid={`checkbox-category-${category.toLowerCase().replace(/\s/g, '-')}`}
                  />
                  <Label htmlFor={category} className="text-sm cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-sm mb-4">Price Range</h3>
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={500}
              step={10}
              className="mb-4"
              data-testid="slider-price"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span data-testid="text-price-min">${priceRange[0]}</span>
              <span data-testid="text-price-max">${priceRange[1]}</span>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-sm mb-4">Delivery</h3>
            <div className="space-y-3">
              {deliveryOptions.map((delivery) => (
                <div key={delivery} className="flex items-center gap-2">
                  <Checkbox
                    id={delivery}
                    checked={selectedDelivery.includes(delivery)}
                    onCheckedChange={(checked) => handleDeliveryChange(delivery, checked as boolean)}
                    data-testid={`checkbox-delivery-${delivery.toLowerCase().replace(/\s/g, '-')}`}
                  />
                  <Label htmlFor={delivery} className="text-sm cursor-pointer">
                    {delivery}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
