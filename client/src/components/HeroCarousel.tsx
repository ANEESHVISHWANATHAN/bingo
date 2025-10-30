import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Premium Outdoor Gear",
    subtitle: "Explore the wilderness in style",
    cta: "Shop Collection",
    gradient: "from-blue-600/40 to-purple-600/40"
  },
  {
    id: 2,
    title: "Handcrafted Home Goods",
    subtitle: "Elevate your living space",
    cta: "Discover More",
    gradient: "from-amber-600/40 to-orange-600/40"
  },
  {
    id: 3,
    title: "Modern Accessories",
    subtitle: "Style meets functionality",
    cta: "View Products",
    gradient: "from-emerald-600/40 to-teal-600/40"
  },
  {
    id: 4,
    title: "Curated Essentials",
    subtitle: "Quality you can trust",
    cta: "Browse Now",
    gradient: "from-rose-600/40 to-pink-600/40"
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const next = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  return (
    <div 
      className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      data-testid="carousel-hero"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          
          <div className="relative h-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col justify-center">
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-white mb-4 max-w-3xl">
              {slide.title}
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
              {slide.subtitle}
            </p>
            <div>
              <Button 
                size="lg" 
                className="rounded-full px-8 backdrop-blur-md bg-white/90 text-foreground hover:bg-white border border-white/20"
                data-testid={`button-cta-${index}`}
              >
                {slide.cta}
              </Button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full backdrop-blur-md bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        data-testid="button-carousel-prev"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full backdrop-blur-md bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        data-testid="button-carousel-next"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index);
              setIsAutoPlaying(false);
            }}
            className={`h-2 rounded-full transition-all ${
              index === current ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            data-testid={`button-carousel-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
