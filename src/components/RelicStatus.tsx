
import { useRelicStatus } from "@/hooks/useRelicStatus";
import { LoadingState } from "./LoadingState";

export function RelicStatus() {
  const { relicStatus, isLoading, updateRelicStatus } = useRelicStatus();

  if (isLoading) {
    return <LoadingState message="Loading relic status..." />;
  }

  if (!relicStatus) {
    return null;
  }

  return (
    <div className="cyber-panel">
      <h2 className="text-xl font-bold text-white mb-4">
        Relic Status
      </h2>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-400">Relic Integrity</span>
            <span className="text-sm text-white">{relicStatus.relic_integrity}%</span>
          </div>
          <div className="cyber-progress-bar">
            <div
              className="progress-fill bg-gradient-to-r from-cyber-blue to-cyber-purple"
              style={{ width: `${relicStatus.relic_integrity}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-400">Johnny's Influence</span>
            <span className="text-sm text-white">{relicStatus.johnny_influence}%</span>
          </div>
          <div className="cyber-progress-bar">
            <div
              className="progress-fill bg-gradient-to-r from-cyber-red to-cyber-pink"
              style={{ width: `${relicStatus.johnny_influence}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
