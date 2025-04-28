
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export type RelicStatus = {
  id: string;
  profile_id: string;
  relic_integrity: number;
  johnny_influence: number;
  created_at?: string;
  updated_at?: string;
};

export function useRelicStatus() {
  const queryClient = useQueryClient();

  const { data: relicStatus, isLoading } = useQuery({
    queryKey: ["relic-status"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data, error } = await supabase
        .from("relic_status")
        .select("*")
        .eq("profile_id", session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      // If no relic status exists, create initial status
      if (!data) {
        const { data: newStatus, error: createError } = await supabase
          .from("relic_status")
          .insert({
            profile_id: session.user.id,
            relic_integrity: 100,
            johnny_influence: 0
          })
          .select()
          .single();

        if (createError) throw createError;
        return newStatus;
      }

      return data;
    }
  });

  const updateRelicStatus = useMutation({
    mutationFn: async (updates: Partial<RelicStatus>) => {
      if (!relicStatus?.id) throw new Error("No relic status found");

      const { error } = await supabase
        .from("relic_status")
        .update(updates)
        .eq("id", relicStatus.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relic-status"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update relic status",
        variant: "destructive"
      });
    }
  });

  return {
    relicStatus,
    isLoading,
    updateRelicStatus: updateRelicStatus.mutate
  };
}
