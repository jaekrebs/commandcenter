
import { useState } from "react";
import { PlusCircle, Trash } from "lucide-react";
import { Note } from "@/hooks/useNotes";
import { formatDate } from "@/lib/utils";

interface NoteSidebarProps {
  notes: Note[];
  activeNote: Note | null;
  onNoteClick: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onAddNote: (note: Omit<Note, "id" | "created_at" | "updated_at">) => void;
}

export function NoteSidebar({
  notes,
  activeNote,
  onNoteClick,
  onDeleteNote,
  onAddNote,
}: NoteSidebarProps) {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState<Omit<Note, "id" | "created_at" | "updated_at">>({
    title: "",
    content: "",
  });

  const handleAddNote = () => {
    if (newNote.title.trim()) {
      onAddNote(newNote);
      setNewNote({ title: "", content: "" });
      setIsAddingNote(false);
    }
  };

  return (
    <div className="cyber-panel">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Notes</h2>
        <button
          onClick={() => setIsAddingNote(true)}
          className="text-cyber-blue hover:text-cyber-purple transition-colors"
          disabled={isAddingNote}
        >
          <PlusCircle size={20} />
        </button>
      </div>

      {isAddingNote && (
        <div className="mb-4 border-b border-cyber-purple/20 pb-4">
          <input
            type="text"
            placeholder="Note title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full mb-2 focus:outline-none focus:ring-1 focus:ring-cyber-purple"
          />
          <textarea
            placeholder="Note content"
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full h-20 mb-2 focus:outline-none focus:ring-1 focus:ring-cyber-purple"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAddingNote(false)}
              className="cyber-button text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNote}
              className="cyber-button-accent text-xs"
              disabled={!newNote.title.trim()}
            >
              Add Note
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-none">
        {notes.length === 0 ? (
          <p className="text-gray-400 text-center py-4">
            No notes yet. Create your first note.
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 rounded cursor-pointer transition-all hover:bg-cyber-purple/10 ${
                activeNote?.id === note.id
                  ? "border border-cyber-purple/50 bg-cyber-purple/10"
                  : "border border-cyber-darkgray"
              }`}
              onClick={() => onNoteClick(note)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-white">{note.title}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id);
                  }}
                  className="text-gray-500 hover:text-cyber-red transition-colors"
                >
                  <Trash size={14} />
                </button>
              </div>
              <p className="text-gray-400 text-sm line-clamp-2 mt-1">
                {note.content}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                {formatDate(note.created_at)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
