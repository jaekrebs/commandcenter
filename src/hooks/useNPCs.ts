
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { NPCRelationship } from "@/components/NPCCard";

export function useNPCs() {
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

  const { data: npcs = [], isLoading } = useQuery({
    queryKey: ["npc-relationships", userProfile?.selected_character_profile_id],
    enabled: !!userProfile?.selected_character_profile_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("npc_relationships")
        .select("*")
        .eq("character_profile_id", userProfile?.selected_character_profile_id);
      
      if (error) throw error;
      return data as NPCRelationship[];
    }
  });

  const updateNPC = useMutation({
    mutationFn: async (npc: NPCRelationship) => {
      const { error } = await supabase
        .from("npc_relationships")
        .update({
          npc_name: npc.npc_name,
          friendship: npc.friendship,
          trust: npc.trust,
          lust: npc.lust,
          love: npc.love,
          image: npc.image,
          background: npc.background,
          updated_at: new Date().toISOString()
        })
        .eq("id", npc.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["npc-relationships", userProfile?.selected_character_profile_id] });
      toast({
        title: "Success",
        description: "NPC relationship updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update NPC relationship",
        variant: "destructive"
      });
    }
  });

  return {
    npcs,
    isLoading,
    updateNPC: updateNPC.mutate,
    hasCharacter: !!userProfile?.selected_character_profile_id
  };
}
