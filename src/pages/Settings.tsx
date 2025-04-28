
import { useState } from "react";
import { CharacterProfilesSection } from "@/components/settings/CharacterProfilesSection";
import { UserSettingsPanel } from "@/components/settings/UserSettingsPanel";
import { DataManagementPanel } from "@/components/settings/DataManagementPanel";
import { AboutPanel } from "@/components/settings/AboutPanel";
import { AuthSection } from "@/components/auth/AuthSection";
import { AccessCodeSection } from "@/components/auth/AccessCodeSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("user-settings");
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="cyber-panel">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="flex flex-col items-stretch border-r border-cyber-purple/20 w-full rounded-none bg-transparent space-y-1">
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
              </TabsList>
              
              <div className="flex-1 p-4">
                <TabsContent value="user-settings" className="mt-0">
                  <UserSettingsPanel 
                    settings={settings} 
                    onSettingChange={handleSettingChange}
                  />
                </TabsContent>
                <TabsContent value="access-code" className="mt-0">
                  <AccessCodeSection />
                </TabsContent>
                <TabsContent value="auth" className="mt-0">
                  <AuthSection />
                </TabsContent>
                <TabsContent value="characters" className="mt-0">
                  <CharacterProfilesSection />
                </TabsContent>
                <TabsContent value="data" className="mt-0">
                  <DataManagementPanel 
                    settings={settings}
                  />
                </TabsContent>
                <TabsContent value="about" className="mt-0">
                  <AboutPanel />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* This section is now redundant since we're using TabsContent */}
        </div>
      </div>
    </div>
  );
}
