
import { Edit } from "lucide-react";
import { ProfileDisplay } from "./character/ProfileDisplay";
import { ProfileForm } from "./character/ProfileForm";
import { useCharacterProfile } from "./character/useCharacterProfile";

export function CharacterProfile() {
  const {
    isEditing,
    setIsEditing,
    profile,
    editedProfile,
    userProfile,
    handleProfileChange,
    handleSave,
    handleCancel
  } = useCharacterProfile();

  if (!userProfile?.selected_character_profile_id) {
    return (
      <div className="cyber-panel">
        <h2 className="text-xl font-bold text-white mb-4">
          <span className="text-cyber-purple glow-text mr-2">V</span> 
          Character Profile
        </h2>
        <p className="text-sm text-gray-300">
          No character profile selected. Please select a profile in the settings page.
        </p>
      </div>
    );
  }

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
      
      <h2 className="text-xl font-bold text-white mb-4">
        <span className="text-cyber-purple glow-text mr-2">{profile.name}</span> 
        Character Profile
      </h2>

      {isEditing ? (
        <ProfileForm
          profile={editedProfile}
          onProfileChange={handleProfileChange}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <ProfileDisplay profile={profile} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}
