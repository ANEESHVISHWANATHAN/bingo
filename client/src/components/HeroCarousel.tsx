import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroCarousel() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // 🔄 Fetch carousel data on mount
  useEffect(() => {
    fetch("/api/load-carousel")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.slides)) setSlides(data.slides);
      })
      .catch((err) => console.error("❌ Failed to load carousel:", err));
  }, []);

  // ⏱ Auto-slide
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(
      () => setCurrentSlide((p) => (p + 1) % slides.length),
      5000
    );
    return () => clearInterval(timer);
  }, [slides]);

  // 🔌 Live updates via WebSocket
  useEffect(() => {
    const ws = new WebSocket(`wss://${window.location.host}`);
    ws.onopen = () => console.log("✅ [Carousel WS] Connected");
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === "component-update" && msg.component === "carousel") {
        console.log("🧩 Carousel updated via WS");
        setSlides(msg.data.slides || []);
      }
    };
    return () => ws.close();
  }, []);

  const nextSlide = () =>
    setCurrentSlide((p) => (p + 1) % slides.length || 0);
  const prevSlide = () =>
    setCurrentSlide((p) => (p - 1 + slides.length) % slides.length || 0);

  if (slides.length === 0)
    return (
      <div className="h-[400px] md:h-[500px] flex items-center justify-center bg-muted text-muted-foreground">
        Loading carousel…
      </div>
    );

  const slide = slides[currentSlide];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-card">
      <img
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
          {slide.title}
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-6">
          {slide.subtitle}
        </p>
        <Button
          variant="outline"
          className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          Shop Now
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            onClick={() => setCurrentSlide(i)}
          />
        ))}
      </div>
    </div>
  );
}
