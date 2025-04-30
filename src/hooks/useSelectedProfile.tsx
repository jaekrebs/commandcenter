import { createContext, useContext, ReactNode } from "react";
import { useCharacterProfiles } from "@/hooks/useCharacterProfiles";
import type { CharacterProfile } from "@/hooks/useCharacterProfiles";

type ContextType = {
  profile: CharacterProfile | null;
  refresh: () => void;
};

export const SelectedProfileContext = createContext<ContextType>({
  profile: null,
  refresh: () => {},
});

export const SelectedProfileProvider = ({ children }: { children: ReactNode }) => {
  const { data: profiles = [], refetch } = useCharacterProfiles();
  const selected = profiles.find((p) => p.is_selected) ?? null;

  return (
    <SelectedProfileContext.Provider value={{ profile: selected, refresh: refetch }}>
      {children}
    </SelectedProfileContext.Provider>
  );
};

export const useSelectedProfile = () => useContext(SelectedProfileContext);