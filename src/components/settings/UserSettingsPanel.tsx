
import { Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type SettingsData = {
  username: string;
  autoSaveInterval: number;
  notificationsEnabled: boolean;
  darkThemeVariant: string;
};

interface UserSettingsPanelProps {
  settings: SettingsData;
  onSettingChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function UserSettingsPanel({ settings, onSettingChange }: UserSettingsPanelProps) {
  const handleSaveSettings = () => {
    localStorage.setItem("v-settings", JSON.stringify(settings));
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="cyber-panel">
      <h2 className="text-xl font-bold mb-4">User Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={settings.username}
            disabled
            className="bg-cyber-black/50 border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none cursor-not-allowed opacity-70"
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
            onChange={onSettingChange}
            className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="notifications"
            name="notificationsEnabled"
            checked={settings.notificationsEnabled}
            onChange={onSettingChange}
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
            onChange={onSettingChange}
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
  );
}
