
import { useState, useEffect } from "react";
import { NPCCard, NPCRelationship } from "../components/NPCCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/LoadingState";

const defaultNPCs: NPCRelationship[] = [
  {
    id: "npc1",
    name: "Judy Alvarez",
    friendship: 7,
    trust: 6,
    lust: 5,
    love: 4,
    image: "https://i.imgur.com/1234.jpg", // Placeholder
    background: "bg-gradient-purple",
  },
  {
    id: "npc2",
    name: "Panam Palmer",
    friendship: 8,
    trust: 7,
    lust: 6,
    love: 5,
    image: "https://i.imgur.com/5678.jpg", // Placeholder
    background: "bg-gradient-blue",
  },
  {
    id: "npc3",
    name: "River Ward",
    friendship: 5,
    trust: 4,
    lust: 3,
    love: 2,
    image: "https://i.imgur.com/9101.jpg", // Placeholder
    background: "bg-gradient-yellow",
  },
  {
    id: "npc4",
    name: "Kerry Eurodyne",
    friendship: 4,
    trust: 3,
    lust: 2,
    love: 1,
    image: "https://i.imgur.com/1213.jpg", // Placeholder
    background: "bg-gradient-pink",
  },
  {
    id: "npc5",
    name: "Goro Takemura",
    friendship: 6,
    trust: 5,
    lust: 0,
    love: 0,
    image: "https://i.imgur.com/1415.jpg", // Placeholder
    background: "bg-gradient-purple",
  },
  {
    id: "npc6",
    name: "Misty Olszewski",
    friendship: 7,
    trust: 8,
    lust: 0,
    love: 0,
    image: "https://i.imgur.com/1617.jpg", // Placeholder
    background: "bg-gradient-blue",
  },
];

export default function NPCRelationships() {
  const [npcs, setNPCs] = useState<NPCRelationship[]>(() => {
    const savedNPCs = localStorage.getItem("v-npcs");
    return savedNPCs ? JSON.parse(savedNPCs) : defaultNPCs;
  });

  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    localStorage.setItem("v-npcs", JSON.stringify(npcs));
  }, [npcs]);

  const handleUpdateNPC = (updatedNPC: NPCRelationship) => {
    setNPCs(
      npcs.map((npc) => (npc.id === updatedNPC.id ? updatedNPC : npc))
    );
  };

  const filteredNPCs = npcs.filter((npc) =>
    npc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state if still loading profile data
  if (isLoadingProfile) {
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
        {filteredNPCs.map((npc) => (
          <NPCCard key={npc.id} npc={npc} onUpdate={handleUpdateNPC} />
        ))}
      </div>
    </div>
  );
}
