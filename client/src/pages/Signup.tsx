import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Checkbox } from "@/components/ui/checkbox";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup attempted with:", formData);
    // TODO: Backend integration point - fetch('/api/signup', { method: 'POST', body: JSON.stringify(formData) })
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`${provider} signup triggered`);
    // TODO: Backend integration point - OAuth flow
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-display">Create account</CardTitle>
          <CardDescription>Get started with your free account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                data-testid="input-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                data-testid="input-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                data-testid="input-confirm-password"
              />
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                data-testid="checkbox-terms"
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                I agree to the Terms of Service and Privacy Policy
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full rounded-full" 
              size="lg" 
              disabled={!formData.agreeToTerms}
              data-testid="button-signup"
            >
              Create Account
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">Or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handleSocialSignup("Google")}
              data-testid="button-google-signup"
            >
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialSignup("Apple")}
              data-testid="button-apple-signup"
            >
              Apple
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login">
              <span className="text-primary hover:underline cursor-pointer" data-testid="link-login">
                Sign in
              </span>
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
