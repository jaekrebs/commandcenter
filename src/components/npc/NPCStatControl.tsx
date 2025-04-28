
import { Plus, Minus } from "lucide-react";
import { NPCRelationship } from "../NPCCard";

interface NPCStatControlProps {
  stat: keyof NPCRelationship;
  value: number;
  onIncrease: (stat: keyof NPCRelationship) => void;
  onDecrease: (stat: keyof NPCRelationship) => void;
}

export function NPCStatControl({ 
  stat, 
  value, 
  onIncrease, 
  onDecrease 
}: NPCStatControlProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-300 capitalize">{stat}</span>
        <span className="text-sm text-white font-bold">{value}/10</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onDecrease(stat)}
          className="bg-cyber-darkgray p-1 rounded border border-cyber-purple/30 hover:bg-cyber-purple/10"
        >
          <Minus size={14} />
        </button>
        
        <div className="cyber-progress-bar flex-grow">
          <div
            className="progress-fill bg-gradient-to-r from-cyber-purple to-cyber-pink"
            style={{ width: `${value * 10}%` }}
          ></div>
        </div>
        
        <button
          onClick={() => onIncrease(stat)}
          className="bg-cyber-darkgray p-1 rounded border border-cyber-purple/30 hover:bg-cyber-purple/10"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
