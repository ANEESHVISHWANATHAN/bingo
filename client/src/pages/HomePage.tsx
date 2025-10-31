import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import FilterBar from "@/components/FilterBar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroCarousel />
        <FilterBar />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
}
