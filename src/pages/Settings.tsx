
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserSettingsPanel } from "../components/settings/UserSettingsPanel";
import { DataManagementPanel } from "../components/settings/DataManagementPanel";
import { AboutPanel } from "../components/settings/AboutPanel";
import { AuthSection } from "../components/auth/AuthSection";
import { DataSyncSection } from "../components/data/DataSyncSection";

type SettingsData = {
  username: string;
  autoSaveInterval: number;
  notificationsEnabled: boolean;
  darkThemeVariant: string;
};

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>(() => {
    const savedSettings = localStorage.getItem("v-settings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          username: "",
          autoSaveInterval: 5,
          notificationsEnabled: true,
          darkThemeVariant: "purple",
        };
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setSettings(prev => ({
            ...prev,
            username: session.user.email || ""
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    
    fetchProfile();
  }, []);

  const handleSettingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    setSettings({
      ...settings,
      [name]: type === "number" ? Number(value) : newValue,
    });
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">
        <span className="text-cyber-yellow glow-text">Settings</span>
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="space-y-6">
            <UserSettingsPanel 
              settings={settings}
              onSettingChange={handleSettingChange}
            />
            <DataManagementPanel settings={settings} />
          </div>
        </div>
        
        <div>
          <AuthSection />
          <div className="mt-6">
            <DataSyncSection />
          </div>
          <div className="mt-6">
            <AboutPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
