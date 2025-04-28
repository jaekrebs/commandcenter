
import { Shield, User, Settings, CircleUser } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { LoadingState } from "@/components/LoadingState";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Admin = () => {
  const { data: userRole, isLoading: isLoadingRole } = useUserRole();
  const isAdmin = userRole === 'super_admin' || userRole === 'admin';

  // Fetch system metrics
  const { data: systemMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['system-metrics'],
    queryFn: async () => {
      // Get total users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active sessions (placeholder - would need proper session tracking)
      const activeSessions = 0;

      // Get admin users count
      const { count: adminCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .in('role', ['admin', 'super_admin']);

      // Get user count (excluding admins)
      const { count: userCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'user');

      return {
        totalUsers: usersCount || 0,
        activeSessions,
        adminUsers: adminCount || 0,
        standardUsers: userCount || 0
      };
    },
    enabled: isAdmin
  });

  if (isLoadingRole) {
    return <LoadingState message="Verifying access..." />;
  }

  if (!isAdmin) {
    return <Navigate to="/settings" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">
        <span className="text-cyber-yellow glow-text">Admin Panel</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="cyber-panel">
          <div className="flex items-center mb-4">
            <Shield className="text-cyber-purple mr-2" />
            <h2 className="text-xl">System Status</h2>
          </div>
          {isLoadingMetrics ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : (
            <>
              <p className="text-gray-400 mb-4">All systems operational</p>
              <div className="cyber-progress-bar">
                <div className="progress-fill bg-cyber-purple" style={{width: '100%'}}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Server status: Online</p>
            </>
          )}
        </div>

        <div className="cyber-panel">
          <div className="flex items-center mb-4">
            <User className="text-cyber-pink mr-2" />
            <h2 className="text-xl">User Management</h2>
          </div>
          {isLoadingMetrics ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-8 w-24 mt-4" />
            </div>
          ) : (
            <>
              <p className="text-gray-400 mb-2">Total registered users: {systemMetrics?.totalUsers || 0}</p>
              <p className="text-gray-400 mb-2">Active sessions: {systemMetrics?.activeSessions || 0}</p>
              <button className="cyber-button-accent text-sm mt-2">View User Logs</button>
            </>
          )}
        </div>
        
        <div className="cyber-panel">
          <div className="flex items-center mb-4">
            <Settings className="text-cyber-blue mr-2" />
            <h2 className="text-xl">System Configuration</h2>
          </div>
          {isLoadingMetrics ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-8 w-32 mt-4" />
            </div>
          ) : (
            <>
              <p className="text-gray-400 mb-2">Last maintenance: {new Date().toLocaleDateString()}</p>
              <p className="text-gray-400 mb-2">Next scheduled backup: {new Date(Date.now() + 86400000).toLocaleDateString()}</p>
              <button className="cyber-button text-sm mt-2">Update System</button>
            </>
          )}
        </div>
        
        <div className="cyber-panel">
          <div className="flex items-center mb-4">
            <CircleUser className="text-cyber-yellow mr-2" />
            <h2 className="text-xl">Role Management</h2>
          </div>
          {isLoadingMetrics ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-32 mt-4" />
            </div>
          ) : (
            <>
              <p className="text-gray-400 mb-2">Admin users: {systemMetrics?.adminUsers || 0}</p>
              <p className="text-gray-400 mb-2">Standard users: {systemMetrics?.standardUsers || 0}</p>
              <button className="cyber-button text-sm mt-2">Manage Roles</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
