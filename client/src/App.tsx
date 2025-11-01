import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";

import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import FeedbackPage from "@/pages/FeedbackPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import AdminPanel from "@/pages/AdminDashboard";
import UserDashboard from "@/pages/UserDashboard";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CheckoutPage from "@/pages/CheckoutPage";
import NotFound from "@/pages/not-found";
import AdminCarouselDashboard from "@/pages/CarouselDashboard";
import AdminUserDashboard from "@/pages/AdminUserDashboard";
import FooterAdmin from "@/pages/FooterAdmin";
import ComprehensiveAdmin from "@/pages/ComprehensiveAdmin";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import CheckoutAdmin from "@/pages/CheckoutAdmin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/feedback" component={FeedbackPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/admin" component={AdminLoginPage} />
      <Route path="/admin-dashboard" component={AdminPanel} />
      <Route path="/user-dashboard" component={UserDashboard} />
      <Route path="/product/:id" component={ProductDetailPage} />
      <Route path="/checkout" component={CheckoutPage} />
      <Route path="/carousel-dashboard" component={AdminCarouselDashboard} />
      <Route path="/admin-userboard" component={AdminUserDashboard} />
      <Route path="/footer-admin" component={FooterAdmin} />
      <Route path="/checkout-admin" component={CheckoutAdmin} />
      <Route path="/admin-panel" component={ComprehensiveAdmin} />
      <Route component={NotFound} /> {/* fallback for all unmatched paths */}
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
