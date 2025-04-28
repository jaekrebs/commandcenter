
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function RoleManagementPanel() {
  const queryClient = useQueryClient();

  const { data: users, isLoading: isLoadingUsers, error } = useQuery({
    queryKey: ['users-roles'],
    queryFn: async () => {
      try {
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('*, profiles:user_id(email)');
        
        if (error) throw error;
        console.log("User roles data:", roles);
        return roles || [];
      } catch (err) {
        console.error("Error fetching user roles:", err);
        throw err;
      }
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

  if (isLoadingUsers) {
    return <p className="text-sm text-gray-400">Loading user roles...</p>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load user roles. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No User Roles</AlertTitle>
        <AlertDescription>
          No user roles have been defined yet. User roles will appear here when users are assigned roles.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ScrollArea className="h-[300px] rounded-md border p-4">
      {users.map((userRole) => (
        <div key={userRole.id} className="flex items-center justify-between mb-4 last:mb-0">
          <div>
            <p className="text-sm">
              {userRole.profiles && 
               typeof userRole.profiles === 'object' && 
               userRole.profiles !== null && 
               'email' in userRole.profiles && 
               userRole.profiles.email 
                ? userRole.profiles.email 
                : userRole.user_id}
            </p>
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
