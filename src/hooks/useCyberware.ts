
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export type CyberwareItem = {
  id: string;
  name: string;
  type: string;
  description: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  installed: boolean;
  character_profile_id?: string;
};

export function useCyberware() {
  const queryClient = useQueryClient();

  const { data: cyberware = [], isLoading } = useQuery({
    queryKey: ["cyberware"],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("selected_character_profile_id")
        .single();

      if (!profile?.selected_character_profile_id) {
        return [];
      }

      const { data, error } = await supabase
        .from("gear")
        .select("*")
        .eq("character_profile_id", profile.selected_character_profile_id);

      if (error) throw error;
      return data as CyberwareItem[];
    }
  });

  const addCyberwareMutation = useMutation({
    mutationFn: async (newItem: Omit<CyberwareItem, "id">) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("selected_character_profile_id")
        .single();

      if (!profile?.selected_character_profile_id) {
        throw new Error("No character profile selected");
      }

      const { data, error } = await supabase
        .from("gear")
        .insert({
          ...newItem,
          character_profile_id: profile.selected_character_profile_id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cyberware"] });
      toast({
        title: "Success",
        description: "Gear added successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add gear",
        variant: "destructive"
      });
    }
  });

  const updateCyberwareMutation = useMutation({
    mutationFn: async (item: CyberwareItem) => {
      const { error } = await supabase
        .from("gear")
        .update(item)
        .eq("id", item.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cyberware"] });
      toast({
        title: "Success",
        description: "Gear updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update gear",
        variant: "destructive"
      });
    }
  });

  const deleteCyberwareMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("gear")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cyberware"] });
      toast({
        title: "Success",
        description: "Gear deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete gear",
        variant: "destructive"
      });
    }
  });

  return {
    cyberware,
    isLoading,
    addCyberware: addCyberwareMutation.mutate,
    updateCyberware: updateCyberwareMutation.mutate,
    deleteCyberware: deleteCyberwareMutation.mutate
  };
}
