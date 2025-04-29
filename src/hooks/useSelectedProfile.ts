import { useCharacterProfiles } from "@/hooks/useCharacterProfiles";

export function useSelectedProfile() {
  const { data, isLoading } = useCharacterProfiles();
  return {
    profile: data?.find(p => p.is_selected) ?? null,
    isLoading,
  };
}
