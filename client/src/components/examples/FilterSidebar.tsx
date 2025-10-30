import { useState } from 'react';
import FilterSidebar from '../FilterSidebar';
import { Button } from '../ui/button';

export default function FilterSidebarExample() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex gap-4">
      <FilterSidebar 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        onFilterChange={(filters) => console.log('Filters changed:', filters)}
      />
      <div className="flex-1 p-6">
        <Button onClick={() => setIsOpen(true)}>Open Filters</Button>
      </div>
    </div>
  );
}
