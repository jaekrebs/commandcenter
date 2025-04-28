
import { Upload } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { useFileUpload } from '@/hooks/useFileUpload';
import { RequiredHeaders } from './upload/RequiredHeaders';

type FileType = 'notes' | 'npc_relationships' | 'missions' | 'cyberware' | 'character_profiles';

interface FileUploaderProps {
  type: FileType;
  onDataImported: (data: any[]) => void;
}

export function FileUploader({ type, onDataImported }: FileUploaderProps) {
  const { isDragging, setIsDragging, handleFile, HEADER_MAPPINGS } = useFileUpload(type, onDataImported);

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
        <RequiredHeaders headers={HEADER_MAPPINGS[type]} />
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
