import { useState, useEffect } from "react";
import { MissionCard, Mission } from "../components/MissionCard";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/LoadingState";

export default function Missions() {
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
          {
            id: "mission4",
            name: "The Pickup",
            type: "main",
            progress: 100,
            notes: "Retrieved the Flathead from Maelstrom.",
            completed: true,
          },
          {
            id: "mission5",
            name: "Automatic Love",
            type: "main",
            progress: 90,
            notes: "Investigating Evelyn's connections at Clouds.",
            completed: false,
          },
          {
            id: "mission6",
            name: "Pyramid Song",
            type: "side",
            progress: 50,
            notes: "Diving with Judy to explore sunken town.",
            completed: false,
          },
          {
            id: "mission7",
            name: "Epistrophy",
            type: "gig",
            progress: 30,
            notes: "Helping Delamain retrieve his rogue taxis.",
            completed: false,
          },
        ];
  });

  const [activeTab, setActiveTab] = useState<"all" | "main" | "side" | "gig">("all");
  const [showNewMissionForm, setShowNewMissionForm] = useState(false);
  const [newMission, setNewMission] = useState<Omit<Mission, "id">>({
    name: "",
    type: "main",
    progress: 0,
    notes: "",
    completed: false,
  });

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

  const handleAddMission = () => {
    if (newMission.name.trim()) {
      const id = `mission${Date.now()}`;
      setMissions([
        ...missions,
        {
          id,
          ...newMission,
        },
      ]);
      setNewMission({
        name: "",
        type: "main",
        progress: 0,
        notes: "",
        completed: false,
      });
      setShowNewMissionForm(false);
    }
  };

  const filteredMissions = missions.filter((mission) => {
    if (activeTab === "all") return true;
    return mission.type === activeTab;
  });

  if (isLoadingProfile) {
    return <LoadingState message="Loading mission data..." />;
  }

  if (!userProfile?.selected_character_profile_id) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <LoadingState 
          message="Mission data unavailable" 
          type="character-required"
          showRedirect={true}
        />
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-white">
          <span className="text-cyber-blue glow-text">Missions</span> & Jobs
        </h1>
        
        <button
          onClick={() => setShowNewMissionForm(true)}
          className="cyber-button flex items-center gap-2"
          disabled={showNewMissionForm}
        >
          <Plus size={16} />
          <span>Add Mission</span>
        </button>
      </div>

      {showNewMissionForm && (
        <div className="cyber-panel mb-6">
          <h2 className="text-xl font-bold text-white mb-4">New Mission</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Mission Name</label>
              <input
                className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
                value={newMission.name}
                onChange={(e) =>
                  setNewMission({ ...newMission, name: e.target.value })
                }
                placeholder="Enter mission name"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type</label>
              <select
                className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
                value={newMission.type}
                onChange={(e) =>
                  setNewMission({
                    ...newMission,
                    type: e.target.value as "main" | "side" | "gig",
                  })
                }
              >
                <option value="main">Main Mission</option>
                <option value="side">Side Job</option>
                <option value="gig">Gig</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
                value={newMission.progress}
                onChange={(e) =>
                  setNewMission({
                    ...newMission,
                    progress: Number(e.target.value),
                  })
                }
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Notes</label>
              <textarea
                className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full h-20 focus:outline-none focus:ring-1 focus:ring-cyber-purple"
                value={newMission.notes}
                onChange={(e) =>
                  setNewMission({ ...newMission, notes: e.target.value })
                }
                placeholder="Optional notes about this mission"
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowNewMissionForm(false)}
                className="cyber-button text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMission}
                className="cyber-button-accent text-sm"
                disabled={!newMission.name.trim()}
              >
                Add Mission
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 border-b border-cyber-purple/20">
        <div className="flex flex-wrap space-x-1 space-y-1 sm:space-y-0">
          {(["all", "main", "side", "gig"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-cyber-purple text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab === "all"
                ? "All Missions"
                : tab === "main"
                ? "Main Missions"
                : tab === "side"
                ? "Side Jobs"
                : "Gigs"}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredMissions.length === 0 ? (
          <div className="cyber-panel text-center py-8">
            <p className="text-gray-400">No missions found. Add a new mission to get started.</p>
          </div>
        ) : (
          filteredMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onUpdate={handleUpdateMission}
              onDelete={handleDeleteMission}
            />
          ))
        )}
      </div>
    </div>
  );
}
