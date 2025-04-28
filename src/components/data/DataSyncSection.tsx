
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export function DataSyncSection() {
  const [isSyncing, setIsSyncing] = useState(false);
  
  const syncToSupabase = async () => {
    setIsSyncing(true);
    try {
      // Get user's selected character profile id
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Not authenticated');
      
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('selected_character_profile_id')
        .eq('id', session.user.id)
        .single();
        
      if (!userProfile?.selected_character_profile_id) {
        throw new Error('No character profile selected. Please select a profile in settings first.');
      }
      
      const characterProfileId = userProfile.selected_character_profile_id;

      // Get all local data
      const characterProfile = JSON.parse(localStorage.getItem("v-character-profile") || "{}");
      const relicStatus = JSON.parse(localStorage.getItem("v-relic-status") || "{}");
      const npcs = JSON.parse(localStorage.getItem("v-npcs") || "[]");
      const missions = JSON.parse(localStorage.getItem("v-missions") || "[]");
      const cyberware = JSON.parse(localStorage.getItem("v-cyberware") || "[]");
      const notes = JSON.parse(localStorage.getItem("v-notes") || "[]");

      // Update character profile
      await supabase.from('character_profiles').update({
        name: characterProfile.name || 'V',
        lifepath: characterProfile.lifepath || 'Corpo',
        class: characterProfile.class || 'Netrunner',
        primary_weapons: characterProfile.primaryWeapons,
        gear: characterProfile.gear
      }).eq('id', characterProfileId);

      // Sync relic status
      await supabase.from('relic_status').upsert({
        profile_id: session.user.id, // This still references the user profile directly
        relic_integrity: relicStatus.integrity || 100,
        johnny_influence: relicStatus.influence || 0
      });

      // Sync NPCs
      if (npcs.length > 0) {
        await supabase.from('npc_relationships').upsert(npcs.map(npc => ({
          character_profile_id: characterProfileId,
          npc_name: npc.name,
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
        await supabase.from('missions').upsert(missions.map(mission => ({
          character_profile_id: characterProfileId,
          name: mission.name,
          type: mission.type,
          progress_percent: mission.progress,
          notes: mission.notes,
          completed: mission.completed || false
        })));
      }

      // Sync cyberware
      if (cyberware.length > 0) {
        await supabase.from('cyberware').upsert(cyberware.map(ware => ({
          character_profile_id: characterProfileId,
          name: ware.name,
          type: ware.type,
          description: ware.description,
          status: ware.status
        })));
      }

      // Sync notes
      if (notes.length > 0) {
        await supabase.from('notes').upsert(notes.map(note => ({
          character_profile_id: characterProfileId,
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
        description: error instanceof Error ? error.message : "Failed to sync data. Please try again.",
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
