
import { useState } from 'react';
import { Upload, UserCircle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CharacterAvatarProps {
  characterId: string;
  existingImageUrl?: string;
  characterName: string;
  onAvatarChange?: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
}

export function CharacterAvatar({ 
  characterId,
  existingImageUrl,
  characterName,
  onAvatarChange,
  size = 'md',
  editable = false
}: CharacterAvatarProps) {
  const [isUploading, setIsUploading] = useState(false);
  
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type and size
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive"
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload to Supabase storage
      const fileName = `avatar-${characterId}-${Date.now()}`;
      const { data, error } = await supabase.storage
        .from('character-avatars')
        .upload(fileName, file);
      
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = await supabase.storage
        .from('character-avatars')
        .getPublicUrl(fileName);
      
      const avatarUrl = urlData.publicUrl;
      
      // Update character profile
      await supabase
        .from('character_profiles')
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', characterId);
      
      // Call callback
      if (onAvatarChange) {
        onAvatarChange(avatarUrl);
      }
      
      toast({
        title: "Avatar uploaded",
        description: "Your character avatar has been updated."
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="relative">
      <Avatar className={`border-2 border-cyber-purple/50 ${sizeClasses[size]}`}>
        <AvatarImage src={existingImageUrl} alt={characterName} />
        <AvatarFallback className="bg-cyber-purple/20">
          <UserCircle className="text-cyber-purple h-full w-full p-1" />
        </AvatarFallback>
      </Avatar>
      
      {editable && (
        <div className="absolute -bottom-1 -right-1 bg-cyber-black rounded-full p-1 border border-cyber-purple">
          <label className="cursor-pointer">
            <Upload className="h-5 w-5 text-cyber-purple" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      )}
    </div>
  );
}
