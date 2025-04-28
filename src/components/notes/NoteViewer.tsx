
import { Edit } from "lucide-react";
import { Note } from "@/hooks/useNotes";
import { formatDate } from "@/lib/utils";

interface NoteViewerProps {
  note: Note;
  onEdit: () => void;
}

export function NoteViewer({ note, onEdit }: NoteViewerProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">
            {note.title}
          </h2>
          <div className="text-sm text-gray-400">
            {formatDate(note.created_at)}
          </div>
        </div>
        <button
          onClick={onEdit}
          className="text-cyber-blue hover:text-cyber-purple transition-colors"
        >
          <Edit size={18} />
        </button>
      </div>
      <div className="prose prose-invert max-w-none">
        <p className="whitespace-pre-wrap text-gray-300">
          {note.content}
        </p>
      </div>
    </div>
  );
}
