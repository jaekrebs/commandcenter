
import { useState, useEffect } from "react";
import { toast } from "../components/ui/use-toast";
import { Check } from "lucide-react";

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
          username: "V",
          autoSaveInterval: 5,
          notificationsEnabled: true,
          darkThemeVariant: "purple",
        };
  });

  useEffect(() => {
    localStorage.setItem("v-settings", JSON.stringify(settings));
  }, [settings]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    
    setSettings({
      ...settings,
      [name]: type === "number" ? Number(value) : newValue,
    });
  };

  const handleSaveSettings = () => {
    localStorage.setItem("v-settings", JSON.stringify(settings));
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  const handleExportData = () => {
    const exportData = {
      profile: JSON.parse(localStorage.getItem("v-character-profile") || "{}"),
      relicStatus: JSON.parse(localStorage.getItem("v-relic-status") || "{}"),
      npcs: JSON.parse(localStorage.getItem("v-npcs") || "[]"),
      missions: JSON.parse(localStorage.getItem("v-missions") || "[]"),
      cyberware: JSON.parse(localStorage.getItem("v-cyberware") || "[]"),
      notes: JSON.parse(localStorage.getItem("v-notes") || "[]"),
      settings: settings,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `v-dashboard-backup-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Data exported",
      description: "Your data has been exported successfully.",
    });
  };

  const handleClearLocalData = () => {
    if (confirm("Are you sure you want to clear all local data? This cannot be undone!")) {
      localStorage.removeItem("v-character-profile");
      localStorage.removeItem("v-relic-status");
      localStorage.removeItem("v-npcs");
      localStorage.removeItem("v-missions");
      localStorage.removeItem("v-cyberware");
      localStorage.removeItem("v-notes");
      
      toast({
        title: "Data cleared",
        description: "All local data has been removed. Refresh to start fresh.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">
        <span className="text-cyber-yellow glow-text">Settings</span>
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="space-y-6">
            <div className="cyber-panel">
              <h2 className="text-xl font-bold mb-4">User Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={settings.username}
                    onChange={handleChange}
                    className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Auto-save interval (minutes)</label>
                  <input
                    type="number"
                    name="autoSaveInterval"
                    min="1"
                    max="60"
                    value={settings.autoSaveInterval}
                    onChange={handleChange}
                    className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="notifications"
                    name="notificationsEnabled"
                    checked={settings.notificationsEnabled}
                    onChange={handleChange}
                    className="rounded bg-cyber-black border-cyber-purple/30 focus:ring-cyber-purple text-cyber-purple"
                  />
                  <label htmlFor="notifications" className="text-sm text-gray-300">
                    Enable notifications
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Theme Variant</label>
                  <select
                    name="darkThemeVariant"
                    value={settings.darkThemeVariant}
                    onChange={handleChange}
                    className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
                  >
                    <option value="purple">Cyber Purple</option>
                    <option value="blue">Cyber Blue</option>
                    <option value="pink">Cyber Pink</option>
                    <option value="yellow">Cyber Yellow</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <button onClick={handleSaveSettings} className="cyber-button flex items-center gap-2">
                    <Check size={16} />
                    <span>Save Settings</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="cyber-panel">
              <h2 className="text-xl font-bold mb-4">Data Management</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Export Data</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Export all your character data, including profile, NPCs, missions, cyberware, and notes to a JSON file.
                  </p>
                  <button onClick={handleExportData} className="cyber-button text-sm">
                    Export to JSON
                  </button>
                </div>
                
                <div className="pt-3 border-t border-cyber-purple/20">
                  <h3 className="text-lg font-medium mb-2">Clear Local Data</h3>
                  <p className="text-sm text-cyber-red mb-3">
                    Warning: This will permanently delete all locally stored data. Make sure to export your data first!
                  </p>
                  <button onClick={handleClearLocalData} className="text-sm border border-cyber-red text-cyber-red px-4 py-2 rounded hover:bg-cyber-red/10">
                    Clear All Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="cyber-panel">
            <h2 className="text-xl font-bold mb-4">Supabase Integration</h2>
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-cyber-darkgray rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h10" />
                  <path d="M7 12h10" />
                  <path d="M7 17h10" />
                </svg>
              </div>
              <p className="text-gray-300 mb-4">
                Connect to Supabase to sync and back up your data to the cloud.
              </p>
              <button disabled className="cyber-button w-full opacity-50 cursor-not-allowed">
                Connect to Supabase
              </button>
              <p className="text-xs text-gray-400 mt-2">
                Coming soon in a future update
              </p>
            </div>
          </div>
          
          <div className="cyber-panel mt-6">
            <h2 className="text-xl font-bold mb-4">About</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                <span className="text-cyber-purple">V Dashboard</span> - Version 1.0.0
              </p>
              <p className="text-sm text-gray-300">
                A Cyberpunk 2077 character companion app.
              </p>
              <p className="text-sm text-gray-300 mt-4">
                Created by an aspiring netrunner. Stay chrome!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
