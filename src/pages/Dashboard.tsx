
import { CharacterProfile } from "../components/CharacterProfile";
import { RelicStatus } from "../components/RelicStatus";
import { MissionCard } from "../components/MissionCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/LoadingState";
import { useMissions } from "@/hooks/useMissions";

export default function Dashboard() {
  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("selected_character_profile_id")
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Use the missions hook instead of hardcoded data
  const { missions, isLoading: isLoadingMissions, updateMission } = useMissions();

  console.log("Dashboard render - userProfile:", userProfile);
  console.log("isLoadingProfile:", isLoadingProfile);

  // Show loading state if still loading profile or missions data
  if (isLoadingProfile || isLoadingMissions) {
    return <LoadingState message="Loading character data..." />;
  }

  // Show character selection message if no character is selected
  if (!userProfile?.selected_character_profile_id) {
    console.log("No character selected, showing redirect");
    return (
      <div className="container px-4 py-8 mx-auto text-white">
        <LoadingState 
          message="Access terminal ready" 
          type="character-required"
          showRedirect={true}
        />
      </div>
    );
  }

  // Sort and filter missions for the dashboard view
  const recentMissions = missions
    .sort((a, b) => {
      // Sort completed missions to the bottom
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      // Then sort by progress (descending)
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
                  onDelete={() => {}} // We don't need delete on dashboard view
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
