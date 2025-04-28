
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Mission } from "@/components/MissionCard";

export function useMissions() {
  const queryClient = useQueryClient();

  const { data: missions = [], isLoading } = useQuery({
    queryKey: ["missions"],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("selected_character_profile_id")
        .single();

      if (!profile?.selected_character_profile_id) {
        return [];
      }

      const { data, error } = await supabase
        .from("missions")
        .select("*")
        .eq("character_profile_id", profile.selected_character_profile_id);

      if (error) throw error;
      return data;
    }
  });

  const addMission = useMutation({
    mutationFn: async (newMission: Omit<Mission, "id">) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("selected_character_profile_id")
        .single();

      if (!profile?.selected_character_profile_id) {
        throw new Error("No character profile selected");
      }

      const { data, error } = await supabase
        .from("missions")
        .insert({
          ...newMission,
          character_profile_id: profile.selected_character_profile_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
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
        .update(mission)
        .eq("id", mission.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
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
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      toast({
        title: "Success",
        description: "Mission deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete mission",
        variant: "destructive"
      });
    }
  });

  return {
    missions,
    isLoading,
    addMission: addMission.mutate,
    updateMission: updateMission.mutate,
    deleteMission: deleteMission.mutate
  };
}
