import { useEffect, useState, useRef } from "react";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
}

export default function UserDashboard() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // 🧠 Load initial carousel config
  useEffect(() => {
    fetch("/api/load-carousel")
      .then((res) => res.json())
      .then((data) => {
        console.log("🎠 Loaded carousel config:", data);
        setSlides(data.slides || []);
      })
      .catch((err) => console.error("❌ Failed to load carousel:", err));
  }, []);

  // 🔌 Connect WebSocket for live updates
  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.host}`);
    wsRef.current = ws;

    ws.onopen = () => console.log("🟢 WS connected (UserDashboard)");
    ws.onclose = () => console.log("🔴 WS disconnected");

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        // 🎠 When Admin updates carousel
        if (msg.type === "component-update" && msg.component === "carousel") {
          console.log("🔁 Carousel updated via WS:", msg.data);
          setSlides(msg.data.slides || []);
        }
      } catch (err) {
        console.error("❌ WS parse error:", err);
      }
    };

    return () => ws.close();
  }, []);

  // ⏭️ Auto-slide
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides]);

  if (slides.length === 0)
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-500">
        Loading carousel...
      </div>
    );

  const current = slides[activeIndex];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-xl">
      {/* Image */}
      <img
        src={current.image}
        alt={current.title}
        className="w-full h-80 object-cover transition-all duration-700"
      />

      {/* Overlay Text */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-6">
        <h2 className="text-3xl font-bold mb-2">{current.title}</h2>
        <p className="text-lg opacity-90">{current.subtitle}</p>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === activeIndex ? "bg-white scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
