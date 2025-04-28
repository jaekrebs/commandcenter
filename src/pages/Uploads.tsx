import { FileUploader } from "@/components/FileUploader";

export default function Uploads() {
  const handleImportData = (type: 'notes' | 'npc_relationships' | 'missions' | 'cyberware', data: any[]) => {
    const typeToKeyMap = {
      'notes': 'v-notes',
      'npc_relationships': 'v-npcs',
      'missions': 'v-missions',
      'cyberware': 'v-cyberware'
    };
    
    const storageKey = typeToKeyMap[type];
    const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Transform imported data to match local storage format
    let formattedData;
    switch(type) {
      case 'npc_relationships':
        formattedData = data.map(item => ({
          id: `npc${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: item.npc_name,
          friendship: Number(item.friendship) || 0,
          trust: Number(item.trust) || 0,
          lust: Number(item.lust) || 0,
          love: Number(item.love) || 0,
          image: item.image || "",
          background: item.background || "bg-gradient-purple"
        }));
        break;
      case 'missions':
        formattedData = data.map(item => ({
          id: `mission${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: item.name,
          type: item.type || "main",
          progress: Number(item.progress_percent) || 0,
          notes: item.notes || "",
          completed: item.completed === 'true' || item.completed === true || false
        }));
        break;
      case 'cyberware':
        formattedData = data.map(item => ({
          id: `cyber${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: item.name,
          type: item.type,
          description: item.description || "",
          status: item.status || "",
          rarity: item.rarity || "common",
          installed: item.installed === 'true' || item.installed === true || false
        }));
        break;
      case 'notes':
        formattedData = data.map(item => ({
          id: `note${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: item.title,
          content: item.content || "",
          createdAt: new Date().toISOString()
        }));
        break;
      default:
        formattedData = data;
    }
    
    const newData = [...existingData, ...formattedData];
    localStorage.setItem(storageKey, JSON.stringify(newData));
    
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">
        <span className="text-cyber-yellow glow-text">Data Uploads</span>
      </h1>

      <div className="space-y-6">
        <div className="cyber-panel">
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
              <h3 className="text-lg font-medium mb-2">Import Gear</h3>
              <FileUploader type="cyberware" onDataImported={(data) => handleImportData('cyberware', data)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
