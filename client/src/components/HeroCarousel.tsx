import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Hero_carousel_banner_image_edc8b1a2.png";

// TODO: Remove mock data - replace with admin-managed carousel slides
const slides = [
  {
    id: 1,
    image: heroImage,
    title: "Welcome to CommerceCanvas",
    subtitle: "Discover premium products at unbeatable prices",
  },
  {
    id: 2,
    image: heroImage,
    title: "New Arrivals",
    subtitle: "Check out our latest collection",
  },
  {
    id: 3,
    image: heroImage,
    title: "Special Offers",
    subtitle: "Up to 50% off on selected items",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-card">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative w-full h-full">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {slide.title}
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-6">
                {slide.subtitle}
              </p>
              <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" data-testid="button-shop-now">
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
        onClick={prevSlide}
        data-testid="button-prev-slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
        onClick={nextSlide}
        data-testid="button-next-slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
            data-testid={`carousel-indicator-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
