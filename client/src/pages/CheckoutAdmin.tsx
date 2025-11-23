import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, CreditCard, Truck } from "lucide-react";

interface CheckoutField {
  name: string;
  required: boolean;
  placeholder: string;
  type: string;
  maxLength?: number;
}

interface CheckoutStep {
  title: string;
  enabled: boolean;
  fields?: CheckoutField[];
  showOrderSummary?: boolean;
}

interface CheckoutConfig {
  steps: CheckoutStep[];
  paymentMethods: {
    creditCard: boolean;
    paypal: boolean;
    stripe: boolean;
    bankTransfer: boolean;
  };
  shipping: {
    freeShippingThreshold: number;
    defaultShippingCost: number;
    expressShipping: {
      enabled: boolean;
      cost: number;
    };
    internationalShipping: {
      enabled: boolean;
      cost: number;
    };
  };
  tax: {
    rate: number;
    label: string;
  };
  securityMessage: string;
  orderConfirmation: {
    message: string;
    showOrderNumber: boolean;
    showTrackingInfo: boolean;
  };
}

export default function CheckoutAdmin() {
  const [config, setConfig] = useState<CheckoutConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const res = await fetch("/api/load-checkout-config");
      if (!res.ok) throw new Error("Failed to load checkout config");
      const data = await res.json();
      setConfig(data);
    } catch (err) {
      console.error("Error loading checkout config:", err);
      toast({
        title: "Error",
        description: "Failed to load checkout configuration",
        variant: "destructive",
      });
    }
  };

  const saveConfig = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch("/api/save-checkout-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast({
        title: "Success",
        description: "Checkout configuration saved successfully!",
      });
    } catch (err) {
      console.error("Error saving checkout:", err);
      toast({
        title: "Error",
        description: "Failed to save checkout configuration",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addField = (stepIndex: number) => {
    if (!config) return;
    const newSteps = [...config.steps];
    if (!newSteps[stepIndex].fields) {
      newSteps[stepIndex].fields = [];
    }
    newSteps[stepIndex].fields!.push({
      name: "New Field",
      required: false,
      placeholder: "Enter value",
      type: "text",
    });
    setConfig({ ...config, steps: newSteps });
  };

  const deleteField = (stepIndex: number, fieldIndex: number) => {
    if (!config || !window.confirm("Delete this field?")) return;
    const newSteps = [...config.steps];
    newSteps[stepIndex].fields!.splice(fieldIndex, 1);
    setConfig({ ...config, steps: newSteps });
  };

  if (!config) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      <div className="mb-4 sm:mb-6">
        <BackButton fallbackPath="/admin-panel" />
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Checkout & Payment Configuration</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2">
            Customize checkout steps, payment methods, shipping options, and delivery settings
          </p>
        </div>

        <Button onClick={saveConfig} disabled={saving} className="w-full sm:w-auto">
          {saving ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
        </Button>
      </div>

      {/* Checkout Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Checkout Steps</CardTitle>
          <CardDescription>Configure the checkout process steps (Shipping, Payment, Review)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.steps.map((step, stepIndex) => (
            <div key={stepIndex} className="border rounded-lg p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                  <Input
                    value={step.title}
                    onChange={(e) => {
                      const newSteps = [...config.steps];
                      newSteps[stepIndex].title = e.target.value;
                      setConfig({ ...config, steps: newSteps });
                    }}
                    className="font-semibold w-full sm:max-w-xs"
                  />

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={step.enabled}
                      onCheckedChange={(checked) => {
                        const newSteps = [...config.steps];
                        newSteps[stepIndex].enabled = checked;
                        setConfig({ ...config, steps: newSteps });
                      }}
                    />
                    <Label>Enabled</Label>
                  </div>
                </div>

                {step.fields && (
                  <Button
                    onClick={() => addField(stepIndex)}
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Field
                  </Button>
                )}
              </div>

              {step.fields && step.fields.length > 0 && (
                <div className="space-y-2 ml-0 sm:ml-4">
                  {step.fields.map((field, fieldIndex) => (
                    <div
                      key={fieldIndex}
                      className="flex flex-col sm:flex-row gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <Input
                        value={field.name}
                        onChange={(e) => {
                          const newSteps = [...config.steps];
                          newSteps[stepIndex].fields![fieldIndex].name = e.target.value;
                          setConfig({ ...config, steps: newSteps });
                        }}
                        placeholder="Field Name"
                        className="flex-1"
                      />

                      <Input
                        value={field.placeholder}
                        onChange={(e) => {
                          const newSteps = [...config.steps];
                          newSteps[stepIndex].fields![fieldIndex].placeholder = e.target.value;
                          setConfig({ ...config, steps: newSteps });
                        }}
                        placeholder="Placeholder"
                        className="flex-1"
                      />

                      <Input
                        value={field.type}
                        onChange={(e) => {
                          const newSteps = [...config.steps];
                          newSteps[stepIndex].fields![fieldIndex].type = e.target.value;
                          setConfig({ ...config, steps: newSteps });
                        }}
                        placeholder="Type"
                        className="w-full sm:w-24"
                      />

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={field.required}
                          onCheckedChange={(checked) => {
                            const newSteps = [...config.steps];
                            newSteps[stepIndex].fields![fieldIndex].required = checked;
                            setConfig({ ...config, steps: newSteps });
                          }}
                        />
                        <Label className="text-xs">Required</Label>
                      </div>

                      <Button
                        onClick={() => deleteField(stepIndex, fieldIndex)}
                        size="sm"
                        variant="ghost"
                        className="self-start sm:self-center"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(config.paymentMethods).map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 border rounded-lg"
            >
              <Label className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</Label>

              <Switch
                checked={value}
                onCheckedChange={(checked) =>
                  setConfig({
                    ...config,
                    paymentMethods: { ...config.paymentMethods, [key]: checked },
                  })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Shipping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" /> Shipping Options
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Free Shipping Threshold ($)</Label>
            <Input
              type="number"
              value={config.shipping.freeShippingThreshold}
              onChange={(e) =>
                setConfig({
                  ...config,
                  shipping: {
                    ...config.shipping,
                    freeShippingThreshold: parseFloat(e.target.value),
                  },
                })
              }
              className="w-full"
            />
          </div>

          <div>
            <Label>Default Shipping Cost ($)</Label>
            <Input
              type="number"
              value={config.shipping.defaultShippingCost}
              onChange={(e) =>
                setConfig({
                  ...config,
                  shipping: {
                    ...config.shipping,
                    defaultShippingCost: parseFloat(e.target.value),
                  },
                })
              }
              className="w-full"
            />
          </div>

          {/* Express */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg gap-3">
            <div>
              <Label>Express Shipping</Label>
              <p className="text-sm text-muted-foreground">Fast delivery option</p>
            </div>

            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={config.shipping.expressShipping.cost}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    shipping: {
                      ...config.shipping,
                      expressShipping: {
                        ...config.shipping.expressShipping,
                        cost: parseFloat(e.target.value),
                      },
                    },
                  })
                }
                className="w-24"
              />

              <Switch
                checked={config.shipping.expressShipping.enabled}
                onCheckedChange={(checked) =>
                  setConfig({
                    ...config,
                    shipping: {
                      ...config.shipping,
                      expressShipping: {
                        ...config.shipping.expressShipping,
                        enabled: checked,
                      },
                    },
                  })
                }
              />
            </div>
          </div>

          {/* International */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border rounded-lg gap-3">
            <div>
              <Label>International Shipping</Label>
              <p className="text-sm text-muted-foreground">International delivery option</p>
            </div>

            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={config.shipping.internationalShipping.cost}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    shipping: {
                      ...config.shipping,
                      internationalShipping: {
                        ...config.shipping.internationalShipping,
                        cost: parseFloat(e.target.value),
                      },
                    },
                  })
                }
                className="w-24"
              />

              <Switch
                checked={config.shipping.internationalShipping.enabled}
                onCheckedChange={(checked) =>
                  setConfig({
                    ...config,
                    shipping: {
                      ...config.shipping,
                      internationalShipping: {
                        ...config.shipping.internationalShipping,
                        enabled: checked,
                      },
                    },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Settings</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Tax Rate (decimal, e.g., 0.08 for 8%)</Label>
            <Input
              type="number"
              step="0.01"
              value={config.tax.rate}
              onChange={(e) =>
                setConfig({
                  ...config,
                  tax: { ...config.tax, rate: parseFloat(e.target.value) },
                })
              }
              className="w-full"
            />
          </div>

          <div>
            <Label>Tax Label</Label>
            <Input
              value={config.tax.label}
              onChange={(e) =>
                setConfig({
                  ...config,
                  tax: { ...config.tax, label: e.target.value },
                })
              }
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Security & Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Order Messages</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label>Security Message</Label>
            <Input
              value={config.securityMessage}
              onChange={(e) =>
                setConfig({ ...config, securityMessage: e.target.value })
              }
              className="w-full"
            />
          </div>

          <div>
            <Label>Order Confirmation Message</Label>
            <Input
              value={config.orderConfirmation.message}
              onChange={(e) =>
                setConfig({
                  ...config,
                  orderConfirmation: {
                    ...config.orderConfirmation,
                    message: e.target.value,
                  },
                })
              }
              className="w-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <Label>Show Order Number</Label>
            <Switch
              checked={config.orderConfirmation.showOrderNumber}
              onCheckedChange={(checked) =>
                setConfig({
                  ...config,
                  orderConfirmation: {
                    ...config.orderConfirmation,
                    showOrderNumber: checked,
                  },
                })
              }
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <Label>Show Tracking Info</Label>
            <Switch
              checked={config.orderConfirmation.showTrackingInfo}
              onCheckedChange={(checked) =>
                setConfig({
                  ...config,
                  orderConfirmation: {
                    ...config.orderConfirmation,
                    showTrackingInfo: checked,
                  },
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
