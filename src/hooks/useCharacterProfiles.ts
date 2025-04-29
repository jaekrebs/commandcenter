// src/hooks/useCharacterProfiles.ts
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CharacterProfile {
  id: string;
  name: string;
  lifepath: string | null;
  class: string | null;
  primary_weapons: string | null;
  gear: string | null;
  gear_loadout: string | null;
  profile_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export function useCharacterProfiles(): UseQueryResult<CharacterProfile[], Error> {
  return useQuery<CharacterProfile[], Error>({
    queryKey: ["characterProfiles"],
    queryFn: async (): Promise<CharacterProfile[]> => {
      // 1) Grab the session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session?.user) {
        throw sessionError ?? new Error("You must be logged in");
      }

      // 2) Fetch only this user’s profiles
      const userId = session.user.id;
      const { data, error } = await supabase
        .from("character_profiles")
        .select("*")
        .eq("profile_id", userId);

      if (error) throw error;
      return (data ?? []) as CharacterProfile[];
    },
    staleTime: 1000 * 60,
  });
}