
import { useState } from "react";
import { NPCGrid } from "@/components/npc/NPCGrid";
import { NPCHeader } from "@/components/npc/NPCHeader";
import { LoadingState } from "@/components/LoadingState";
import { useNPCs } from "@/hooks/useNPCs";

export default function NPCRelationships() {
  const { npcs, isLoading, hasCharacter, updateNPC } = useNPCs();
  const [filteredNPCs, setFilteredNPCs] = useState(npcs);

  const handleSearch = (searchTerm: string) => {
    const filtered = npcs.filter((npc) =>
      npc.npc_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNPCs(filtered);
  };

  // Show loading state while fetching NPCs data
  if (isLoading) {
    return <LoadingState message="Loading NPC relationship data..." />;
  }

  // Show character selection message if no character is selected
  if (!hasCharacter) {
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
