import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LogOut, Plus, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// TODO: Replace with actual data from backend
export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [newCarouselImage, setNewCarouselImage] = useState("");
  const [colorScheme, setColorScheme] = useState({
    primary: "#1e73be",
    secondary: "#d4d8dd",
    background: "#fafafa",
  });

  const handleLogout = () => {
    console.log("Admin logout");
    toast({ title: "Logged out successfully" });
    setLocation("/admin");
  };

  const handleAddCarouselImage = () => {
    console.log("Add carousel image:", newCarouselImage);
    toast({ title: "Carousel image added" });
    setNewCarouselImage("");
  };

  const handleColorUpdate = () => {
    console.log("Update colors:", colorScheme);
    toast({ title: "Color scheme updated" });
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          <Button variant="ghost" onClick={handleLogout} data-testid="button-logout">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="carousel" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-2">
            <TabsTrigger value="carousel" data-testid="tab-carousel">Carousel</TabsTrigger>
            <TabsTrigger value="products" data-testid="tab-products">Products</TabsTrigger>
            <TabsTrigger value="filters" data-testid="tab-filters">Filters</TabsTrigger>
            <TabsTrigger value="colors" data-testid="tab-colors">Colors</TabsTrigger>
            <TabsTrigger value="about" data-testid="tab-about">About Us</TabsTrigger>
            <TabsTrigger value="contact" data-testid="tab-contact">Contact</TabsTrigger>
            <TabsTrigger value="feedback" data-testid="tab-feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="carousel">
            <Card>
              <CardHeader>
                <CardTitle>Manage Carousel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter image URL"
                    value={newCarouselImage}
                    onChange={(e) => setNewCarouselImage(e.target.value)}
                    data-testid="input-carousel-url"
                  />
                  <Button onClick={handleAddCarouselImage} data-testid="button-add-carousel">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <span className="text-sm text-foreground">Carousel Slide {i}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Manage Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Wireless Headphones", "Leather Wallet", "Smart Watch"].map((product, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <div className="flex items-center gap-3">
                        <Badge>In Stock</Badge>
                        <span className="font-medium text-foreground">{product}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" data-testid={`button-edit-${i}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" data-testid={`button-delete-${i}`}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" data-testid="button-add-product">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="filters">
            <Card>
              <CardHeader>
                <CardTitle>Manage Filter Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["Electronics", "Accessories", "Wearables", "Home & Living"].map((cat, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <span className="font-medium text-foreground">{cat}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <CardTitle>Color Scheme Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Primary Color
                  </label>
                  <Input
                    type="color"
                    value={colorScheme.primary}
                    onChange={(e) => setColorScheme({ ...colorScheme, primary: e.target.value })}
                    data-testid="input-primary-color"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Secondary Color
                  </label>
                  <Input
                    type="color"
                    value={colorScheme.secondary}
                    onChange={(e) => setColorScheme({ ...colorScheme, secondary: e.target.value })}
                    data-testid="input-secondary-color"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Background Color
                  </label>
                  <Input
                    type="color"
                    value={colorScheme.background}
                    onChange={(e) => setColorScheme({ ...colorScheme, background: e.target.value })}
                    data-testid="input-background-color"
                  />
                </div>
                <Button onClick={handleColorUpdate} data-testid="button-update-colors">
                  Update Color Scheme
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>Edit About Us Page</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Page Title
                  </label>
                  <Input defaultValue="About Us" data-testid="input-about-title" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Content
                  </label>
                  <Textarea rows={8} defaultValue="CommerceCanvas was founded..." data-testid="input-about-content" />
                </div>
                <Button data-testid="button-save-about">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Edit Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Email
                  </label>
                  <Input defaultValue="support@commercecanvas.com" data-testid="input-contact-email" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Phone
                  </label>
                  <Input defaultValue="+1 (555) 123-4567" data-testid="input-contact-phone" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Address
                  </label>
                  <Textarea rows={3} defaultValue="123 Commerce St, Suite 100..." data-testid="input-contact-address" />
                </div>
                <Button data-testid="button-save-contact">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle>Customer Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Sarah Johnson", rating: 5, comment: "Excellent service!" },
                    { name: "Mike Chen", rating: 5, comment: "Great quality!" },
                    { name: "Emily Davis", rating: 4, comment: "Good experience." },
                  ].map((fb, i) => (
                    <div key={i} className="p-4 bg-muted rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{fb.name}</span>
                        <Badge>{fb.rating} ★</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{fb.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
