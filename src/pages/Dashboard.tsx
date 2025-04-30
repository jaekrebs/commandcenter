import { CharacterProfile } from "../components/CharacterProfile";
import { RelicStatus } from "../components/RelicStatus";
import { MissionCard } from "../components/MissionCard";
import { useSelectedProfile } from "@/hooks/useSelectedProfile";
import { useMissions } from "@/hooks/useMissions";
import { LoadingState } from "@/components/LoadingState";

export default function Dashboard() {
  const { profile: selectedCharacter } = useSelectedProfile();
  const { missions, isLoading: isLoadingMissions, updateMission } = useMissions();

  if (!selectedCharacter || isLoadingMissions) {
    return <LoadingState message="Loading character data..." />;
  }

  const recentMissions = missions
    .sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return b.progress_percent - a.progress_percent;
    })
    .slice(0, 3);

  return (
    <div className="container px-4 py-8 mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Welcome back to <span className="text-cyber-purple glow-text">Night City</span>
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CharacterProfile />
          
          <div className="cyber-panel">
            <h2 className="text-xl font-bold text-white mb-4">
              Recent Missions
            </h2>
            <div className="space-y-4">
              {recentMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  onUpdate={updateMission}
                  onDelete={() => {}}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <RelicStatus />
          
          <div className="cyber-panel">
            <h2 className="text-xl font-bold text-white mb-4">
              Quick Stats
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-cyber-black/50 p-3 rounded-md">
                <div className="text-sm text-gray-400">Total Missions</div>
                <div className="text-2xl font-bold text-white">{missions.length}</div>
              </div>
              <div className="bg-cyber-black/50 p-3 rounded-md">
                <div className="text-sm text-gray-400">Completed</div>
                <div className="text-2xl font-bold text-white">
                  {missions.filter((m) => m.completed).length}
                </div>
              </div>
              <div className="bg-cyber-black/50 p-3 rounded-md">
                <div className="text-sm text-gray-400">Main Missions</div>
                <div className="text-2xl font-bold text-white">
                  {missions.filter((m) => m.type === "main").length}
                </div>
              </div>
              <div className="bg-cyber-black/50 p-3 rounded-md">
                <div className="text-sm text-gray-400">Side Jobs</div>
                <div className="text-2xl font-bold text-white">
                  {missions.filter((m) => m.type === "side" || m.type === "gig").length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}