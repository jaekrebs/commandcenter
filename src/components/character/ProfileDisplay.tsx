
import { ProfileData } from "../types/character";

type ProfileDisplayProps = {
  profile: ProfileData;
  onEdit: () => void;
};

export function ProfileDisplay({ profile, onEdit }: ProfileDisplayProps) {
  return (
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
  );
}
