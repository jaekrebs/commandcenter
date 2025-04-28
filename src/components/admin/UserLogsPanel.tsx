
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function UserLogsPanel() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['user-logs', page],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          created_at,
          character_profiles (
            name,
            class,
            lifepath
          )
        `)
        .range((page - 1) * limit, page * limit)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching user logs:", error);
        throw error;
      }

      console.log("User logs raw data:", profiles);
      return profiles || [];
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load user logs. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>
          No user logs found. New user activities will appear here.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ScrollArea className="h-[300px] rounded-md border p-4">
      {logs.map((log) => (
        <div key={log.id} className="mb-4 last:mb-0">
          <p className="text-sm text-gray-400">
            User created: {new Date(log.created_at).toLocaleDateString()}
          </p>
          {log.character_profiles && renderCharacterProfiles(log.character_profiles)}
          {!log.character_profiles && (
            <p className="text-xs text-gray-500">No character profiles created yet</p>
          )}
        </div>
      ))}
    </ScrollArea>
  );
}

// Helper function to render character profiles regardless of response format
function renderCharacterProfiles(profiles: any) {
  if (!profiles) return null;
  
  if (Array.isArray(profiles)) {
    if (profiles.length === 0) {
      return <p className="text-xs text-gray-500">No character profiles created yet</p>;
    }
    
    return profiles.map((profile, index) => (
      <p key={index} className="text-xs text-gray-500">
        Character: {profile.name || 'Unnamed'} ({profile.class || 'No class'} - {profile.lifepath || 'No lifepath'})
      </p>
    ));
  } 
  
  // Handle single object case
  return (
    <p className="text-xs text-gray-500">
      Character: {profiles.name || 'Unnamed'} ({profiles.class || 'No class'} - {profiles.lifepath || 'No lifepath'})
    </p>
  );
}
