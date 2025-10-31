import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// TODO: Replace with actual authentication API calls
export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({ username: "", email: "", password: "", confirmPassword: "" });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Admin login:", loginData);
    // TODO: Implement actual authentication with cookies
    toast({
      title: "Login successful!",
      description: "Welcome to the admin panel.",
    });
    setLocation("/admin-dashboard");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }
    console.log("Admin register:", registerData);
    // TODO: Implement actual registration with database
    toast({
      title: "Registration successful!",
      description: "You can now log in with your credentials.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>Manage your e-commerce platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
              <TabsTrigger value="register" data-testid="tab-register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Username
                  </label>
                  <Input
                    required
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    placeholder="admin"
                    data-testid="input-login-username"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Password
                  </label>
                  <Input
                    required
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="••••••••"
                    data-testid="input-login-password"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="button-login">
                  Login
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Username
                  </label>
                  <Input
                    required
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    placeholder="Choose a username"
                    data-testid="input-register-username"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Email
                  </label>
                  <Input
                    required
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="admin@example.com"
                    data-testid="input-register-email"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Password
                  </label>
                  <Input
                    required
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="••••••••"
                    data-testid="input-register-password"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Confirm Password
                  </label>
                  <Input
                    required
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    data-testid="input-register-confirm"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="button-register">
                  Register
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
