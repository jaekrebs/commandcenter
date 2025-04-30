import { useState } from "react";
import { Plus } from "lucide-react";
import { Mission } from "../components/MissionCard";
import { MissionList } from "../components/missions/MissionList";
import { MissionFilters } from "../components/missions/MissionFilters";
import { AddMissionForm } from "../components/missions/AddMissionForm";
import { useMissions } from "../hooks/useMissions";
import { useSelectedProfile } from "@/hooks/useSelectedProfile";
import { LoadingState } from "@/components/LoadingState";

export default function Missions() {
  const { profile: selectedCharacter } = useSelectedProfile();
  const [activeTab, setActiveTab] = useState<"all" | "main" | "side" | "gig">("all");
  const [showNewMissionForm, setShowNewMissionForm] = useState(false);
  const { missions, isLoading, addMission, updateMission, deleteMission } = useMissions();

  const handleAddMission = (newMission: Omit<Mission, "id">) => {
    addMission(newMission);
    setShowNewMissionForm(false);
  };

  if (isLoading) {
    return <LoadingState message="Loading mission data..." />;
  }

  if (!selectedCharacter) {
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

  const filteredMissions = missions.filter((mission) => {
    if (activeTab === "all") return true;
    return mission.type === activeTab;
  });

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
        <AddMissionForm 
          onAdd={handleAddMission}
          onClose={() => setShowNewMissionForm(false)}
        />
      )}

      <MissionFilters 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <MissionList 
        missions={filteredMissions}
        onUpdate={updateMission}
        onDelete={deleteMission}
      />
    </div>
  );
}