
import { CharacterProfile } from "../components/CharacterProfile";
import { RelicStatus } from "../components/RelicStatus";
import { useState, useEffect } from "react";
import { MissionCard, Mission } from "../components/MissionCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/LoadingState";

export default function Dashboard() {
  const [missions, setMissions] = useState<Mission[]>(() => {
    const savedMissions = localStorage.getItem("v-missions");
    return savedMissions
      ? JSON.parse(savedMissions)
      : [
          {
            id: "mission1",
            name: "The Heist",
            type: "main",
            progress: 100,
            notes: "Completed the Konpeki Plaza heist with Jackie.",
            completed: true,
          },
          {
            id: "mission2",
            name: "Playing for Time",
            type: "main",
            progress: 60,
            notes: "Met with Takemura, investigating leads on Hellman.",
            completed: false,
          },
          {
            id: "mission3",
            name: "The Hunt",
            type: "side",
            progress: 75,
            notes: "Helping River track down a serial killer.",
            completed: false,
          },
        ];
  });

  // Fetch user profile to check if character is selected
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
      
      if (error) {
        console.error("Profile fetch error:", error);
        return null;
      }
      return data;
    }
  });

  useEffect(() => {
    localStorage.setItem("v-missions", JSON.stringify(missions));
  }, [missions]);

  const handleUpdateMission = (updatedMission: Mission) => {
    setMissions(
      missions.map((mission) =>
        mission.id === updatedMission.id ? updatedMission : mission
      )
    );
  };

  const handleDeleteMission = (id: string) => {
    setMissions(missions.filter((mission) => mission.id !== id));
  };

  console.log("Dashboard render - userProfile:", userProfile);
  console.log("isLoadingProfile:", isLoadingProfile);

  // Show loading state if still loading profile data
  if (isLoadingProfile) {
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
              {missions
                .sort((a, b) => {
                  // Sort completed missions to the bottom
                  if (a.completed && !b.completed) return 1;
                  if (!a.completed && b.completed) return -1;
                  // Then sort by progress (descending)
                  return b.progress - a.progress;
                })
                .slice(0, 3)
                .map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    onUpdate={handleUpdateMission}
                    onDelete={handleDeleteMission}
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
