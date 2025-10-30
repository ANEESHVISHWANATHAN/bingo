import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, TrendingUp, DollarSign } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("orders");

  // TODO: Remove mock data - replace with real API calls
  const mockStats = {
    totalOrders: 24,
    totalSpent: 2847,
    activeOrders: 3,
    savedItems: 12,
  };

  const mockOrders = [
    { id: 'ORD-001', product: 'Premium Wireless Headphones', total: 199, status: 'delivered', date: '2025-10-15' },
    { id: 'ORD-002', product: 'Leather Messenger Bag', total: 129, status: 'shipped', date: '2025-10-20' },
    { id: 'ORD-003', product: 'Ceramic Coffee Mug Set', total: 45, status: 'processing', date: '2025-10-28' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'default';
      case 'shipped': return 'secondary';
      case 'processing': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-semibold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your orders and account</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold" data-testid="text-total-orders">
                {mockStats.totalOrders}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold" data-testid="text-total-spent">
                ${mockStats.totalSpent}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold" data-testid="text-active-orders">
                {mockStats.activeOrders}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold" data-testid="text-saved-items">
                {mockStats.savedItems}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
            <TabsTrigger value="wishlist" data-testid="tab-wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            {mockOrders.map((order) => (
              <Card key={order.id} data-testid={`card-order-${order.id}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold" data-testid={`text-order-id-${order.id}`}>
                          {order.id}
                        </h3>
                        <Badge variant={getStatusColor(order.status)} data-testid={`badge-status-${order.id}`}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground" data-testid={`text-product-${order.id}`}>
                        {order.product}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1" data-testid={`text-date-${order.id}`}>
                        Ordered on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-semibold" data-testid={`text-total-${order.id}`}>
                          ${order.total}
                        </p>
                      </div>
                      <Button variant="outline" data-testid={`button-view-${order.id}`}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="wishlist">
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Your wishlist is empty</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Account settings coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
