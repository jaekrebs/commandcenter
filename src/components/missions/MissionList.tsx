
import { MissionCard, Mission } from "../MissionCard";

type MissionListProps = {
  missions: Mission[];
  onUpdate: (mission: Mission) => void;
  onDelete: (id: string) => void;
};

export function MissionList({ missions, onUpdate, onDelete }: MissionListProps) {
  if (missions.length === 0) {
    return (
      <div className="cyber-panel text-center py-8">
        <p className="text-gray-400">No missions found. Add a new mission to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {missions.map((mission) => (
        <MissionCard
          key={mission.id}
          mission={mission}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
