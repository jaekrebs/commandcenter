import { useState } from "react";
import { NPCGrid } from "@/components/npc/NPCGrid";
import { NPCHeader } from "@/components/npc/NPCHeader";
import { LoadingState } from "@/components/LoadingState";
import { useNPCs } from "@/hooks/useNPCs";
import { useSelectedProfile } from "@/hooks/useSelectedProfile";

export default function NPCRelationships() {
  const { profile: selectedCharacter } = useSelectedProfile();
  const { npcs, isLoading, updateNPC } = useNPCs();
  const [filteredNPCs, setFilteredNPCs] = useState(npcs);

  const handleSearch = (searchTerm: string) => {
    const filtered = npcs.filter((npc) =>
      npc.npc_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNPCs(filtered);
  };

  if (isLoading) {
    return <LoadingState message="Loading NPC relationship data..." />;
  }

  if (!selectedCharacter) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <LoadingState 
          message="NPC relationship data unavailable" 
          type="character-required"
          showRedirect={true}
        />
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <NPCHeader onSearch={handleSearch} />
      <NPCGrid npcs={filteredNPCs} onUpdate={updateNPC} />
    </div>
  );
}