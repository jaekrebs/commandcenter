// src/components/settings/UserSettingsPanel.tsx
import { Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCharacterProfiles } from "@/hooks/useCharacterProfiles";
import { useSelectedProfile } from "@/hooks/useSelectedProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/* ----- props & local types --------------------------------------- */

type SettingsData = {
  username: string;
  autoSaveInterval: number;
  notificationsEnabled: boolean;
  darkThemeVariant: string;
};

interface UserSettingsPanelProps {
  settings: SettingsData;
  onSettingChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

/* ----- component -------------------------------------------------- */

export function UserSettingsPanel({
  settings,
  onSettingChange,
}: UserSettingsPanelProps) {
  const { data: profiles = [], isLoading } = useCharacterProfiles();
  const { profile: selected } = useSelectedProfile();
  const queryClient = useQueryClient();

  const selectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("character_profiles")
        .update({ is_selected: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["characterProfiles"] });
      toast({ title: "Profile Updated", description: "Character changed." });
    },
    onError: () =>
      toast({
        title: "Error",
        description: "Failed to update character profile.",
        variant: "destructive",
      }),
  });

  const handleCharacterProfileChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => selectMutation.mutate(e.target.value);

  const handleSaveSettings = () => {
    localStorage.setItem("v-settings", JSON.stringify(settings));
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  /* ----- UI ------------------------------------------------------- */

  return (
    <div className="cyber-panel">
      <h2 className="text-xl font-bold mb-4">User Settings</h2>

      <div className="space-y-4">
        {/* character picker */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Character Profile
          </label>
          <select
            className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
            value={selected?.id ?? ""}
            onChange={handleCharacterProfileChange}
            disabled={isLoading}
          >
            <option value="">Select a character profile</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} – {p.class} ({p.lifepath})
              </option>
            ))}
          </select>
        </div>

        {/* auto-save, notifications, theme … (unchanged) */}
        {/* ------------------------------------------------------------ */}
        {/* keep your existing inputs here                               */}
        {/* ------------------------------------------------------------ */}

        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="cyber-button flex items-center gap-2"
          >
            <Check size={16} />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
