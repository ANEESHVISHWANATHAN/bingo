import ProductCard from '../ProductCard';
import headphonesImg from '@assets/generated_images/Bluetooth_headphones_product_image_293d0afb.png';

export default function ProductCardExample() {
  return (
    <div className="p-4 max-w-sm">
      <ProductCard
        id={1}
        name="Wireless Bluetooth Headphones"
        price={79.99}
        image={headphonesImg}
        category="Electronics"
        rating={4.5}
        inStock={true}
      />
    </div>
  );
}
