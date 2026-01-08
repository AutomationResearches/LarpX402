import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Shield, Bell, Zap, Volume2, Eye, Lock, AlertTriangle, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useSettings } from "@/hooks/useSettings";

const Settings = () => {
  const navigate = useNavigate();
  const { settings, updateSetting, saveSettings, resetSettings } = useSettings();

  const getSensitivityLabel = (value: number) => {
    if (value < 30) return "Low";
    if (value < 60) return "Medium";
    if (value < 85) return "High";
    return "Maximum";
  };

  const handleSaveSettings = () => {
    saveSettings();
    toast({
      title: "Settings Saved",
      description: "Your security preferences have been updated successfully.",
    });
  };

  const handleResetDefaults = () => {
    resetSettings();
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to defaults.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground font-mono">Settings</h1>
              <p className="text-muted-foreground text-sm">Customize your security preferences</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleResetDefaults}>
              Reset Defaults
            </Button>
            <Button onClick={handleSaveSettings} className="gap-2">
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </div>
        </div>

        {/* Scanner Sensitivity */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-primary" />
              Scanner Sensitivity
            </CardTitle>
            <CardDescription>
              Adjust how aggressively the scanner detects potential threats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Detection Sensitivity</Label>
                <span className="text-sm font-medium text-primary">
                  {getSensitivityLabel(settings.scannerSensitivity[0])} ({settings.scannerSensitivity[0]}%)
                </span>
              </div>
              <Slider
                value={settings.scannerSensitivity}
                onValueChange={(value) => updateSetting("scannerSensitivity", value)}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Higher sensitivity may result in more false positives but better threat detection.
              </p>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Deep Scan Analysis</Label>
                  <p className="text-xs text-muted-foreground">Perform thorough analysis of files and URLs</p>
                </div>
                <Switch checked={settings.deepScanEnabled} onCheckedChange={(v) => updateSetting("deepScanEnabled", v)} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Heuristic Analysis</Label>
                  <p className="text-xs text-muted-foreground">Detect unknown threats using behavior patterns</p>
                </div>
                <Switch checked={settings.heuristicAnalysis} onCheckedChange={(v) => updateSetting("heuristicAnalysis", v)} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cloud-Based Scanning</Label>
                  <p className="text-xs text-muted-foreground">Use cloud intelligence for enhanced detection</p>
                </div>
                <Switch checked={settings.cloudScanning} onCheckedChange={(v) => updateSetting("cloudScanning", v)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5 text-primary" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Control how and when you receive security alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Threat Alerts</Label>
                  <p className="text-xs text-muted-foreground">Notify when threats are detected</p>
                </div>
                <Switch checked={settings.threatAlerts} onCheckedChange={(v) => updateSetting("threatAlerts", v)} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Scan Complete Notifications</Label>
                  <p className="text-xs text-muted-foreground">Notify when scans finish</p>
                </div>
                <Switch checked={settings.scanComplete} onCheckedChange={(v) => updateSetting("scanComplete", v)} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Update Notifications</Label>
                  <p className="text-xs text-muted-foreground">Notify about virus definition updates</p>
                </div>
                <Switch checked={settings.updateNotifications} onCheckedChange={(v) => updateSetting("updateNotifications", v)} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Sound Effects
                  </Label>
                  <p className="text-xs text-muted-foreground">Play sounds for alerts</p>
                </div>
                <Switch checked={settings.soundEnabled} onCheckedChange={(v) => updateSetting("soundEnabled", v)} />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Alert Frequency</Label>
              <Select value={settings.alertFrequency} onValueChange={(v) => updateSetting("alertFrequency", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="batched">Batched (every 5 min)</SelectItem>
                  <SelectItem value="hourly">Hourly Summary</SelectItem>
                  <SelectItem value="daily">Daily Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Protection Levels */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-primary" />
              Protection Levels
            </CardTitle>
            <CardDescription>
              Configure your overall security protection settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Protection Mode</Label>
              <Select value={settings.protectionLevel} onValueChange={(v) => updateSetting("protectionLevel", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">
                    <div className="flex items-center gap-2">
                      <span>Minimal</span>
                      <span className="text-xs text-muted-foreground">- Basic protection only</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="balanced">
                    <div className="flex items-center gap-2">
                      <span>Balanced</span>
                      <span className="text-xs text-muted-foreground">- Recommended</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="strict">
                    <div className="flex items-center gap-2">
                      <span>Strict</span>
                      <span className="text-xs text-muted-foreground">- Maximum security</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="custom">
                    <div className="flex items-center gap-2">
                      <span>Custom</span>
                      <span className="text-xs text-muted-foreground">- Manual configuration</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex items-start gap-3">
                  <Lock className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <Label>Real-Time Protection</Label>
                    <p className="text-xs text-muted-foreground">Monitor system continuously for threats</p>
                  </div>
                </div>
                <Switch checked={settings.realTimeProtection} onCheckedChange={(v) => updateSetting("realTimeProtection", v)} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex items-start gap-3">
                  <Eye className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <Label>Web Protection</Label>
                    <p className="text-xs text-muted-foreground">Block malicious websites and downloads</p>
                  </div>
                </div>
                <Switch checked={settings.webProtection} onCheckedChange={(v) => updateSetting("webProtection", v)} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <Label>Download Scanning</Label>
                    <p className="text-xs text-muted-foreground">Automatically scan downloaded files</p>
                  </div>
                </div>
                <Switch checked={settings.downloadScanning} onCheckedChange={(v) => updateSetting("downloadScanning", v)} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex items-start gap-3">
                  <Shield className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <Label>Phishing Protection</Label>
                    <p className="text-xs text-muted-foreground">Detect and block phishing attempts</p>
                  </div>
                </div>
                <Switch checked={settings.phishingProtection} onCheckedChange={(v) => updateSetting("phishingProtection", v)} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex items-start gap-3">
                  <Eye className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <Label>Tracking Protection</Label>
                    <p className="text-xs text-muted-foreground">Block online trackers and fingerprinting</p>
                  </div>
                </div>
                <Switch checked={settings.trackingProtection} onCheckedChange={(v) => updateSetting("trackingProtection", v)} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
