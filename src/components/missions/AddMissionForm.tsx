
import { useState } from "react";
import { Mission } from "../MissionCard";

type AddMissionFormProps = {
  onAdd: (mission: Omit<Mission, "id">) => void;
  onClose: () => void;
};

export function AddMissionForm({ onAdd, onClose }: AddMissionFormProps) {
  const [newMission, setNewMission] = useState<Omit<Mission, "id">>({
    name: "",
    type: "main",
    progress_percent: 0,
    notes: "",
    completed: false,
  });

  const handleSubmit = () => {
    if (newMission.name.trim()) {
      onAdd(newMission);
      setNewMission({
        name: "",
        type: "main",
        progress_percent: 0,
        notes: "",
        completed: false,
      });
    }
  };

  return (
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
            value={newMission.progress_percent}
            onChange={(e) =>
              setNewMission({
                ...newMission,
                progress_percent: Number(e.target.value),
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
            onClick={onClose}
            className="cyber-button text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="cyber-button-accent text-sm"
            disabled={!newMission.name.trim()}
          >
            Add Mission
          </button>
        </div>
      </div>
    </div>
  );
}
