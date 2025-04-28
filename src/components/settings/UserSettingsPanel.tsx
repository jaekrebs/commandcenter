import { Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCharacterProfiles } from "@/hooks/useCharacterProfiles";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type SettingsData = {
  username: string;
  autoSaveInterval: number;
  notificationsEnabled: boolean;
  darkThemeVariant: string;
  selectedCharacterProfileId?: string;
};

interface UserSettingsPanelProps {
  settings: SettingsData;
  onSettingChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function UserSettingsPanel({ settings, onSettingChange }: UserSettingsPanelProps) {
  const { data: characterProfiles, isLoading } = useCharacterProfiles();

  const { data: currentProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("selected_character_profile_id")
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (characterProfileId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("No user session");

      const { error } = await supabase
        .from("profiles")
        .update({ selected_character_profile_id: characterProfileId })
        .eq("id", session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your character profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update character profile.",
        variant: "destructive",
      });
      console.error("Error updating profile:", error);
    }
  });

  const handleCharacterProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateProfileMutation.mutate(e.target.value);
  };

  return (
    <div className="cyber-panel">
      <h2 className="text-xl font-bold mb-4">User Settings</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Character Profile</label>
          <select
            className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
            value={currentProfile?.selected_character_profile_id || ""}
            onChange={handleCharacterProfileChange}
            disabled={isLoading}
          >
            <option value="">Select a character profile</option>
            {characterProfiles?.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name} - {profile.class} ({profile.lifepath})
              </option>
            ))}
          </select>
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
