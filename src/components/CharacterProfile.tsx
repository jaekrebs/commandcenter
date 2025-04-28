import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

type ProfileData = {
  name: string;
  lifepath: string;
  class: string;
  primaryWeapons: string;
  gear: string;
};

export function CharacterProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    lifepath: "Corpo",
    class: "Netrunner",
    primaryWeapons: "",
    gear: "",
  });

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
        .eq("id", userProfile.selected_character_profile_id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  // Update local state when we get character profile data
  useEffect(() => {
    if (characterProfile) {
      setProfile({
        name: characterProfile.name,
        lifepath: characterProfile.lifepath,
        class: characterProfile.class,
        primaryWeapons: characterProfile.primary_weapons || "",
        gear: characterProfile.gear || "",
      });
    }
  }, [characterProfile]);

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
          name: profile.name,
          lifepath: profile.lifepath,
          class: profile.class,
          primary_weapons: profile.primaryWeapons,
          gear: profile.gear,
          updated_at: new Date().toISOString()
        })
        .eq("id", userProfile.selected_character_profile_id);

      if (error) throw error;

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
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  if (!userProfile?.selected_character_profile_id) {
    return (
      <div className="cyber-panel">
        <h2 className="text-xl font-bold text-white mb-4">
          <span className="text-cyber-purple glow-text mr-2">V</span> 
          Character Profile
        </h2>
        <p className="text-sm text-gray-300">
          No character profile selected. Please select a profile in the settings page.
        </p>
      </div>
    );
  }

  return (
    <div className="cyber-panel relative">
      <div className="absolute top-2 right-2">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-cyber-purple hover:text-cyber-blue transition-colors"
          >
            <Edit size={16} />
          </button>
        ) : null}
      </div>
      
      <h2 className="text-xl font-bold text-white mb-4">
        <span className="text-cyber-purple glow-text mr-2">{profile.name}</span> 
        Character Profile
      </h2>

      {isEditing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
              <input
                className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
                value={editedProfile.name}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Lifepath</label>
              <select
                className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
                value={editedProfile.lifepath}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, lifepath: e.target.value })
                }
              >
                <option>Corpo</option>
                <option>Street Kid</option>
                <option>Nomad</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Class</label>
            <select
              className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
              value={editedProfile.class}
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, class: e.target.value })
              }
            >
              <option>Netrunner</option>
              <option>Solo</option>
              <option>Techie</option>
              <option>Nomad</option>
              <option>Rockerboy</option>
              <option>Media</option>
              <option>Exec</option>
              <option>Medtech</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Primary Weapons</label>
            <input
              className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
              value={editedProfile.primaryWeapons}
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, primaryWeapons: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Gear</label>
            <input
              className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
              value={editedProfile.gear}
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, gear: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={handleCancel} className="cyber-button text-sm">
              Cancel
            </button>
            <button onClick={handleSave} className="cyber-button-accent text-sm">
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-gray-400">Name:</span>{" "}
              <span className="text-white">{profile.name}</span>
            </div>
            <div>
              <span className="text-gray-400">Lifepath:</span>{" "}
              <span className="text-white">{profile.lifepath}</span>
            </div>
            <div>
              <span className="text-gray-400">Class:</span>{" "}
              <span className="text-white">{profile.class}</span>
            </div>
          </div>
          <div>
            <span className="text-gray-400">Primary Weapons:</span>{" "}
            <span className="text-white">{profile.primaryWeapons}</span>
          </div>
          <div>
            <span className="text-gray-400">Gear:</span>{" "}
            <span className="text-white">{profile.gear}</span>
          </div>
        </div>
      )}
    </div>
  );
}
