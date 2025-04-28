
import { Shield, User, Settings, CircleUser } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { LoadingState } from "@/components/LoadingState";
import { Navigate } from "react-router-dom";

const Admin = () => {
  const { data: userRole, isLoading } = useUserRole();
  const isAdmin = userRole === 'super_admin' || userRole === 'admin';

  if (isLoading) {
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
          <p className="text-gray-400 mb-4">All systems operational</p>
          <div className="cyber-progress-bar">
            <div className="progress-fill bg-cyber-purple" style={{width: '92%'}}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Server capacity: 92%</p>
        </div>

        <div className="cyber-panel">
          <div className="flex items-center mb-4">
            <User className="text-cyber-pink mr-2" />
            <h2 className="text-xl">User Management</h2>
          </div>
          <p className="text-gray-400 mb-2">Total registered users: 42</p>
          <p className="text-gray-400 mb-2">Active sessions: 13</p>
          <button className="cyber-button-accent text-sm mt-2">View User Logs</button>
        </div>
        
        <div className="cyber-panel">
          <div className="flex items-center mb-4">
            <Settings className="text-cyber-blue mr-2" />
            <h2 className="text-xl">System Configuration</h2>
          </div>
          <p className="text-gray-400 mb-2">Last maintenance: 2025-04-25</p>
          <p className="text-gray-400 mb-2">Next scheduled backup: 2025-04-30</p>
          <button className="cyber-button text-sm mt-2">Update System</button>
        </div>
        
        <div className="cyber-panel">
          <div className="flex items-center mb-4">
            <CircleUser className="text-cyber-yellow mr-2" />
            <h2 className="text-xl">Role Management</h2>
          </div>
          <p className="text-gray-400 mb-2">Admin users: 3</p>
          <p className="text-gray-400 mb-2">Moderators: 7</p>
          <button className="cyber-button text-sm mt-2">Manage Roles</button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
