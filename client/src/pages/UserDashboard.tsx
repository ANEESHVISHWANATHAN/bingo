import { useState } from "react";
import { Home, Package, CreditCard, DollarSign, Receipt, Upload } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

// TODO: Remove mock data - replace with real user data from backend
const menuItems = [
  { title: "Dashboard", icon: Home, id: "dashboard" },
  { title: "Order History", icon: Package, id: "orders" },
  { title: "Transactions", icon: CreditCard, id: "transactions" },
  { title: "Billing", icon: Receipt, id: "billing" },
  { title: "Sell Product", icon: Upload, id: "sell" },
];

const mockOrders = [
  { id: "#ORD-001", date: "2024-10-20", status: "Delivered", total: 129.98 },
  { id: "#ORD-002", date: "2024-10-25", status: "Shipped", total: 79.99 },
  { id: "#ORD-003", date: "2024-10-28", status: "Processing", total: 199.99 },
];

const mockTransactions = [
  { id: "TXN-001", date: "2024-10-20", amount: 129.98, method: "Credit Card", status: "Completed" },
  { id: "TXN-002", date: "2024-10-25", amount: 79.99, method: "PayPal", status: "Completed" },
  { id: "TXN-003", date: "2024-10-28", amount: 199.99, method: "Credit Card", status: "Pending" },
];

export default function UserDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { toast } = useToast();
  const [sellForm, setSellForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });

  const handleSellProduct = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sell product:", sellForm);
    // TODO: Implement backend API call to post product
    toast({
      title: "Product listed successfully!",
      description: "Your product will be visible to all users soon.",
    });
    setSellForm({ title: "", description: "", price: "", category: "", imageUrl: "" });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Welcome Back!</h1>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">24</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">$1,249</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Products Sold</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">8</div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "orders":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Order History</h1>
            <div className="space-y-3">
              {mockOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-foreground">{order.id}</div>
                        <div className="text-sm text-muted-foreground">{order.date}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant={order.status === "Delivered" ? "default" : "secondary"}>
                          {order.status}
                        </Badge>
                        <div className="font-bold text-foreground mt-1">${order.total}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "transactions":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
            <div className="space-y-3">
              {mockTransactions.map((txn) => (
                <Card key={txn.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-foreground">{txn.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {txn.date} • {txn.method}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={txn.status === "Completed" ? "default" : "secondary"}>
                          {txn.status}
                        </Badge>
                        <div className="font-bold text-foreground mt-1">${txn.amount}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "billing":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Billing Information</h1>
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-md">
                    <div className="font-medium text-foreground">Visa ending in 4242</div>
                    <div className="text-sm text-muted-foreground">Expires 12/25</div>
                  </div>
                  <Button variant="outline" data-testid="button-add-payment">Add Payment Method</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "sell":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Sell a Product</h1>
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSellProduct} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Product Title
                    </label>
                    <Input
                      required
                      value={sellForm.title}
                      onChange={(e) => setSellForm({ ...sellForm, title: e.target.value })}
                      placeholder="Enter product name"
                      data-testid="input-sell-title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Description
                    </label>
                    <Textarea
                      required
                      value={sellForm.description}
                      onChange={(e) => setSellForm({ ...sellForm, description: e.target.value })}
                      placeholder="Describe your product"
                      rows={4}
                      data-testid="input-sell-description"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Price
                      </label>
                      <Input
                        required
                        type="number"
                        step="0.01"
                        value={sellForm.price}
                        onChange={(e) => setSellForm({ ...sellForm, price: e.target.value })}
                        placeholder="0.00"
                        data-testid="input-sell-price"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Category
                      </label>
                      <Input
                        required
                        value={sellForm.category}
                        onChange={(e) => setSellForm({ ...sellForm, category: e.target.value })}
                        placeholder="Electronics, Accessories..."
                        data-testid="input-sell-category"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                      Image URL
                    </label>
                    <Input
                      required
                      value={sellForm.imageUrl}
                      onChange={(e) => setSellForm({ ...sellForm, imageUrl: e.target.value })}
                      placeholder="https://..."
                      data-testid="input-sell-image"
                    />
                  </div>
                  <Button type="submit" className="w-full" data-testid="button-submit-sell">
                    <Upload className="h-4 w-4 mr-2" />
                    List Product
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SidebarProvider style={sidebarStyle as React.CSSProperties}>
        <div className="flex h-[calc(100vh-64px)] w-full">
          <Sidebar>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>My Account</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            onClick={() => setActiveSection(item.id)}
                            isActive={activeSection === item.id}
                            data-testid={`sidebar-${item.id}`}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <div className="flex flex-col flex-1 overflow-hidden">
            <header className="flex items-center gap-2 p-4 border-b bg-background">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h2 className="font-semibold text-foreground">Dashboard</h2>
            </header>
            <main className="flex-1 overflow-auto p-6 bg-muted">
              {renderContent()}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
