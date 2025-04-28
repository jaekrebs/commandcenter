import { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash, X, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/LoadingState";

type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem("v-notes");
    return savedNotes
      ? JSON.parse(savedNotes)
      : [
          {
            id: "note1",
            title: "First meeting with Judy",
            content:
              "Met Judy Alvarez at Lizzie's Bar. She's a BD editor, seems pretty skilled. Not the friendliest, but given the circumstances, can't blame her. Might be a valuable contact.",
            createdAt: new Date().toISOString(),
          },
          {
            id: "note2",
            title: "Relic symptoms",
            content:
              "Symptoms getting worse. More frequent blackouts, headaches. Johnny appearing more often. Need to find a solution fast.",
            createdAt: new Date().toISOString(),
          },
        ];
  });

  const [activeNote, setActiveNote] = useState<Note | null>(notes[0] || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState<Omit<Note, "id" | "createdAt">>({
    title: "",
    content: "",
  });

  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("selected_character_profile_id")
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    localStorage.setItem("v-notes", JSON.stringify(notes));
  }, [notes]);

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
      setNotes(
        notes.map((note) => (note.id === editingNote.id ? editingNote : note))
      );
      setActiveNote(editingNote);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleAddNote = () => {
    if (newNote.title.trim()) {
      const id = `note${Date.now()}`;
      const note = {
        id,
        ...newNote,
        createdAt: new Date().toISOString(),
      };
      const updatedNotes = [...notes, note];
      setNotes(updatedNotes);
      setActiveNote(note);
      setNewNote({ title: "", content: "" });
      setIsAddingNote(false);
    }
  };

  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    if (activeNote?.id === id) {
      setActiveNote(updatedNotes[0] || null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoadingProfile) {
    return <LoadingState message="Loading notes data..." />;
  }

  if (!userProfile?.selected_character_profile_id) {
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
                  onChange={(e) =>
                    setNewNote({ ...newNote, title: e.target.value })
                  }
                  className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full mb-2 focus:outline-none focus:ring-1 focus:ring-cyber-purple"
                />
                <textarea
                  placeholder="Note content"
                  value={newNote.content}
                  onChange={(e) =>
                    setNewNote({ ...newNote, content: e.target.value })
                  }
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
                    onClick={() => handleNoteClick(note)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-white">{note.title}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
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
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="cyber-panel h-full">
            {!activeNote ? (
              <div className="flex flex-col items-center justify-center h-full py-20">
                <p className="text-gray-400 mb-4">
                  Select a note or create a new one
                </p>
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="cyber-button flex items-center gap-2"
                >
                  <PlusCircle size={16} />
                  <span>New Note</span>
                </button>
              </div>
            ) : isEditing && editingNote ? (
              <div>
                <div className="mb-4">
                  <input
                    type="text"
                    value={editingNote.title}
                    onChange={(e) =>
                      setEditingNote({
                        ...editingNote,
                        title: e.target.value,
                      })
                    }
                    className="bg-cyber-black border border-cyber-purple/30 text-white text-lg font-bold rounded px-3 py-2 w-full mb-2 focus:outline-none focus:ring-1 focus:ring-cyber-purple"
                  />
                  <div className="text-sm text-gray-400">
                    {formatDate(editingNote.createdAt)}
                  </div>
                </div>
                <textarea
                  value={editingNote.content}
                  onChange={(e) =>
                    setEditingNote({
                      ...editingNote,
                      content: e.target.value,
                    })
                  }
                  className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full h-64 focus:outline-none focus:ring-1 focus:ring-cyber-purple"
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={handleCancelEdit}
                    className="cyber-button text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="cyber-button-accent text-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {activeNote.title}
                    </h2>
                    <div className="text-sm text-gray-400">
                      {formatDate(activeNote.createdAt)}
                    </div>
                  </div>
                  <button
                    onClick={handleEditClick}
                    className="text-cyber-blue hover:text-cyber-purple transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-gray-300">
                    {activeNote.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
