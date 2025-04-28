
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCharacterProfiles() {
  return useQuery({
    queryKey: ["character-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("character_profiles")
        .select("*");
      
      if (error) throw error;
      return data;
    }
  });
}
