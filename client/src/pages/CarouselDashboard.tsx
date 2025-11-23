import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import BackButton from "@/components/BackButton";

type Slide = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
};

export default function AdminCarouselDashboard() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    fetch("/api/load-carousel")
      .then((res) => res.json())
      .then((data) => setSlides(data.slides || []))
      .catch(() => console.warn("⚠️ No carousel config found."));

    const wsUrl =
      window.location.origin.replace(/^http/, "ws") ||
      "wss://bingo-1-13zd.onrender.com";
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => console.log("✅ [AdminCarousel WS] Connected");
    ws.onclose = () => console.warn("⚠️ [AdminCarousel WS] Disconnected");
    ws.onerror = (e) => console.error("❌ [AdminCarousel WS] Error:", e);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "component-update" && msg.component === "carousel") {
          setSlides(msg.data.slides || []);
        }
      } catch (err) {
        console.error("❌ Invalid WS message:", event.data);
      }
    };

    return () => ws.close();
  }, []);

  const sendWS = (msg: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN)
      wsRef.current.send(JSON.stringify(msg));
    else console.warn("[AdminCarousel WS] Not connected");
  };

  const handleAddSlide = () => {
    if (!newTitle.trim() || !newImage) return alert("Please add image & title");

    const reader = new FileReader();
    reader.onload = () => {
      const newSlide: Slide = {
        id: Date.now(),
        image: reader.result as string,
        title: newTitle,
        subtitle: newSubtitle,
      };

      const updated = [...slides, newSlide];
      setSlides(updated);
      setNewTitle("");
      setNewSubtitle("");
      setNewImage(null);

      sendWS({
        type: "update-component",
        component: "carousel",
        data: { slides: updated },
      });
    };
    reader.readAsDataURL(newImage);
  };

  const handleDelete = (id: number) => {
    const updated = slides.filter((s) => s.id !== id);
    setSlides(updated);
    sendWS({
      type: "update-component",
      component: "carousel",
      data: { slides: updated },
    });
  };

  const handleSave = () => {
    sendWS({ type: "update-component", component: "carousel", data: { slides } });
    alert("✅ Carousel saved!");
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="mb-6">
        <BackButton fallbackPath="/admin-panel" />
      </div>

      <h1 className="text-2xl font-bold text-primary">
        Admin Panel — Carousel Configuration
      </h1>

      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="font-semibold text-lg">Add New Slide</h2>

          <div className="space-y-3">
            <Input
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <Input
              placeholder="Subtitle"
              value={newSubtitle}
              onChange={(e) => setNewSubtitle(e.target.value)}
            />

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setNewImage(e.target.files?.[0] || null)}
            />

            <Button onClick={handleAddSlide} className="w-full md:w-auto">
              ➕ Add Slide
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="font-semibold text-lg">Existing Slides</h2>

          <div className="space-y-4">
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="flex flex-col md:flex-row items-start md:items-center gap-4 border rounded-lg p-3"
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full md:w-24 h-32 md:h-16 object-cover rounded"
                />

                <div className="flex-1 w-full">
                  <Input
                    value={slide.title}
                    onChange={(e) => {
                      const updated = slides.map((s) =>
                        s.id === slide.id ? { ...s, title: e.target.value } : s
                      );
                      setSlides(updated);
                      sendWS({
                        type: "update-component",
                        component: "carousel",
                        data: { slides: updated },
                      });
                    }}
                  />

                  <Input
                    value={slide.subtitle}
                    onChange={(e) => {
                      const updated = slides.map((s) =>
                        s.id === slide.id ? { ...s, subtitle: e.target.value } : s
                      );
                      setSlides(updated);
                      sendWS({
                        type: "update-component",
                        component: "carousel",
                        data: { slides: updated },
                      });
                    }}
                    placeholder="Subtitle"
                    className="mt-2"
                  />
                </div>

                <Button
                  variant="destructive"
                  onClick={() => handleDelete(slide.id)}
                  className="w-full md:w-auto"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button className="w-full" onClick={handleSave}>
        💾 Save Carousel
      </Button>
    </div>
  );
}
