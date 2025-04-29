
// src/components/character/useCharacterProfile.ts
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useCharacterProfiles } from "@/hooks/useCharacterProfiles";
import type { CharacterProfile } from "@/hooks/useCharacterProfiles";

export interface ProfileData {
  name: string;
  lifepath: string;
  class: string;
  primaryWeapons: string;
  gear: string;
}

const EMPTY_PROFILE: ProfileData = {
  name: "",
  lifepath: "Corpo",
  class: "Netrunner",
  primaryWeapons: "",
  gear: "",
};

export function useCharacterProfile() {
  const { data: profiles = [], isLoading } = useCharacterProfiles();
  const selected = profiles.find(p => p.is_selected) ?? null;

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<ProfileData>(EMPTY_PROFILE);

  useEffect(() => {
    if (selected) {
      setEditedProfile({
        name: selected.name,
        lifepath: selected.lifepath,
        class: selected.class,
        primaryWeapons: selected.primary_weapons ?? "",
        gear: selected.gear ?? "",
      });
    }
  }, [selected]);

  const queryClient = useQueryClient();
  const mutation = useMutation<void, Error, ProfileData>({
    mutationFn: async updates => {
      if (!selected) throw new Error("No profile selected");
      const { error } = await supabase
        .from("character_profiles")
        .update({
          name: updates.name,
          lifepath: updates.lifepath,
          class: updates.class,
          primary_weapons: updates.primaryWeapons,
          gear: updates.gear,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selected.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Saved", description: "Character updated." });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["characterProfiles"] });
    },
    onError: err => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleProfileChange = (field: keyof ProfileData, val: string) =>
    setEditedProfile(prev => ({ ...prev, [field]: val }));

  const save = () => mutation.mutate(editedProfile);
  const cancel = () => {
    if (selected) {
      setEditedProfile({
        name: selected.name,
        lifepath: selected.lifepath,
        class: selected.class,
        primaryWeapons: selected.primary_weapons ?? "",
        gear: selected.gear ?? "",
      });
    }
    setIsEditing(false);
  };

  return { selected, isLoading, isEditing, setIsEditing, editedProfile, handleProfileChange, save, cancel };
}
