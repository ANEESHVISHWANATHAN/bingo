import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  PanelTop,
  PanelBottom,
  Image,
  Users,
  ShoppingCart,
  Settings,
  FileText,
  Filter,
  ArrowRight,
  Package,
  UserCog,
} from "lucide-react";

interface AdminSection {
  title: string;
  description: string;
  icon: any;
  path: string;
  color: string;
}

const adminSections: AdminSection[] = [
  {
    title: "Header Configuration",
    description: "Manage site name, navigation links, cart count, and mobile menu",
    icon: PanelTop,
    path: "/admin-dashboard",
    color: "bg-blue-500",
  },
  {
    title: "Footer Configuration",
    description: "Customize footer sections, social links, newsletter, and copyright",
    icon: PanelBottom,
    path: "/footer-admin",
    color: "bg-green-500",
  },
  {
    title: "Carousel Management",
    description: "Add, edit, or remove hero carousel slides with images and content",
    icon: Image,
    path: "/carousel-dashboard",
    color: "bg-purple-500",
  },
  {
    title: "User Dashboard",
    description: "Configure tabs, fields, and sections displayed in user dashboard",
    icon: UserCog,
    path: "/admin-userboard",
    color: "bg-indigo-500",
  },
  {
    title: "Product Posting",
    description: "Manage product fields, categories, and posting form configuration",
    icon: Package,
    path: "/product-posting-admin",
    color: "bg-orange-500",
  },
  {
    title: "Filter Bar",
    description: "Configure product filters, categories, and price ranges",
    icon: Filter,
    path: "/filter-admin",
    color: "bg-pink-500",
  },
];

export default function ComprehensiveAdmin() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Admin Control Panel</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Comprehensive management of all e-commerce components and settings
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">2.4K</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Orders Today</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">$12.4K</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Component Management Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {adminSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${section.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={section.path}>
                    <Button className="w-full" variant="outline">
                      Manage {section.title}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Settings
            </CardTitle>
            <CardDescription>
              Global settings and configurations for the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Site Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">Enable maintenance mode</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Manage email templates</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Payment Gateways</p>
                  <p className="text-sm text-muted-foreground">Configure payment methods</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Shipping Options</p>
                  <p className="text-sm text-muted-foreground">Manage shipping zones</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

