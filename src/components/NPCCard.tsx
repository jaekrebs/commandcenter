
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export type NPCRelationship = {
  id: string;
  npc_name: string; // Changed from 'name' to 'npc_name' to match database schema
  friendship: number;
  trust: number;
  lust: number;
  love: number;
  image: string;
  background: string;
  character_profile_id?: string; // Added this field to match database schema
  created_at?: string; // Added optional timestamp fields
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
          <h3 className="text-lg font-bold text-white">{npc.npc_name}</h3> {/* Updated to use npc_name instead of name */}
        </div>
        
        <div className="mt-4 space-y-3">
          {(["friendship", "trust", "lust", "love"] as const).map((stat) => (
            <div key={stat}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-300 capitalize">{stat}</span>
                <span className="text-sm text-white font-bold">{npc[stat]}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDecrease(stat)}
                  className="bg-cyber-darkgray p-1 rounded border border-cyber-purple/30 hover:bg-cyber-purple/10"
                >
                  <Minus size={14} />
                </button>
                
                <div className="cyber-progress-bar flex-grow">
                  <div
                    className="progress-fill bg-gradient-to-r from-cyber-purple to-cyber-pink"
                    style={{ width: `${(npc[stat] as number) * 10}%` }}
                  ></div>
                </div>
                
                <button
                  onClick={() => handleIncrease(stat)}
                  className="bg-cyber-darkgray p-1 rounded border border-cyber-purple/30 hover:bg-cyber-purple/10"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
