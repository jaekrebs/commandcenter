
import { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Update to match tables in Supabase
type FileType = 'notes' | 'npc_relationships' | 'missions' | 'cyberware' | 'character_profiles';

type HeaderMapping = {
  [key in FileType]: string[];
};

const HEADER_MAPPINGS: HeaderMapping = {
  notes: ['Title', 'Content', 'Date'],
  npc_relationships: ['NPC name', 'Friendship', 'Trust', 'Lust', 'Love', 'Image', 'Background'],
  missions: ['Name', 'Type', 'Progress', 'Notes', 'Completed'],
  cyberware: ['Name', 'Type', 'Status', 'Description', 'Rarity', 'Installed'],
  character_profiles: ['Name', 'Class', 'Lifepath', 'Primary weapons', 'Gear']
};

interface FileUploaderProps {
  type: FileType;
  onDataImported: (data: any[]) => void;
}

export function FileUploader({ type, onDataImported }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const validateHeaders = (headers: string[]): boolean => {
    const expectedHeaders = HEADER_MAPPINGS[type];
    return expectedHeaders.every(header => 
      headers.map(h => h.toLowerCase()).includes(header.toLowerCase())
    );
  };

  const syncToSupabase = async (data: any[]) => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session?.user) {
      toast({
        title: "Authentication required",
        description: "Please log in to sync data with your profile.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get user's selected character profile id
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('selected_character_profile_id')
        .eq('id', sessionData.session.user.id)
        .single();
        
      if (!userProfile?.selected_character_profile_id) {
        toast({
          title: "No character profile selected",
          description: "Please select a character profile in settings first.",
          variant: "destructive",
        });
        return;
      }
      
      const characterProfileId = userProfile.selected_character_profile_id;

      switch (type) {
        case 'character_profiles':
          const { error: profileError } = await supabase
            .from('character_profiles')
            .update({
              name: data[0].name,
              class: data[0].class,
              lifepath: data[0].lifepath,
              primary_weapons: data[0].primary_weapons,
              gear: data[0].gear,
              updated_at: new Date().toISOString()
            })
            .eq('id', characterProfileId);
          
          if (profileError) throw profileError;
          break;
          
        case 'npc_relationships':
          const { error: npcError } = await supabase
            .from('npc_relationships')
            .upsert(data.map(npc => ({
              character_profile_id: characterProfileId,
              npc_name: npc.npc_name,
              friendship: Number(npc.friendship) || 0,
              trust: Number(npc.trust) || 0,
              lust: Number(npc.lust) || 0,
              love: Number(npc.love) || 0,
              image: npc.image,
              background: npc.background,
              updated_at: new Date().toISOString()
            })));
          
          if (npcError) throw npcError;
          break;
          
        case 'notes':
          const { error: notesError } = await supabase
            .from('notes')
            .upsert(data.map(note => ({
              character_profile_id: characterProfileId,
              title: note.title,
              content: note.content,
              updated_at: new Date().toISOString()
            })));
          
          if (notesError) throw notesError;
          break;
          
        case 'missions':
          const { error: missionsError } = await supabase
            .from('missions')
            .upsert(data.map(mission => ({
              character_profile_id: characterProfileId,
              name: mission.name,
              type: mission.type,
              progress_percent: Number(mission.progress) || 0,
              notes: mission.notes,
              completed: mission.completed === 'true' || mission.completed === true || false,
              updated_at: new Date().toISOString()
            })));
          
          if (missionsError) throw missionsError;
          break;
          
        case 'cyberware':
          const { error: cyberwareError } = await supabase
            .from('cyberware')
            .upsert(data.map(item => ({
              character_profile_id: characterProfileId,
              name: item.name,
              type: item.type,
              description: item.description,
              status: item.status,
              updated_at: new Date().toISOString()
            })));
          
          if (cyberwareError) throw cyberwareError;
          break;
      }

      toast({
        title: "Data synced",
        description: `Successfully synced ${data.length} items to your profile.`,
      });
    } catch (error) {
      console.error('Error syncing data:', error);
      toast({
        title: "Sync failed",
        description: "Failed to sync data with your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      let rows = text.split('\n').map(row => row.trim()).filter(row => row.length > 0);
      const headers = rows[0].split(',').map(header => header.trim());

      if (!validateHeaders(headers)) {
        toast({
          variant: "destructive",
          title: "Invalid file format",
          description: `Expected headers: ${HEADER_MAPPINGS[type].join(', ')}`,
        });
        return;
      }

      const data = rows.slice(1).map(row => {
        const values = row.split(',').map(value => value.trim());
        return headers.reduce((obj, header, index) => {
          // Convert header to snake_case for database compatibility
          const key = header.toLowerCase().replace(/\s+/g, '_');
          obj[key] = values[index];
          return obj;
        }, {} as any);
      });

      await syncToSupabase(data);
      onDataImported(data);
      
      toast({
        title: "Import successful",
        description: `${data.length} ${type.replace('_', ' ')} imported successfully.`,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: "destructive",
        title: "Error importing file",
        description: "Please check the file format and try again.",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      handleFile(file);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a CSV file.",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors
        ${isDragging ? 'border-cyber-purple bg-cyber-purple/10' : 'border-gray-600'}
      `}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-2">
        <Upload className="w-8 h-8 text-gray-400" />
        <p className="text-sm text-gray-300">
          Drag and drop a CSV file or click to upload
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <AlertCircle className="w-4 h-4" />
          <span>Required headers: {HEADER_MAPPINGS[type].join(', ')}</span>
        </div>
        <input
          type="file"
          accept=".csv"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}
