// ---- FULL RESPONSIVE VERSION ----

import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock, Truck, Shield, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CheckoutPage() {
  const { toast } = useToast();
  const [step, setStep] = useState<"details" | "payment" | "review">("details");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });

  const cartItems: CartItem[] = [
    { id: 1, name: "Wireless Bluetooth Headphones", price: 79.99, quantity: 1 },
    { id: 2, name: "Premium Leather Wallet", price: 49.99, quantity: 2 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    if (step === "details") {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.address) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
      setStep("payment");
    } else if (step === "payment") {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) {
        toast({
          title: "Missing Payment Info",
          description: "Please fill in all payment fields",
          variant: "destructive",
        });
        return;
      }
      setStep("review");
    } else {
      toast({
        title: "Order Placed!",
        description: "Your order has been placed successfully.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">

          <div className="mb-6">
            <BackButton fallbackPath="/" />
          </div>

          {/* Progress Steps - MADE RESPONSIVE */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-wrap items-center justify-center gap-4 text-center w-full">
              {/* Step 1 */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg w-full sm:w-auto justify-center ${
                  step === "details" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-current flex items-center justify-center text-sm font-bold">1</div>
                <span className="font-medium">Shipping Details</span>
              </div>

              <div className="hidden sm:block w-12 h-1 bg-muted" />

              {/* Step 2 */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg w-full sm:w-auto justify-center ${
                  step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-current flex items-center justify-center text-sm font-bold">2</div>
                <span className="font-medium">Payment</span>
              </div>

              <div className="hidden sm:block w-12 h-1 bg-muted" />

              {/* Step 3 */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg w-full sm:w-auto justify-center ${
                  step === "review" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-current flex items-center justify-center text-sm font-bold">3</div>
                <span className="font-medium">Review</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT MAIN AREA */}
            <div className="lg:col-span-2 space-y-6 w-full">

              {/* Shipping */}
              {step === "details" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">

                    <div className="grid sm:grid-cols-2 gap-4 w-full">
                      <div className="w-full">
                        <Label>First Name *</Label>
                        <Input value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} />
                      </div>

                      <div className="w-full">
                        <Label>Last Name *</Label>
                        <Input value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} />
                      </div>
                    </div>

                    <div className="w-full">
                      <Label>Email *</Label>
                      <Input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                    </div>

                    <div className="w-full">
                      <Label>Phone Number</Label>
                      <Input type="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} />
                    </div>

                    <div className="w-full">
                      <Label>Address *</Label>
                      <Input value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4 w-full">
                      <div className="w-full">
                        <Label>City *</Label>
                        <Input value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
                      </div>

                      <div className="w-full">
                        <Label>State *</Label>
                        <Input value={formData.state} onChange={(e) => handleInputChange("state", e.target.value)} />
                      </div>

                      <div className="w-full">
                        <Label>ZIP *</Label>
                        <Input value={formData.zip} onChange={(e) => handleInputChange("zip", e.target.value)} />
                      </div>
                    </div>

                    <div className="w-full">
                      <Label>Country *</Label>
                      <Input value={formData.country} onChange={(e) => handleInputChange("country", e.target.value)} />
                    </div>

                  </CardContent>
                </Card>
              )}

              {/* Payment */}
              {step === "payment" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">

                    <div className="w-full">
                      <Label>Card Number *</Label>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                        maxLength={19}
                      />
                    </div>

                    <div className="w-full">
                      <Label>Cardholder Name *</Label>
                      <Input value={formData.cardName} onChange={(e) => handleInputChange("cardName", e.target.value)} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 w-full">
                      <div className="w-full">
                        <Label>Expiry *</Label>
                        <Input placeholder="MM/YY" value={formData.expiryDate} onChange={(e) => handleInputChange("expiryDate", e.target.value)} maxLength={5} />
                      </div>

                      <div className="w-full">
                        <Label>CVV *</Label>
                        <Input placeholder="123" value={formData.cvv} onChange={(e) => handleInputChange("cvv", e.target.value)} maxLength={4} />
                      </div>
                    </div>

                  </CardContent>
                </Card>
              )}

              {/* Review */}
              {step === "review" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Review</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 w-full break-words">

                    <div>
                      <h3 className="font-semibold mb-2">Shipping Address</h3>
                      <p className="text-sm text-muted-foreground break-words">
                        {formData.firstName} {formData.lastName} <br />
                        {formData.address}<br />
                        {formData.city}, {formData.state} {formData.zip}<br />
                        {formData.country}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-2">Payment</h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.cardName}<br />
                        •••• •••• •••• {formData.cardNumber.slice(-4)}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-4">Items</h3>
                      <div className="space-y-2 break-words">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm w-full">
                            <span className="max-w-[65%]">{item.name} x {item.quantity}</span>
                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </CardContent>
                </Card>
              )}

              {/* Buttons */}
              <div className="flex gap-4">
                {step !== "details" && (
                  <Button variant="outline" onClick={() => setStep(step === "payment" ? "details" : "payment")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
                <Button onClick={handleSubmit} className="flex-1">
                  {step === "review" ? (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Place Order
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>

            </div>

            {/* RIGHT SIDEBAR */}
            <div className="lg:col-span-1 w-full">
              <Card className="lg:sticky lg:top-24 w-full">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                  <div className="space-y-2 break-words">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground max-w-[65%]">{item.name} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                    <Shield className="h-3 w-3" />
                    <span>Secure 256-bit SSL encryption</span>
                  </div>

                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
