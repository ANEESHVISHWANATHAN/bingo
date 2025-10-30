import ProductCard from '../ProductCard';

export default function ProductCardExample() {
  return (
    <div className="max-w-sm">
      <ProductCard
        id="1"
        name="Premium Wireless Headphones"
        price={199}
        image=""
        category="Electronics"
        stock={15}
      />
    </div>
  );
}
