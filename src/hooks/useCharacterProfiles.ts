// src/hooks/useCharacterProfiles.ts
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/client";

export type CharacterProfile =
  Database["public"]["Tables"]["character_profiles"]["Row"];

/**
 * All character profiles for the logged-in userh
 */
export function useCharacterProfiles(): UseQueryResult<
  CharacterProfile[],
  Error
> {
  return useQuery({
    queryKey: ["characterProfiles"],
    queryFn: async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session?.user)
        throw sessionError ?? new Error("Not authenticated");

      const { data, error } = await supabase
        .from("character_profiles")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) throw error;
      return data ?? [];
    },
    staleTime: 60_000,
  });
}
