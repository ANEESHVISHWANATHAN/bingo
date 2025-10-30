import ProductCard from "./ProductCard";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6" data-testid="grid-products">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
