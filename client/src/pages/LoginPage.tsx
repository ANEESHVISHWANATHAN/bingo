import { useState } from "react";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Login Successful!",
        description: "Welcome back!",
      });
      setLocation("/user-dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* ⭐ Responsive Parent Wrapper */}
      <main className="flex-1 flex flex-col items-center px-4 py-6 sm:px-6">
        
        {/* Back Button */}
        <div className="w-full max-w-md mb-4">
          <BackButton fallbackPath="/" />
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <LogIn className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10"
                    required
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="remember" className="rounded" />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>

                <Link href="/forgot-password">
                  <span className="text-sm text-primary hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </Link>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Signup */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <Link href="/signup">
                <span className="text-primary hover:underline font-medium cursor-pointer">
                  Sign up
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

