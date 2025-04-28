
import { CyberwareItem } from "@/hooks/useCyberware";
import { ChartPie, BarChart4 } from "lucide-react";

interface CyberwareStatsProps {
  cyberware: CyberwareItem[];
}

export function CyberwareStats({ cyberware }: CyberwareStatsProps) {
  const installedCount = cyberware.filter(item => item.installed).length;
  const totalCount = cyberware.length;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-white";
      case "uncommon":
        return "text-green-400";
      case "rare":
        return "text-cyber-blue";
      case "epic":
        return "text-cyber-purple";
      case "legendary":
        return "text-cyber-yellow";
      default:
        return "text-white";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="cyber-panel">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <BarChart4 size={18} className="text-cyber-blue" />
          <span>Installed Cyberware</span>
        </h3>
        <div className="cyber-progress-bar">
          <div 
            className="progress-fill bg-cyber-pink" 
            style={{
              width: `${totalCount > 0 ? (installedCount / totalCount * 100) : 0}%`
            }}
          />
        </div>
        <div className="flex justify-between mt-1 text-sm">
          <span>{installedCount} installed</span>
          <span>{totalCount} total</span>
        </div>
      </div>

      <div className="cyber-panel">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <ChartPie size={18} className="text-cyber-purple" />
          <span>Rarity Breakdown</span>
        </h3>
        <div className="space-y-1">
          {(["common", "uncommon", "rare", "epic", "legendary"] as const).map(rarity => {
            const count = cyberware.filter(item => item.rarity === rarity).length;
            return (
              <div key={rarity} className="flex justify-between">
                <span className={`${getRarityColor(rarity)} capitalize`}>
                  {rarity}
                </span>
                <span>{count}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="cyber-panel">
        <h3 className="font-bold text-lg mb-2">Performance Impact</h3>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-300">System Strain</span>
            <span className="text-cyber-yellow">
              {totalCount > 10 ? 'Critical' : totalCount > 7 ? 'High' : totalCount > 4 ? 'Moderate' : 'Low'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Neural Load</span>
            <span className={totalCount > 6 ? "text-cyber-red" : "text-cyber-blue"}>
              {Math.min(totalCount * 12, 100)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Power Consumption</span>
            <span className="text-cyber-green">Optimal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
