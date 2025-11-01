import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LinkType {
  label: string;
  path: string;
}

interface Section {
  title: string;
  links: LinkType[];
}

interface SocialLink {
  platform: string;
  url: string;
  enabled: boolean;
}

interface FooterConfig {
  siteName: string;
  tagline: string;
  sections: Section[];
  socialLinks: SocialLink[];
  copyright: string;
  newsletter: {
    enabled: boolean;
    title: string;
    placeholder: string;
    buttonText: string;
  };
}

const iconMap: { [key: string]: any } = {
  Facebook: Facebook,
  Twitter: Twitter,
  Instagram: Instagram,
  YouTube: Youtube,
};

export default function Footer() {
  const [config, setConfig] = useState<FooterConfig | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const res = await fetch("/api/load-footer");
      if (!res.ok) throw new Error("Failed to load footer config");
      const data = await res.json();
      setConfig(data);
    } catch (err) {
      console.error("Error loading footer config:", err);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  if (!config) {
    return (
      <footer className="bg-card border-t mt-12">
        <div className="container mx-auto px-4 py-8 text-center">
          Loading...
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-card border-t mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">{config.siteName}</h3>
            <p className="text-sm text-muted-foreground mb-4">{config.tagline}</p>
            {config.newsletter.enabled && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">{config.newsletter.title}</p>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder={config.newsletter.placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-sm"
                  />
                  <Button type="submit" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* Sections */}
          {config.sections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4 text-foreground">{section.title}</h4>
              <ul className="space-y-2 text-sm">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.path}>
                      <a className="text-muted-foreground hover:text-foreground transition-colors">
                        {link.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-2">
              {config.socialLinks
                .filter((social) => social.enabled)
                .map((social, index) => {
                  const Icon = iconMap[social.platform] || Facebook;
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    </Button>
                  );
                })}
            </div>
            <p className="text-sm text-muted-foreground">{config.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
