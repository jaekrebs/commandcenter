// src/components/settings/CharacterProfilesSection.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useCharacterProfiles, type CharacterProfile } from "@/hooks/useCharacterProfiles";
import { useQueryClient } from "@tanstack/react-query";

export function CharacterProfilesSection() {
  const [newProfileName, setNewProfileName] = useState("");
  const queryClient = useQueryClient();
  const { data: characterProfiles = [], isLoading } = useCharacterProfiles();

  const createNewProfile = async () => {
    try {
      // 1) Get the current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a character profile",
          variant: "destructive",
        });
        return;
      }
      const userId = session.user.id;

      // 2) Ensure a row exists in `profiles` for this user (satisfy FK)
      await supabase
        .from("profiles")
        .upsert({ id: userId })
        .single();

      // 3) Insert the new character profile
      const { data, error } = await supabase
        .from("character_profiles")
        .insert([{ name: newProfileName, user_id: userId }])
        .select()
        .single();
      if (error) throw error;

      // 4) Notify success, clear input, and refresh the list
      toast({ title: "Success", description: "New character profile created" });
      setNewProfileName("");
      queryClient.invalidateQueries({ queryKey: ["characterProfiles"] });
    } catch (err: any) {
      console.error("Error creating profile:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to create character profile",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="cyber-panel">
      <h2 className="text-xl font-bold mb-4">Character Profiles</h2>
      <div className="space-y-4">

        {/* Create new profile */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter character name"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
          />
          <Button
            onClick={createNewProfile}
            disabled={!newProfileName.trim()}
          >
            Create Profile
          </Button>
        </div>

        {/* List existing profiles */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-400">Your Characters</h3>
          {isLoading ? (
            <p>Loading profiles…</p>
          ) : characterProfiles.length === 0 ? (
            <p className="text-sm text-gray-500">No character profiles yet</p>
          ) : (
            <div className="space-y-2">
              {characterProfiles.map((profile: CharacterProfile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-2 bg-background/5 rounded-md"
                >
                  <div>
                    <p className="font-medium">{profile.name}</p>
                    <p className="text-sm text-gray-400">
                      {profile.class || "—"} — {profile.lifepath || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

