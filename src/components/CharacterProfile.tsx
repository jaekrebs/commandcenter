
import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import { Button } from "../components/ui/button";

type ProfileData = {
  name: string;
  lifepath: string;
  class: string;
  primaryWeapons: string;
  gear: string;
};

export function CharacterProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(() => {
    const savedProfile = localStorage.getItem("v-character-profile");
    return savedProfile
      ? JSON.parse(savedProfile)
      : {
          name: "V",
          lifepath: "Corpo",
          class: "Netrunner",
          primaryWeapons: "Militech M-10AF Lexington, Mantis Blades",
          gear: "Armored Corporate Suit",
        };
  });

  const [editedProfile, setEditedProfile] = useState<ProfileData>({ ...profile });

  useEffect(() => {
    localStorage.setItem("v-character-profile", JSON.stringify(profile));
  }, [profile]);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  return (
    <div className="cyber-panel relative">
      <div className="absolute top-2 right-2">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-cyber-purple hover:text-cyber-blue transition-colors"
          >
            <Edit size={16} />
          </button>
        ) : null}
      </div>
      
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="text-cyber-purple glow-text mr-2">V</span> 
        Character Profile
      </h2>

      {isEditing ? (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
              <input
                className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
                value={editedProfile.name}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Lifepath</label>
              <select
                className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
                value={editedProfile.lifepath}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, lifepath: e.target.value })
                }
              >
                <option>Corpo</option>
                <option>Street Kid</option>
                <option>Nomad</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Class</label>
            <select
              className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
              value={editedProfile.class}
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, class: e.target.value })
              }
            >
              <option>Netrunner</option>
              <option>Solo</option>
              <option>Techie</option>
              <option>Nomad</option>
              <option>Rockerboy</option>
              <option>Media</option>
              <option>Exec</option>
              <option>Medtech</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Primary Weapons</label>
            <input
              className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
              value={editedProfile.primaryWeapons}
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, primaryWeapons: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Gear</label>
            <input
              className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
              value={editedProfile.gear}
              onChange={(e) =>
                setEditedProfile({ ...editedProfile, gear: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={handleCancel} className="cyber-button text-sm">
              Cancel
            </button>
            <button onClick={handleSave} className="cyber-button-accent text-sm">
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-gray-400">Name:</span>{" "}
              <span className="text-white">{profile.name}</span>
            </div>
            <div>
              <span className="text-gray-400">Lifepath:</span>{" "}
              <span className="text-white">{profile.lifepath}</span>
            </div>
            <div>
              <span className="text-gray-400">Class:</span>{" "}
              <span className="text-white">{profile.class}</span>
            </div>
          </div>
          <div>
            <span className="text-gray-400">Primary Weapons:</span>{" "}
            <span className="text-white">{profile.primaryWeapons}</span>
          </div>
          <div>
            <span className="text-gray-400">Gear:</span>{" "}
            <span className="text-white">{profile.gear}</span>
          </div>
        </div>
      )}
    </div>
  );
}
