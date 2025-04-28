
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RoleManagementPanel() {
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users-roles'],
    queryFn: async () => {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('*, profiles:id(*)');
      return roles;
    }
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'admin' | 'user' }) => {
      const { error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-roles'] });
      toast({
        title: "Role Updated",
        description: "User role has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    }
  });

  return (
    <ScrollArea className="h-[300px] rounded-md border p-4">
      {users?.map((userRole) => (
        <div key={userRole.id} className="flex items-center justify-between mb-4 last:mb-0">
          <div>
            <p className="text-sm">{userRole.user_id}</p>
            <p className="text-xs text-gray-400">Current role: {userRole.role}</p>
          </div>
          <Select
            value={userRole.role}
            onValueChange={(newRole: 'admin' | 'user') => {
              updateRole.mutate({ userId: userRole.user_id, role: newRole });
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
    </ScrollArea>
  );
}
