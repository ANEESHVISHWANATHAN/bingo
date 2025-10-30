import ProductGrid from '../ProductGrid';

export default function ProductGridExample() {
  const products = [
    { id: '1', name: 'Premium Wireless Headphones', price: 199, image: '', category: 'Electronics', stock: 15 },
    { id: '2', name: 'Leather Messenger Bag', price: 129, image: '', category: 'Fashion', stock: 8 },
    { id: '3', name: 'Ceramic Coffee Mug Set', price: 45, image: '', category: 'Home & Living', stock: 23 },
    { id: '4', name: 'Yoga Mat Pro', price: 79, image: '', category: 'Sports & Outdoors', stock: 12 },
  ];

  return (
    <div className="p-6">
      <ProductGrid products={products} />
    </div>
  );
}
