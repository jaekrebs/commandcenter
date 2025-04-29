// src/components/settings/CharacterProfilesSection.tsx
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useCharacterProfiles } from "@/hooks/useCharacterProfiles";

export function CharacterProfilesSection() {
  const [newName, setNewName] = useState("");
  const queryClient = useQueryClient();

  const { data: profiles = [], isLoading } = useCharacterProfiles();
  const selected = profiles.find((p) => p.is_selected) ?? null;

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc("select_or_create_profile", {
        profile_name: newName.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Profile created & selected" });
      setNewName("");
      queryClient.invalidateQueries({ queryKey: ["characterProfiles"] });
    },
    onError: (err: any) =>
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      }),
  });

  return (
    <div className="cyber-panel">
      <h2 className="text-xl font-bold mb-4">Character Profiles</h2>

      {/* create input */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Enter name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button
          onClick={() => createMutation.mutate()}
          disabled={!newName.trim() || createMutation.isPending}
        >
          {createMutation.isPending ? "Creating…" : "Create & Select"}
        </Button>
      </div>

      {/* current selection */}
      {isLoading ? (
        <p>Loading profiles…</p>
      ) : selected ? (
        <div className="p-4 bg-background/5 rounded-md">
          <h3 className="font-medium">{selected.name}</h3>
          <p className="text-sm text-gray-400">
            {selected.class} — {selected.lifepath}
          </p>
        </div>
      ) : (
        <p>No character selected</p>
      )}
    </div>
  );
}
