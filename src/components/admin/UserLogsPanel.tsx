
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export function UserLogsPanel() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: logs, isLoading } = useQuery({
    queryKey: ['user-logs', page],
    queryFn: async () => {
      const { data: profiles } = await supabase
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

      return profiles;
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

  return (
    <ScrollArea className="h-[300px] rounded-md border p-4">
      {logs?.map((log) => (
        <div key={log.id} className="mb-4 last:mb-0">
          <p className="text-sm text-gray-400">
            User created: {new Date(log.created_at).toLocaleDateString()}
          </p>
          {log.character_profiles?.map((profile, index) => (
            <p key={index} className="text-xs text-gray-500">
              Character: {profile.name} ({profile.class} - {profile.lifepath})
            </p>
          ))}
        </div>
      ))}
    </ScrollArea>
  );
}
