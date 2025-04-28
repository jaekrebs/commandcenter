
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function DataSyncSection() {
  const [isSyncing, setIsSyncing] = useState(false);
  
  const syncToSupabase = async () => {
    setIsSyncing(true);
    try {
      // Get profile
      const {
        data: profileData
      } = await supabase.from('profiles').insert({}).select().single();
      if (!profileData?.id) throw new Error('Failed to create profile');

      // Get all local data
      const characterProfile = JSON.parse(localStorage.getItem("v-character-profile") || "{}");
      const relicStatus = JSON.parse(localStorage.getItem("v-relic-status") || "{}");
      const npcs = JSON.parse(localStorage.getItem("v-npcs") || "[]");
      const missions = JSON.parse(localStorage.getItem("v-missions") || "[]");
      const cyberware = JSON.parse(localStorage.getItem("v-cyberware") || "[]");
      const notes = JSON.parse(localStorage.getItem("v-notes") || "[]");

      // Sync character profile
      await supabase.from('character_profiles').insert({
        profile_id: profileData.id,
        name: characterProfile.name || 'V',
        lifepath: characterProfile.lifepath || 'Corpo',
        class: characterProfile.class || 'Netrunner',
        primary_weapons: characterProfile.primary_weapons,
        gear: characterProfile.gear
      });

      // Sync relic status
      await supabase.from('relic_status').insert({
        profile_id: profileData.id,
        relic_integrity: relicStatus.integrity || 100,
        johnny_influence: relicStatus.influence || 0
      });

      // Sync NPCs
      if (npcs.length > 0) {
        await supabase.from('npc_relationships').insert(npcs.map(npc => ({
          profile_id: profileData.id,
          name: npc.name,
          friendship: npc.friendship || 0,
          trust: npc.trust || 0,
          lust: npc.lust || 0,
          love: npc.love || 0,
          image: npc.image,
          background: npc.background
        })));
      }

      // Sync missions
      if (missions.length > 0) {
        await supabase.from('missions').insert(missions.map(mission => ({
          profile_id: profileData.id,
          name: mission.name,
          type: mission.type,
          progress: mission.progress || 0,
          notes: mission.notes,
          completed: mission.completed || false
        })));
      }

      // Sync cyberware
      if (cyberware.length > 0) {
        await supabase.from('cyberware').insert(cyberware.map(ware => ({
          profile_id: profileData.id,
          name: ware.name,
          type: ware.type,
          description: ware.description,
          status: ware.status
        })));
      }

      // Sync notes
      if (notes.length > 0) {
        await supabase.from('notes').insert(notes.map(note => ({
          profile_id: profileData.id,
          title: note.title,
          content: note.content
        })));
      }
      
      toast({
        title: "Success",
        description: "Your data has been synced to Supabase."
      });
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Error",
        description: "Failed to sync data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };
  
  return (
    <div className="cyber-panel">
      <h2 className="text-xl font-bold mb-4">Data Sync</h2>
      <p className="text-sm text-gray-300 mb-4">
        Sync your local data with the cloud database.
      </p>
      <Button 
        variant="default"
        disabled={isSyncing}
        onClick={syncToSupabase}
        className="w-full"
      >
        {isSyncing ? "Syncing..." : "Sync to Supabase"}
      </Button>
    </div>
  );
}
