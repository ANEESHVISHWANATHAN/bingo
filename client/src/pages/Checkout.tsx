import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Checkout() {
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [shippingMethod, setShippingMethod] = useState("standard");

  const handlePayment = () => {
    console.log('Processing payment with:', paymentMethod);
    
    if (paymentMethod === "stripe") {
      console.log('TODO: Backend integration - Initialize Stripe checkout');
      console.log('fetch("/api/create-stripe-session", { method: "POST", body: JSON.stringify(cart) })');
      console.log('.then(res => res.json()).then(({ sessionId }) => stripe.redirectToCheckout({ sessionId }))');
    } else if (paymentMethod === "paypal") {
      console.log('TODO: Backend integration - Initialize PayPal checkout');
      console.log('fetch("/api/create-paypal-order", { method: "POST", body: JSON.stringify(cart) })');
      console.log('.then(res => res.json()).then(({ orderId }) => paypal.Buttons({ createOrder: () => orderId }).render("#paypal-button"))');
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-semibold mb-8">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" data-testid="input-first-name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" data-testid="input-last-name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main St" data-testid="input-address" />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="New York" data-testid="input-city" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="NY" data-testid="input-state" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" placeholder="10001" data-testid="input-zip" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                  <div className="flex items-center justify-between p-4 border rounded-lg mb-3 hover-elevate">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="standard" id="standard" data-testid="radio-standard" />
                      <Label htmlFor="standard" className="cursor-pointer">
                        <div className="font-medium">Standard Shipping</div>
                        <div className="text-sm text-muted-foreground">5-7 business days</div>
                      </Label>
                    </div>
                    <span className="font-semibold">$5.99</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg mb-3 hover-elevate">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="express" id="express" data-testid="radio-express" />
                      <Label htmlFor="express" className="cursor-pointer">
                        <div className="font-medium">Express Shipping</div>
                        <div className="text-sm text-muted-foreground">2-3 business days</div>
                      </Label>
                    </div>
                    <span className="font-semibold">$14.99</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover-elevate">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="same-day" id="same-day" data-testid="radio-same-day" />
                      <Label htmlFor="same-day" className="cursor-pointer">
                        <div className="font-medium">Same Day Delivery</div>
                        <div className="text-sm text-muted-foreground">Order within 2 hours</div>
                      </Label>
                    </div>
                    <span className="font-semibold">$24.99</span>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center justify-between p-4 border rounded-lg mb-3 hover-elevate">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="stripe" id="stripe" data-testid="radio-stripe" />
                      <Label htmlFor="stripe" className="cursor-pointer flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        <div>
                          <div className="font-medium">Credit / Debit Card</div>
                          <div className="text-sm text-muted-foreground">Powered by Stripe</div>
                        </div>
                      </Label>
                    </div>
                    <Badge variant="secondary">Recommended</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg hover-elevate">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="paypal" id="paypal" data-testid="radio-paypal" />
                      <Label htmlFor="paypal" className="cursor-pointer flex items-center gap-2">
                        <Wallet className="w-5 h-5" />
                        <div>
                          <div className="font-medium">PayPal</div>
                          <div className="text-sm text-muted-foreground">Fast & secure</div>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
                  <p className="font-semibold">Backend Integration Needed:</p>
                  {paymentMethod === "stripe" && (
                    <>
                      <p className="text-muted-foreground">• Install: npm install stripe</p>
                      <p className="text-muted-foreground">• Set STRIPE_SECRET_KEY in environment</p>
                      <p className="text-muted-foreground">• Create endpoint: POST /api/create-stripe-session</p>
                      <p className="text-muted-foreground">• Redirect to Stripe checkout</p>
                    </>
                  )}
                  {paymentMethod === "paypal" && (
                    <>
                      <p className="text-muted-foreground">• Install: npm install @paypal/checkout-server-sdk</p>
                      <p className="text-muted-foreground">• Set PAYPAL_CLIENT_ID & PAYPAL_SECRET</p>
                      <p className="text-muted-foreground">• Create endpoint: POST /api/create-paypal-order</p>
                      <p className="text-muted-foreground">• Initialize PayPal button</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium" data-testid="text-subtotal">$199.99</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium" data-testid="text-shipping">
                      ${shippingMethod === 'standard' ? '5.99' : shippingMethod === 'express' ? '14.99' : '24.99'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium" data-testid="text-tax">$16.00</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-semibold text-lg" data-testid="text-total">
                      ${(199.99 + parseFloat(shippingMethod === 'standard' ? '5.99' : shippingMethod === 'express' ? '14.99' : '24.99') + 16).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full rounded-full"
                  onClick={handlePayment}
                  data-testid="button-place-order"
                >
                  Place Order
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By placing your order, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
