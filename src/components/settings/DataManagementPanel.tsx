
import { toast } from "@/components/ui/use-toast";
import { FileUploader } from "../FileUploader";

type SettingsData = {
  username: string;
  autoSaveInterval: number;
  notificationsEnabled: boolean;
  darkThemeVariant: string;
};

interface DataManagementPanelProps {
  settings: SettingsData;
}

export function DataManagementPanel({ settings }: DataManagementPanelProps) {
  const handleExportData = () => {
    const exportData = {
      profile: JSON.parse(localStorage.getItem("v-character-profile") || "{}"),
      relicStatus: JSON.parse(localStorage.getItem("v-relic-status") || "{}"),
      npcs: JSON.parse(localStorage.getItem("v-npcs") || "[]"),
      missions: JSON.parse(localStorage.getItem("v-missions") || "[]"),
      cyberware: JSON.parse(localStorage.getItem("v-cyberware") || "[]"),
      notes: JSON.parse(localStorage.getItem("v-notes") || "[]"),
      settings: settings,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `v-dashboard-backup-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Data exported",
      description: "Your data has been exported successfully.",
    });
  };

  const handleClearLocalData = () => {
    if (confirm("Are you sure you want to clear all local data? This cannot be undone!")) {
      localStorage.removeItem("v-character-profile");
      localStorage.removeItem("v-relic-status");
      localStorage.removeItem("v-npcs");
      localStorage.removeItem("v-missions");
      localStorage.removeItem("v-cyberware");
      localStorage.removeItem("v-notes");
      
      toast({
        title: "Data cleared",
        description: "All local data has been removed. Refresh to start fresh.",
        variant: "destructive",
      });
    }
  };

  const handleImportData = (type: 'notes' | 'npc_relationships' | 'missions' | 'cyberware', data: any[]) => {
    const storageKey = `v-${type}`;
    const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const newData = [...existingData, ...data];
    localStorage.setItem(storageKey, JSON.stringify(newData));
    
    toast({
      title: `${type} imported`,
      description: `Successfully imported ${data.length} ${type}.`,
    });
  };

  return (
    <>
      <div className="cyber-panel">
        <h2 className="text-xl font-bold mb-4">Data Management</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Export Data</h3>
            <p className="text-sm text-gray-300 mb-3">
              Export all your character data, including profile, NPCs, missions, cyberware, and notes to a JSON file.
            </p>
            <button onClick={handleExportData} className="cyber-button text-sm">
              Export to JSON
            </button>
          </div>
          
          <div className="pt-3 border-t border-cyber-purple/20">
            <h3 className="text-lg font-medium mb-2">Clear Local Data</h3>
            <p className="text-sm text-cyber-red mb-3">
              Warning: This will permanently delete all locally stored data. Make sure to export your data first!
            </p>
            <button onClick={handleClearLocalData} className="text-sm border border-cyber-red text-cyber-red px-4 py-2 rounded hover:bg-cyber-red/10">
              Clear All Data
            </button>
          </div>
        </div>
      </div>

      <div className="cyber-panel mt-6">
        <h2 className="text-xl font-bold mb-4">Import Data</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Import Notes</h3>
            <FileUploader type="notes" onDataImported={(data) => handleImportData('notes', data)} />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Import NPCs</h3>
            <FileUploader type="npc_relationships" onDataImported={(data) => handleImportData('npc_relationships', data)} />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Import Missions</h3>
            <FileUploader type="missions" onDataImported={(data) => handleImportData('missions', data)} />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Import Cyberware</h3>
            <FileUploader type="cyberware" onDataImported={(data) => handleImportData('cyberware', data)} />
          </div>
        </div>
      </div>
    </>
  );
}
