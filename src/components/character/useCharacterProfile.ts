
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ProfileData } from "../types/character";

export function useCharacterProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    lifepath: "Corpo",
    class: "Netrunner",
    primaryWeapons: "",
    gear: "",
  });
  const [editedProfile, setEditedProfile] = useState<ProfileData>(profile);

  // Fetch selected character profile ID from user profile
  const { data: userProfile } = useQuery({
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

  // Fetch character profile data if we have a selected profile
  const { data: characterProfile } = useQuery({
    queryKey: ["character-profile", userProfile?.selected_character_profile_id],
    enabled: !!userProfile?.selected_character_profile_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("character_profiles")
        .select("*")
        .eq("id", userProfile?.selected_character_profile_id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (characterProfile) {
      const newProfile = {
        name: characterProfile.name,
        lifepath: characterProfile.lifepath,
        class: characterProfile.class,
        primaryWeapons: characterProfile.primary_weapons || "",
        gear: characterProfile.gear || "",
      };
      setProfile(newProfile);
      setEditedProfile(newProfile);
    }
  }, [characterProfile]);

  const handleProfileChange = (field: keyof ProfileData, value: string) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!userProfile?.selected_character_profile_id) {
      toast({
        title: "No profile selected",
        description: "Please select a character profile in settings first.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("character_profiles")
        .update({
          name: editedProfile.name,
          lifepath: editedProfile.lifepath,
          class: editedProfile.class,
          primary_weapons: editedProfile.primaryWeapons,
          gear: editedProfile.gear,
          updated_at: new Date().toISOString()
        })
        .eq("id", userProfile.selected_character_profile_id);

      if (error) throw error;

      setProfile(editedProfile);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your character profile has been saved."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return {
    isEditing,
    setIsEditing,
    profile,
    editedProfile,
    userProfile,
    handleProfileChange,
    handleSave,
    handleCancel
  };
}
