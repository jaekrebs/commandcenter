
import { Note } from "@/hooks/useNotes";
import { formatDate } from "@/lib/utils";

interface NoteEditorProps {
  note: Note;
  onSave: () => void;
  onCancel: () => void;
  onChange: (note: Note) => void;
}

export function NoteEditor({ note, onSave, onCancel, onChange }: NoteEditorProps) {
  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={note.title}
          onChange={(e) =>
            onChange({
              ...note,
              title: e.target.value,
            })
          }
          className="bg-cyber-black border border-cyber-purple/30 text-white text-lg font-bold rounded px-3 py-2 w-full mb-2 focus:outline-none focus:ring-1 focus:ring-cyber-purple"
        />
        <div className="text-sm text-gray-400">
          {formatDate(note.created_at)}
        </div>
      </div>
      <textarea
        value={note.content}
        onChange={(e) =>
          onChange({
            ...note,
            content: e.target.value,
          })
        }
        className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full h-64 focus:outline-none focus:ring-1 focus:ring-cyber-purple"
      />
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onCancel}
          className="cyber-button text-sm"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="cyber-button-accent text-sm"
        >
          Save
        </button>
      </div>
    </div>
  );
}
