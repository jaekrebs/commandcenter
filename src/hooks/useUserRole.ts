
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUserRole() {
  return useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '')
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return roles?.role || null;
    }
  });
}
