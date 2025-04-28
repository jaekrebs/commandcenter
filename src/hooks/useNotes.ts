
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  character_profile_id?: string;
};

export function useNotes() {
  const queryClient = useQueryClient();

  const { data: userProfile } = useQuery({
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

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes", userProfile?.selected_character_profile_id],
    enabled: !!userProfile?.selected_character_profile_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("character_profile_id", userProfile?.selected_character_profile_id);
      
      if (error) throw error;
      return data as Note[];
    }
  });

  const addNote = useMutation({
    mutationFn: async (newNote: Omit<Note, "id" | "created_at" | "updated_at">) => {
      if (!userProfile?.selected_character_profile_id) {
        throw new Error("No character profile selected");
      }

      const { data, error } = await supabase
        .from("notes")
        .insert({
          ...newNote,
          character_profile_id: userProfile.selected_character_profile_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", userProfile?.selected_character_profile_id] });
      toast({
        title: "Success",
        description: "Note added successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add note",
        variant: "destructive"
      });
    }
  });

  const updateNote = useMutation({
    mutationFn: async (note: Note) => {
      const { error } = await supabase
        .from("notes")
        .update({
          title: note.title,
          content: note.content,
          updated_at: new Date().toISOString()
        })
        .eq("id", note.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", userProfile?.selected_character_profile_id] });
      toast({
        title: "Success",
        description: "Note updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update note",
        variant: "destructive"
      });
    }
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", userProfile?.selected_character_profile_id] });
      toast({
        title: "Success",
        description: "Note deleted successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete note",
        variant: "destructive"
      });
    }
  });

  return {
    notes,
    isLoading,
    addNote: addNote.mutate,
    updateNote: updateNote.mutate,
    deleteNote: deleteNote.mutate,
    hasCharacter: !!userProfile?.selected_character_profile_id
  };
}
