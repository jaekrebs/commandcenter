
import { NPCCard, NPCRelationship } from "@/components/NPCCard";

interface NPCGridProps {
  npcs: NPCRelationship[];
  onUpdate: (npc: NPCRelationship) => void;
}

export function NPCGrid({ npcs, onUpdate }: NPCGridProps) {
  if (npcs.length === 0) {
    return (
      <div className="col-span-full py-10 text-center">
        <p className="text-gray-400 mb-4">No NPC relationships found.</p>
        <p className="text-gray-500">Build connections in Night City to see them here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {npcs.map((npc) => (
        <NPCCard 
          key={npc.id} 
          npc={npc} 
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
