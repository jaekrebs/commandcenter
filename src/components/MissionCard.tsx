
import { useState } from "react";
import { Edit, X, Check } from "lucide-react";

export type Mission = {
  id: string;
  name: string;
  type: "main" | "side" | "gig";
  progress_percent: number;
  notes: string;
  completed: boolean;
  character_profile_id?: string;
  created_at?: string;
  updated_at?: string;
};

type MissionCardProps = {
  mission: Mission;
  onUpdate: (updatedMission: Mission) => void;
  onDelete: (id: string) => void;
};

export function MissionCard({ mission, onUpdate, onDelete }: MissionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMission, setEditedMission] = useState({ ...mission });

  const handleSave = () => {
    onUpdate(editedMission);
    setIsEditing(false);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedMission({
      ...editedMission,
      progress_percent: Number(e.target.value),
    });
  };

  const handleCompletedToggle = () => {
    const isCompleted = !mission.completed;
    const updatedMission = {
      ...mission,
      completed: isCompleted,
      progress_percent: isCompleted ? 100 : mission.progress_percent,
    };
    onUpdate(updatedMission);
  };

  let borderColor = 'border-cyber-purple/30';
  if (mission.type === 'main') borderColor = 'border-cyber-yellow/50';
  if (mission.type === 'side') borderColor = 'border-cyber-blue/50';
  
  return (
    <div className={`cyber-panel border-l-4 ${borderColor} ${mission.completed ? 'opacity-70' : ''}`}>
      {isEditing ? (
        <div className="space-y-3">
          <input
            className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
            value={editedMission.name}
            onChange={(e) =>
              setEditedMission({ ...editedMission, name: e.target.value })
            }
          />
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Type</label>
            <select
              className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
              value={editedMission.type}
              onChange={(e) =>
                setEditedMission({
                  ...editedMission,
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
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{editedMission.progress_percent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={editedMission.progress_percent}
              onChange={handleProgressChange}
              className="w-full accent-cyber-purple"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Notes</label>
            <textarea
              className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full h-20 focus:outline-none focus:ring-1 focus:ring-cyber-purple"
              value={editedMission.notes}
              onChange={(e) =>
                setEditedMission({ ...editedMission, notes: e.target.value })
              }
            />
          </div>
          
          <div className="flex justify-between pt-2">
            <button 
              onClick={() => onDelete(mission.id)} 
              className="text-cyber-red hover:text-red-500 transition-colors text-sm"
            >
              Delete
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="cyber-button text-sm"
              >
                Cancel
              </button>
              <button onClick={handleSave} className="cyber-button-accent text-sm">
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              {mission.completed && (
                <span className="text-cyber-purple">
                  <Check size={16} />
                </span>
              )}
              <h3 className={`font-bold ${mission.completed ? 'text-gray-400' : 'text-white'}`}>
                {mission.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyber-darkgray border border-cyber-purple/20">
                {mission.type === 'main' 
                  ? 'Main Mission' 
                  : mission.type === 'side' 
                    ? 'Side Job' 
                    : 'Gig'
                }
              </span>
              <button
                onClick={() => setIsEditing(true)}
                className="text-cyber-blue hover:text-cyber-purple transition-colors"
              >
                <Edit size={14} />
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Progress</span>
                <span>{mission.progress_percent}%</span>
              </div>
              <div className="cyber-progress-bar">
                <div
                  className={`progress-fill ${
                    mission.completed 
                      ? 'bg-cyber-purple' 
                      : 'bg-gradient-to-r from-cyber-blue to-cyber-purple'
                  }`}
                  style={{ width: `${mission.progress_percent}%` }}
                ></div>
              </div>
            </div>
            
            {mission.notes && (
              <div className="mt-3 text-sm text-gray-300">
                <p>{mission.notes}</p>
              </div>
            )}
            
            <div className="flex justify-end pt-2">
              <button
                onClick={handleCompletedToggle}
                className={`text-sm px-3 py-1 rounded border ${
                  mission.completed
                    ? 'border-gray-500 text-gray-400 hover:text-white'
                    : 'border-cyber-purple/50 text-cyber-purple hover:bg-cyber-purple/10'
                }`}
              >
                {mission.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
