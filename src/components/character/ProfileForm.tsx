
import { ProfileData } from "../types/character";

type ProfileFormProps = {
  profile: ProfileData;
  onProfileChange: (field: keyof ProfileData, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function ProfileForm({ profile, onProfileChange, onSave, onCancel }: ProfileFormProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
          <input
            className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
            value={profile.name}
            onChange={(e) => onProfileChange("name", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Lifepath</label>
          <select
            className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
            value={profile.lifepath}
            onChange={(e) => onProfileChange("lifepath", e.target.value)}
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
          value={profile.class}
          onChange={(e) => onProfileChange("class", e.target.value)}
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
          value={profile.primaryWeapons}
          onChange={(e) => onProfileChange("primaryWeapons", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Gear</label>
        <input
          className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
          value={profile.gear}
          onChange={(e) => onProfileChange("gear", e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className="cyber-button text-sm">
          Cancel
        </button>
        <button onClick={onSave} className="cyber-button-accent text-sm">
          Save
        </button>
      </div>
    </div>
  );
}
