
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserSettingsPanel } from "@/components/settings/UserSettingsPanel";
import { CharacterProfilesSection } from "@/components/settings/CharacterProfilesSection";
import { DataManagementPanel } from "@/components/settings/DataManagementPanel";
import { AboutPanel } from "@/components/settings/AboutPanel";
import { AuthSection } from "@/components/auth/AuthSection";
import { useUserRole } from "@/hooks/useUserRole";
import { UserLogsPanel } from "@/components/admin/UserLogsPanel";
import { SystemUpdatePanel } from "@/components/admin/SystemUpdatePanel";
import { RoleManagementPanel } from "@/components/admin/RoleManagementPanel";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("user-settings");
  const { data: userRole } = useUserRole();
  const isAdmin = userRole === 'super_admin' || userRole === 'admin';
  
  const [settings, setSettings] = useState({
    username: "",
    autoSaveInterval: 5,
    notificationsEnabled: true,
    darkThemeVariant: "purple",
    selectedCharacterProfileId: undefined
  });

  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">
        <span className="text-cyber-yellow glow-text">Settings</span>
      </h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="cyber-panel">
          <div className="flex flex-col md:flex-row">
            <TabsList className="flex flex-col md:w-64 items-stretch bg-transparent space-y-1 p-2 h-auto">
              <TabsTrigger 
                value="user-settings" 
                className="justify-start text-left py-2 px-4 data-[state=active]:bg-cyber-purple/20 data-[state=active]:border-r-2 data-[state=active]:border-cyber-purple rounded-none"
              >
                User Settings
              </TabsTrigger>
              <TabsTrigger 
                value="access-code" 
                className="justify-start text-left py-2 px-4 data-[state=active]:bg-cyber-purple/20 data-[state=active]:border-r-2 data-[state=active]:border-cyber-purple rounded-none"
              >
                Access Code
              </TabsTrigger>
              <TabsTrigger 
                value="auth" 
                className="justify-start text-left py-2 px-4 data-[state=active]:bg-cyber-purple/20 data-[state=active]:border-r-2 data-[state=active]:border-cyber-purple rounded-none"
              >
                Authentication
              </TabsTrigger>
              <TabsTrigger 
                value="characters" 
                className="justify-start text-left py-2 px-4 data-[state=active]:bg-cyber-purple/20 data-[state=active]:border-r-2 data-[state=active]:border-cyber-purple rounded-none"
              >
                Character Profiles
              </TabsTrigger>
              <TabsTrigger 
                value="data" 
                className="justify-start text-left py-2 px-4 data-[state=active]:bg-cyber-purple/20 data-[state=active]:border-r-2 data-[state=active]:border-cyber-purple rounded-none"
              >
                Data Management
              </TabsTrigger>
              <TabsTrigger 
                value="about" 
                className="justify-start text-left py-2 px-4 data-[state=active]:bg-cyber-purple/20 data-[state=active]:border-r-2 data-[state=active]:border-cyber-purple rounded-none"
              >
                About
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger 
                  value="admin" 
                  className="justify-start text-left py-2 px-4 data-[state=active]:bg-cyber-purple/20 data-[state=active]:border-r-2 data-[state=active]:border-cyber-purple rounded-none"
                >
                  Admin Settings
                </TabsTrigger>
              )}
            </TabsList>
            
            <div className="flex-1 p-4 border-l border-cyber-purple/20">
              <TabsContent value="user-settings" className="mt-0 space-y-4">
                <UserSettingsPanel 
                  settings={settings} 
                  onSettingChange={handleSettingChange}
                />
              </TabsContent>
            
              
              <TabsContent value="auth" className="mt-0 space-y-4">
                <AuthSection />
              </TabsContent>
              
              <TabsContent value="characters" className="mt-0 space-y-4">
                <CharacterProfilesSection />
              </TabsContent>
              
              <TabsContent value="data" className="mt-0 space-y-4">
                <DataManagementPanel 
                  settings={settings}
                />
              </TabsContent>
              
              <TabsContent value="about" className="mt-0 space-y-4">
                <AboutPanel />
              </TabsContent>

              {isAdmin && (
                <TabsContent value="admin" className="mt-0 space-y-4">
                  <div className="space-y-6">
                    <div className="cyber-panel">
                      <div className="flex items-center mb-4">
                        <h2 className="text-xl">System Management</h2>
                      </div>
                      <SystemUpdatePanel />
                    </div>
                    
                    <div className="cyber-panel">
                      <div className="flex items-center mb-4">
                        <h2 className="text-xl">User Logs</h2>
                      </div>
                      <UserLogsPanel />
                    </div>
                    
                    <div className="cyber-panel">
                      <div className="flex items-center mb-4">
                        <h2 className="text-xl">Role Management</h2>
                      </div>
                      <RoleManagementPanel />
                    </div>
                  </div>
                </TabsContent>
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
