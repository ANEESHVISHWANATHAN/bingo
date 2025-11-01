import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  fallbackPath?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
}

export default function BackButton({ 
  fallbackPath = "/", 
  className = "",
  variant = "ghost"
}: BackButtonProps) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation(fallbackPath);
    }
  };

  return (
    <Button
      onClick={handleBack}
      variant={variant}
      size="sm"
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
}

