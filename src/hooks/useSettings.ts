import { useState, useEffect } from "react";

export interface SettingsState {
  // Scanner Sensitivity
  scannerSensitivity: number[];
  deepScanEnabled: boolean;
  heuristicAnalysis: boolean;
  cloudScanning: boolean;
  // Notification Preferences
  threatAlerts: boolean;
  scanComplete: boolean;
  updateNotifications: boolean;
  soundEnabled: boolean;
  alertFrequency: string;
  // Protection Levels
  protectionLevel: string;
  realTimeProtection: boolean;
  webProtection: boolean;
  downloadScanning: boolean;
  phishingProtection: boolean;
  trackingProtection: boolean;
}

const defaultSettings: SettingsState = {
  scannerSensitivity: [75],
  deepScanEnabled: true,
  heuristicAnalysis: true,
  cloudScanning: true,
  threatAlerts: true,
  scanComplete: true,
  updateNotifications: true,
  soundEnabled: false,
  alertFrequency: "immediate",
  protectionLevel: "balanced",
  realTimeProtection: true,
  webProtection: true,
  downloadScanning: true,
  phishingProtection: true,
  trackingProtection: true,
};

const STORAGE_KEY = "scanner-settings";

export const useSettings = () => {
  const [settings, setSettings] = useState<SettingsState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...defaultSettings, ...JSON.parse(stored) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const updateSetting = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    settings,
    updateSetting,
    saveSettings,
    resetSettings,
    defaultSettings,
  };
};
