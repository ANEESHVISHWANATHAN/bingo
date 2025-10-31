import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// TODO: Remove mock data - replace with real feedback from backend
const sampleFeedback = [
  { id: 1, name: "Sarah Johnson", rating: 5, comment: "Excellent service and fast shipping!", date: "2024-10-15" },
  { id: 2, name: "Mike Chen", rating: 5, comment: "Great product quality. Highly recommend!", date: "2024-10-20" },
  { id: 3, name: "Emily Davis", rating: 4, comment: "Good experience overall. Minor packaging issue.", date: "2024-10-25" },
];

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast({
        title: "Please select a rating",
        variant: "destructive",
      });
      return;
    }
    console.log("Feedback submitted:", { ...formData, rating });
    toast({
      title: "Thank you for your feedback!",
      description: "Your input helps us improve our service.",
    });
    setFormData({ name: "", email: "", feedback: "" });
    setRating(0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-8">Customer Feedback</h1>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Share Your Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Name
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        data-testid="input-feedback-name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Email
                      </label>
                      <Input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        data-testid="input-feedback-email"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="p-1"
                            data-testid={`star-${star}`}
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= (hoveredRating || rating)
                                  ? "fill-primary text-primary"
                                  : "text-muted"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Your Feedback
                      </label>
                      <Textarea
                        required
                        value={formData.feedback}
                        onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                        placeholder="Tell us about your experience..."
                        rows={5}
                        data-testid="input-feedback-text"
                      />
                    </div>
                    <Button type="submit" className="w-full" data-testid="button-submit-feedback">
                      Submit Feedback
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Recent Feedback</h2>
              <div className="space-y-4">
                {sampleFeedback.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-foreground">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.date}</div>
                        </div>
                        <Badge variant="secondary">
                          {item.rating} <Star className="h-3 w-3 inline ml-1 fill-current" />
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{item.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
