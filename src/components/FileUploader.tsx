import { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type FileType = 'notes' | 'npcs' | 'missions' | 'cyberware' | 'character_profiles';

type HeaderMapping = {
  [key in FileType]: string[];
};

const HEADER_MAPPINGS: HeaderMapping = {
  notes: ['Note title', 'Note content', 'Note date'],
  npcs: ['NPC name', 'Friendship', 'Trust', 'Lust', 'Love', 'Image', 'Background'],
  missions: ['Mission name', 'Type', 'Progress', 'Notes', 'Completed'],
  cyberware: ['Name', 'Type', 'Status', 'Description', 'Installation date'],
  character_profiles: ['Character name', 'Class', 'Level', 'Alignment', 'Background']
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
    const { data: session } = await supabase.auth.getSession();
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please log in to sync data with your profile.",
        variant: "destructive",
      });
      return;
    }

    try {
      switch (type) {
        case 'character_profiles':
          const { error: profileError } = await supabase
            .from('character_profiles')
            .upsert(data.map(profile => ({
              ...profile,
              profile_id: session.user.id,
              updated_at: new Date().toISOString()
            })));
          
          if (profileError) throw profileError;
          break;
          
        default:
          const { error } = await supabase
            .from(type)
            .upsert(data);
          
          if (error) throw error;
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
          obj[header.toLowerCase().replace(' ', '_')] = values[index];
          return obj;
        }, {} as any);
      });

      await syncToSupabase(data);
      onDataImported(data);
      
      toast({
        title: "Import successful",
        description: `${data.length} ${type} imported successfully.`,
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
