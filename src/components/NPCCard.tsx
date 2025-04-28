
import { NPCStatControl } from "./npc/NPCStatControl";

export type NPCRelationship = {
  id: string;
  npc_name: string;
  friendship: number;
  trust: number;
  lust: number;
  love: number;
  image: string;
  background: string;
  character_profile_id?: string;
  created_at?: string;
  updated_at?: string;
};

type NPCCardProps = {
  npc: NPCRelationship;
  onUpdate: (updatedNPC: NPCRelationship) => void;
};

export function NPCCard({ npc, onUpdate }: NPCCardProps) {
  const handleIncrease = (stat: keyof NPCRelationship) => {
    if (typeof npc[stat] === 'number' && npc[stat] < 10) {
      onUpdate({
        ...npc,
        [stat]: (npc[stat] as number) + 1,
      });
    }
  };

  const handleDecrease = (stat: keyof NPCRelationship) => {
    if (typeof npc[stat] === 'number' && npc[stat] > 0) {
      onUpdate({
        ...npc,
        [stat]: (npc[stat] as number) - 1,
      });
    }
  };

  return (
    <div className={`npc-card ${npc.background} transition-all hover:scale-[1.01]`}>
      <div className="absolute inset-0 opacity-30">
        <div className="shimmer"></div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-cyber-purple/50" 
            style={{ backgroundImage: `url(${npc.image})` }}
          />
          <h3 className="text-lg font-bold text-white">{npc.npc_name}</h3>
        </div>
        
        <div className="mt-4 space-y-3">
          {(["friendship", "trust", "lust", "love"] as const).map((stat) => (
            <NPCStatControl
              key={stat}
              stat={stat}
              value={npc[stat] as number}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
