// src/components/settings/CharacterProfilesSection.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useCharacterProfiles } from "@/hooks/useCharacterProfiles";
import type { CharacterProfile } from "@/hooks/useCharacterProfiles";

export function CharacterProfilesSection() {
  const [newProfileName, setNewProfileName] = useState("");
  const { data: profiles = [], isLoading, refetch } = useCharacterProfiles();

  const selected = profiles.find(p => p.is_selected);

  const createNewProfile = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        toast({ title: "Error", description: "You must be logged in", variant: "destructive" });
        return;
      }
      const userId = session.user.id;

      // Clear prior selection
      await supabase
        .from("character_profiles")
        .update({ is_selected: false })
        .eq("user_id", userId);

      // Insert new and mark selected
      const { error } = await supabase
        .from("character_profiles")
        .insert([{ name: newProfileName, user_id: userId, is_selected: true }]);
      if (error) throw error;

      toast({ title: "Success", description: "Profile created & selected" });
      setNewProfileName("");
      await refetch();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="cyber-panel">
      <h2 className="text-xl font-bold mb-4">Character Profiles</h2>
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter name"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
          />
          <Button onClick={createNewProfile} disabled={!newProfileName.trim()}>
            Create & Select
          </Button>
        </div>

        {isLoading ? (
          <p>Loading profiles…</p>
        ) : selected ? (
          <div className="p-4 bg-background/5 rounded-md">
            <h3 className="font-medium">{selected.name}</h3>
            <p className="text-sm text-gray-400">
              {selected.class} — {selected.lifepath}
            </p>
          </div>
        ) : (
          <p>No character selected</p>
        )}
      </div>
    </div>
  );
}
