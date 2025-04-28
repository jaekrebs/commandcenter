
import { useState, useEffect } from "react";
import { NPCCard, NPCRelationship } from "../components/NPCCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/LoadingState";
import { toast } from "@/hooks/use-toast";

export default function NPCRelationships() {
  // Fetch user profile to check if character is selected
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

  // Fetch NPC relationships from the database
  const { data: npcData, isLoading: isLoadingNPCs } = useQuery({
    queryKey: ["npc-relationships", userProfile?.selected_character_profile_id],
    enabled: !!userProfile?.selected_character_profile_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("npc_relationships")
        .select("*")
        .eq("character_profile_id", userProfile?.selected_character_profile_id);
      
      if (error) throw error;
      return data as NPCRelationship[];
    }
  });

  const [npcs, setNPCs] = useState<NPCRelationship[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize NPCs from database data or local storage if no data in DB yet
  useEffect(() => {
    if (npcData && npcData.length > 0) {
      setNPCs(npcData);
    } else {
      // Use local storage as fallback if no database data yet
      const savedNPCs = localStorage.getItem("v-npcs");
      if (savedNPCs) {
        // Parse and adapt the stored format if needed
        const storedNPCs = JSON.parse(savedNPCs);
        // Transform any old format data to match the new schema
        const adaptedNPCs = storedNPCs.map((npc: any) => ({
          ...npc,
          npc_name: npc.npc_name || npc.name, // Ensure we have npc_name
        }));
        setNPCs(adaptedNPCs);
      }
    }
  }, [npcData]);

  // Save changes to local storage for offline persistence
  useEffect(() => {
    if (npcs.length > 0) {
      localStorage.setItem("v-npcs", JSON.stringify(npcs));
    }
  }, [npcs]);

  const handleUpdateNPC = async (updatedNPC: NPCRelationship) => {
    // Update the local state first for optimistic UI update
    setNPCs(npcs.map((npc) => (npc.id === updatedNPC.id ? updatedNPC : npc)));

    // If we have a selected character profile, update in database
    if (userProfile?.selected_character_profile_id) {
      try {
        // Make sure NPC has character_profile_id set
        const npcToUpdate = {
          ...updatedNPC,
          character_profile_id: updatedNPC.character_profile_id || userProfile.selected_character_profile_id
        };
        
        const { error } = await supabase
          .from("npc_relationships")
          .upsert({
            id: npcToUpdate.id,
            npc_name: npcToUpdate.npc_name,
            friendship: npcToUpdate.friendship,
            trust: npcToUpdate.trust,
            lust: npcToUpdate.lust,
            love: npcToUpdate.love,
            image: npcToUpdate.image,
            background: npcToUpdate.background,
            character_profile_id: npcToUpdate.character_profile_id,
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      } catch (error) {
        console.error("Failed to update NPC relationship:", error);
        toast({
          title: "Update failed",
          description: "Failed to save relationship changes",
          variant: "destructive"
        });
      }
    }
  };

  const filteredNPCs = npcs.filter((npc) =>
    npc.npc_name ? npc.npc_name.toLowerCase().includes(searchTerm.toLowerCase()) : false
  );

  // Show loading state if still loading profile or NPCs data
  if (isLoadingProfile || isLoadingNPCs) {
    return <LoadingState message="Loading NPC relationship data..." />;
  }

  // Show character selection message if no character is selected
  if (!userProfile?.selected_character_profile_id) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <LoadingState 
          message="NPC relationship data unavailable" 
          type="character-required"
          showRedirect={true}
        />
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-white">
          NPC <span className="text-cyber-purple glow-text">Relationships</span>
        </h1>
        
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search NPCs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
          />
        </div>
      </div>

      <div className="cyber-panel mb-6">
        <p className="text-gray-300">
          Track your relationships with key characters in Night City. Adjust ratings for friendship, trust, lust, and love as your interactions evolve.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNPCs.length > 0 ? (
          filteredNPCs.map((npc) => (
            <NPCCard 
              key={npc.id} 
              npc={npc} 
              onUpdate={handleUpdateNPC} 
            />
          ))
        ) : (
          <div className="col-span-full py-10 text-center">
            <p className="text-gray-400 mb-4">No NPC relationships found.</p>
            <p className="text-gray-500">Build connections in Night City to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
