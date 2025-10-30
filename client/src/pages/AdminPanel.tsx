import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Settings, Palette, Package, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminPanel() {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    siteName: "Premium Store",
    tagline: "Quality Physical Goods",
    freeShippingThreshold: 50,
    taxRate: 8,
    returnPolicyDays: 30,
    primaryColor: "#4F46E5",
    accentColor: "#F59E0B",
  });

  const [paymentGateways, setPaymentGateways] = useState({
    stripeEnabled: true,
    paypalEnabled: true,
  });

  useEffect(() => {
    console.log('TODO: Fetch config from /api/config');
  }, []);

  const handleSaveConfig = () => {
    console.log('Saving configuration:', config);
    console.log('TODO: Backend integration - PUT /api/config');
    console.log('fetch("/api/config", { method: "PUT", headers: { "Authorization": "Bearer {admin_token}" }, body: JSON.stringify(config) })');
    
    toast({
      title: "Settings saved",
      description: "Your configuration has been updated successfully.",
    });
  };

  const handleSavePaymentGateways = () => {
    console.log('Saving payment gateway settings:', paymentGateways);
    console.log('TODO: Backend integration - PUT /api/payment-gateways');
    
    toast({
      title: "Payment settings saved",
      description: "Payment gateway configuration has been updated.",
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-semibold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Configure your eCommerce store settings</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general" data-testid="tab-general">
              <Settings className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="appearance" data-testid="tab-appearance">
              <Palette className="w-4 h-4 mr-2" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="policies" data-testid="tab-policies">
              <Package className="w-4 h-4 mr-2" />
              Policies
            </TabsTrigger>
            <TabsTrigger value="payments" data-testid="tab-payments">
              <DollarSign className="w-4 h-4 mr-2" />
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Information</CardTitle>
                <CardDescription>
                  Basic information about your store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Store Name</Label>
                  <Input
                    id="site-name"
                    value={config.siteName}
                    onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                    data-testid="input-site-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={config.tagline}
                    onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                    data-testid="input-tagline"
                  />
                </div>

                <Button onClick={handleSaveConfig} data-testid="button-save-general">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Color Scheme</CardTitle>
                <CardDescription>
                  Customize the look and feel of your store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                        className="w-20 h-10"
                        data-testid="input-primary-color"
                      />
                      <Input
                        value={config.primaryColor}
                        onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accent-color">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accent-color"
                        type="color"
                        value={config.accentColor}
                        onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                        className="w-20 h-10"
                        data-testid="input-accent-color"
                      />
                      <Input
                        value={config.accentColor}
                        onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg text-sm">
                  <p className="font-semibold mb-2">Preview</p>
                  <div className="flex gap-2">
                    <div 
                      className="h-10 flex-1 rounded-md" 
                      style={{ backgroundColor: config.primaryColor }}
                    />
                    <div 
                      className="h-10 flex-1 rounded-md" 
                      style={{ backgroundColor: config.accentColor }}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveConfig} data-testid="button-save-appearance">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Policies</CardTitle>
                <CardDescription>
                  Configure shipping, returns, and tax policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shipping-threshold">Free Shipping Threshold ($)</Label>
                  <Input
                    id="shipping-threshold"
                    type="number"
                    value={config.freeShippingThreshold}
                    onChange={(e) => setConfig({ ...config, freeShippingThreshold: parseFloat(e.target.value) })}
                    data-testid="input-shipping-threshold"
                  />
                  <p className="text-sm text-muted-foreground">
                    Offer free shipping on orders above this amount
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    step="0.1"
                    value={config.taxRate}
                    onChange={(e) => setConfig({ ...config, taxRate: parseFloat(e.target.value) })}
                    data-testid="input-tax-rate"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="return-policy">Return Policy (days)</Label>
                  <Input
                    id="return-policy"
                    type="number"
                    value={config.returnPolicyDays}
                    onChange={(e) => setConfig({ ...config, returnPolicyDays: parseInt(e.target.value) })}
                    data-testid="input-return-policy"
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of days customers can return items
                  </p>
                </div>

                <Button onClick={handleSaveConfig} data-testid="button-save-policies">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Gateways</CardTitle>
                <CardDescription>
                  Enable or disable payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">Stripe</div>
                    <div className="text-sm text-muted-foreground">
                      Accept credit and debit cards
                    </div>
                  </div>
                  <Switch
                    checked={paymentGateways.stripeEnabled}
                    onCheckedChange={(checked) => setPaymentGateways({ ...paymentGateways, stripeEnabled: checked })}
                    data-testid="switch-stripe"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">PayPal</div>
                    <div className="text-sm text-muted-foreground">
                      Accept PayPal payments
                    </div>
                  </div>
                  <Switch
                    checked={paymentGateways.paypalEnabled}
                    onCheckedChange={(checked) => setPaymentGateways({ ...paymentGateways, paypalEnabled: checked })}
                    data-testid="switch-paypal"
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                  <p className="font-semibold">Configuration Required:</p>
                  <p className="text-muted-foreground">• Set STRIPE_SECRET_KEY in environment variables</p>
                  <p className="text-muted-foreground">• Set PAYPAL_CLIENT_ID and PAYPAL_SECRET</p>
                  <p className="text-muted-foreground">• Configure webhook endpoints in respective dashboards</p>
                </div>

                <Button onClick={handleSavePaymentGateways} data-testid="button-save-payments">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
