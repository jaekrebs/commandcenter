
import { useState } from "react";
import { LoadingState } from "@/components/LoadingState";
import { useNotes, Note } from "@/hooks/useNotes";
import { NoteSidebar } from "@/components/notes/NoteSidebar";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { NoteViewer } from "@/components/notes/NoteViewer";

export default function Notes() {
  const { notes, isLoading, addNote, updateNote, deleteNote, hasCharacter } = useNotes();
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Set the first note as active when notes load or change
  useState(() => {
    if (notes.length > 0 && !activeNote) {
      setActiveNote(notes[0]);
    }
  });

  const handleNoteClick = (note: Note) => {
    setActiveNote(note);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    if (activeNote) {
      setEditingNote({ ...activeNote });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (editingNote) {
      updateNote(editingNote);
      setActiveNote(editingNote);
      setIsEditing(false);
    }
  };

  // Show loading state while fetching notes
  if (isLoading) {
    return <LoadingState message="Loading notes data..." />;
  }

  // Show character selection message if no character is selected
  if (!hasCharacter) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <LoadingState 
          message="Notes data unavailable" 
          type="character-required"
          showRedirect={true}
        />
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">
        Personal <span className="text-cyber-blue glow-text">Notes</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <NoteSidebar
            notes={notes}
            activeNote={activeNote}
            onNoteClick={handleNoteClick}
            onDeleteNote={deleteNote}
            onAddNote={addNote}
          />
        </div>

        <div className="md:col-span-2">
          <div className="cyber-panel h-full">
            {!activeNote ? (
              <div className="flex flex-col items-center justify-center h-full py-20">
                <p className="text-gray-400 mb-4">
                  Select a note or create a new one
                </p>
              </div>
            ) : isEditing && editingNote ? (
              <NoteEditor
                note={editingNote}
                onSave={handleSaveEdit}
                onCancel={() => setIsEditing(false)}
                onChange={setEditingNote}
              />
            ) : (
              <NoteViewer 
                note={activeNote} 
                onEdit={handleEditClick} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
