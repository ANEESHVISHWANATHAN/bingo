import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface Link {
  label: string;
  path: string;
}

interface Section {
  title: string;
  links: Link[];
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

export default function FooterAdmin() {
  const [config, setConfig] = useState<FooterConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

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
      toast({
        title: "Error",
        description: "Failed to load footer configuration",
        variant: "destructive",
      });
    }
  };

  const saveConfig = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch("/api/save-footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast({
        title: "Success",
        description: "Footer configuration saved successfully!",
      });
    } catch (err) {
      console.error("Error saving footer:", err);
      toast({
        title: "Error",
        description: "Failed to save footer configuration",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    if (!config) return;
    setConfig({
      ...config,
      sections: [...config.sections, { title: "New Section", links: [] }],
    });
  };

  const deleteSection = (index: number) => {
    if (!config || !window.confirm("Delete this section?")) return;
    const newSections = [...config.sections];
    newSections.splice(index, 1);
    setConfig({ ...config, sections: newSections });
  };

  const addLink = (sectionIndex: number) => {
    if (!config) return;
    const newSections = [...config.sections];
    newSections[sectionIndex].links.push({ label: "New Link", path: "/" });
    setConfig({ ...config, sections: newSections });
  };

  const deleteLink = (sectionIndex: number, linkIndex: number) => {
    if (!config || !window.confirm("Delete this link?")) return;
    const newSections = [...config.sections];
    newSections[sectionIndex].links.splice(linkIndex, 1);
    setConfig({ ...config, sections: newSections });
  };

  if (!config) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      <div className="mb-6">
        <BackButton fallbackPath="/admin-panel" />
      </div>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <h1 className="text-3xl font-bold">Footer Configuration</h1>
        <Button onClick={saveConfig} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Site Name</Label>
            <Input
              value={config.siteName}
              onChange={(e) =>
                setConfig({ ...config, siteName: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Tagline</Label>
            <Input
              value={config.tagline}
              onChange={(e) =>
                setConfig({ ...config, tagline: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Copyright Text</Label>
            <Input
              value={config.copyright}
              onChange={(e) =>
                setConfig({ ...config, copyright: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle>Footer Sections</CardTitle>
          <Button onClick={addSection} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {config.sections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="border rounded-lg p-4 space-y-3 w-full overflow-x-auto"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <Input
                  value={section.title}
                  onChange={(e) => {
                    const newSections = [...config.sections];
                    newSections[sectionIndex].title = e.target.value;
                    setConfig({ ...config, sections: newSections });
                  }}
                  className="font-semibold w-full sm:max-w-xs"
                />

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => addLink(sectionIndex)}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Link
                  </Button>
                  <Button
                    onClick={() => deleteSection(sectionIndex)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 ml-0 sm:ml-4">
                {section.links.map((link, linkIndex) => (
                  <div
                    key={linkIndex}
                    className="flex flex-col sm:flex-row gap-2 items-start sm:items-center"
                  >
                    <Input
                      value={link.label}
                      onChange={(e) => {
                        const newSections = [...config.sections];
                        newSections[sectionIndex].links[linkIndex].label =
                          e.target.value;
                        setConfig({ ...config, sections: newSections });
                      }}
                      placeholder="Link Label"
                      className="w-full sm:flex-1"
                    />
                    <Input
                      value={link.path}
                      onChange={(e) => {
                        const newSections = [...config.sections];
                        newSections[sectionIndex].links[linkIndex].path =
                          e.target.value;
                        setConfig({ ...config, sections: newSections });
                      }}
                      placeholder="/path"
                      className="w-full sm:flex-1"
                    />
                    <Button
                      onClick={() => deleteLink(sectionIndex, linkIndex)}
                      size="sm"
                      variant="ghost"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {config.socialLinks.map((social, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <Input
                value={social.platform}
                onChange={(e) => {
                  const newSocialLinks = [...config.socialLinks];
                  newSocialLinks[index].platform = e.target.value;
                  setConfig({ ...config, socialLinks: newSocialLinks });
                }}
                className="w-full sm:w-32"
              />
              <Input
                value={social.url}
                onChange={(e) => {
                  const newSocialLinks = [...config.socialLinks];
                  newSocialLinks[index].url = e.target.value;
                  setConfig({ ...config, socialLinks: newSocialLinks });
                }}
                className="w-full sm:flex-1"
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <Switch
                  checked={social.enabled}
                  onCheckedChange={(checked) => {
                    const newSocialLinks = [...config.socialLinks];
                    newSocialLinks[index].enabled = checked;
                    setConfig({ ...config, socialLinks: newSocialLinks });
                  }}
                />
                <Label>Enabled</Label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Newsletter */}
      <Card>
        <CardHeader>
          <CardTitle>Newsletter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Switch
              checked={config.newsletter.enabled}
              onCheckedChange={(checked) =>
                setConfig({
                  ...config,
                  newsletter: { ...config.newsletter, enabled: checked },
                })
              }
            />
            <Label>Enable Newsletter</Label>
          </div>

          {config.newsletter.enabled && (
            <>
              <div>
                <Label>Title</Label>
                <Input
                  value={config.newsletter.title}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      newsletter: {
                        ...config.newsletter,
                        title: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>Placeholder</Label>
                <Input
                  value={config.newsletter.placeholder}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      newsletter: {
                        ...config.newsletter,
                        placeholder: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div>
                <Label>Button Text</Label>
                <Input
                  value={config.newsletter.buttonText}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      newsletter: {
                        ...config.newsletter,
                        buttonText: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
