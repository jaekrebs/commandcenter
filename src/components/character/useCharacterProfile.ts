
// src/components/character/useCharacterProfile.ts
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useSelectedProfile } from "@/hooks/useSelectedProfile";
import type { CharacterProfile } from "@/hooks/useCharacterProfiles";

export function useCharacterProfile() {
  const queryClient = useQueryClient();
  const { profile: selected } = useSelectedProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<CharacterProfile | null>(selected ?? null);

  const handleProfileChange = (field: keyof CharacterProfile, value: string) => {
    if (!editedProfile) return;
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editedProfile) throw new Error("No profile to update.");
      const { error } = await supabase
        .from("character_profiles")
        .update({
          name: editedProfile.name,
          lifepath: editedProfile.lifepath,
          class: editedProfile.class,
          gear: editedProfile.gear,
        })
        .eq("id", editedProfile.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["characterProfiles"] });
      setIsEditing(false);
      toast({ title: "Profile updated", description: "Character data saved." });
    },
    onError: (err: any) =>
      toast({
        title: "Error",
        description: err.message || "Failed to update character profile.",
        variant: "destructive",
      }),
  });

  const handleSave = () => updateMutation.mutate();
  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(selected ?? null);
  };

  return {
    isEditing,
    setIsEditing,
    profile: selected!,
    editedProfile: editedProfile!,
    userProfile: selected, // maintained for legacy ref use
    handleProfileChange,
    handleSave,
    handleCancel,
  };
}