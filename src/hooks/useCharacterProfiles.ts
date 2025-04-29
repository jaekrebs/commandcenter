
// src/hooks/useCharacterProfiles.ts
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/client";

// Leverage generated types:
export type CharacterProfile = Database["public"]["Tables"]["character_profiles"]["Row"];

/**
 * Fetch all character_profiles rows for current user
 * Includes is_selected flag
 */
export function useCharacterProfiles(): UseQueryResult<CharacterProfile[], Error> {
  return useQuery<CharacterProfile[], Error>({
    queryKey: ["characterProfiles"],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.user) throw sessionError ?? new Error("Not authenticated");
      const userId = session.user.id;
      const { data, error } = await supabase
        .from("character_profiles")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 60_000
  });
}

