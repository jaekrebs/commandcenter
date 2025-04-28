
import { useState, useEffect } from "react";
import { NPCCard } from "../components/NPCCard";
import { LoadingState } from "@/components/LoadingState";
import { useNPCs } from "@/hooks/useNPCs";

export default function NPCRelationships() {
  const [searchTerm, setSearchTerm] = useState("");
  const { npcs, isLoading, hasCharacter, updateNPC } = useNPCs();

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

  const filteredNPCs = npcs.filter((npc) =>
    npc.npc_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-white">
          NPC <span className="text-cyber-purple glow-text">Relationships</span>
        </h1>
        
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search NPCs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
          />
        </div>
      </div>

      <div className="cyber-panel mb-6">
        <p className="text-gray-300">
          Track your relationships with key characters in Night City. Adjust ratings for friendship, trust, lust, and love as your interactions evolve.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNPCs.length > 0 ? (
          filteredNPCs.map((npc) => (
            <NPCCard 
              key={npc.id} 
              npc={npc} 
              onUpdate={updateNPC} 
            />
          ))
        ) : (
          <div className="col-span-full py-10 text-center">
            <p className="text-gray-400 mb-4">No NPC relationships found.</p>
            <p className="text-gray-500">Build connections in Night City to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
