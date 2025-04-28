
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

// Define the type for user role data
type UserRoleWithProfile = {
  id: string;
  user_id: string;
  role: 'admin' | 'user' | 'super_admin';
  profiles?: {
    email: string;
  } | null;
  created_at?: string | null;
};

export function RoleManagementPanel() {
  const queryClient = useQueryClient();

  const { data: users, isLoading: isLoadingUsers, error } = useQuery({
    queryKey: ['users-roles'],
    queryFn: async () => {
      try {
        // We need to fetch the email from the auth.users table through a secure RPC or function
        // since we can't directly join between user_roles and auth.users
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('*');
        
        if (error) throw error;
        
        // For each user role, get the user email from auth.users via the user_id
        const rolesWithProfiles = await Promise.all(
          roles.map(async (role) => {
            const { data: userData, error: userError } = await supabase
              .rpc('get_user_by_access_code', { 
                access_code: '' // This is just a placeholder, we're using it as a way to get user emails
              });
            
            // Get the access code for this user to find their email
            const { data: accessCode } = await supabase
              .from('access_codes')
              .select('code')
              .eq('user_id', role.user_id)
              .single();
              
            // Try to get the email using the access code if we have one
            let email = '';
            if (accessCode?.code) {
              const { data: userWithEmail } = await supabase
                .rpc('get_user_by_access_code', { 
                  access_code: accessCode.code 
                });
              if (userWithEmail && userWithEmail.length > 0) {
                email = userWithEmail[0].email;
              }
            }

            // Return the role with the email information added
            return {
              ...role,
              profiles: {
                email: email || role.user_id // Fallback to user_id if email not found
              }
            };
          })
        );

        console.log("User roles data with profiles:", rolesWithProfiles);
        return rolesWithProfiles as UserRoleWithProfile[];
      } catch (err) {
        console.error("Error fetching user roles:", err);
        throw err;
      }
    }
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'admin' | 'user' | 'super_admin' }) => {
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
              {userRole.profiles?.email || userRole.user_id}
            </p>
            <p className="text-xs text-gray-400">Current role: {userRole.role}</p>
          </div>
          <Select
            value={userRole.role}
            onValueChange={(newRole: 'admin' | 'user' | 'super_admin') => {
              updateRole.mutate({ userId: userRole.user_id, role: newRole });
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
    </ScrollArea>
  );
}
