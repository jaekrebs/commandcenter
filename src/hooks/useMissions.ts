
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Mission } from "@/components/MissionCard";

export function useMissions() {
  const queryClient = useQueryClient();

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

  const { data: missions = [], isLoading } = useQuery({
    queryKey: ["missions", userProfile?.selected_character_profile_id],
    enabled: !!userProfile?.selected_character_profile_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("missions")
        .select("*")
        .eq("character_profile_id", userProfile?.selected_character_profile_id);
      
      if (error) throw error;
      
      // Cast the type field to ensure it matches the expected union type
      return data.map(mission => ({
        ...mission,
        type: mission.type as "main" | "side" | "gig"
      })) as Mission[];
    }
  });

  const addMission = useMutation({
    mutationFn: async (newMission: Omit<Mission, "id">) => {
      if (!userProfile?.selected_character_profile_id) {
        throw new Error("No character profile selected");
      }

      const { data, error } = await supabase
        .from("missions")
        .insert({
          ...newMission,
          character_profile_id: userProfile.selected_character_profile_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions", userProfile?.selected_character_profile_id] });
      toast({
        title: "Success",
        description: "Mission added successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add mission",
        variant: "destructive"
      });
    }
  });

  const updateMission = useMutation({
    mutationFn: async (mission: Mission) => {
      const { error } = await supabase
        .from("missions")
        .update({
          title: mission.title,
          content: mission.content,
          updated_at: new Date().toISOString()
        })
        .eq("id", mission.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions", userProfile?.selected_character_profile_id] });
      toast({
        title: "Success",
        description: "Mission updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update mission",
        variant: "destructive"
      });
    }
  });

  const deleteMission = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("missions")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions", userProfile?.selected_character_profile_id] });
      toast({
        title: "Success",
        description: "Mission deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update mission",
        variant: "destructive"
      });
    }
  });

  return {
    missions,
    isLoading,
    addNote: addMission.mutate,
    updateNote: updateMission.mutate,
    deleteNote: deleteMission.mutate,
    hasCharacter: !!userProfile?.selected_character_profile_id
  };
}
