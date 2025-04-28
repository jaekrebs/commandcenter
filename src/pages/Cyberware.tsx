import { useState } from "react";
import { Edit, X, Check } from "lucide-react";
import { useCyberware, CyberwareItem } from "@/hooks/useCyberware";
import { LoadingState } from "@/components/LoadingState";
export default function Cyberware() {
  const {
    cyberware,
    isLoading,
    addCyberware,
    updateCyberware,
    deleteCyberware
  } = useCyberware();
  const [isAdding, setIsAdding] = useState(false);
  const [newCyberware, setNewCyberware] = useState<Omit<CyberwareItem, "id">>({
    name: "",
    type: "",
    description: "",
    rarity: "common",
    installed: false
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CyberwareItem | null>(null);
  if (isLoading) {
    return <LoadingState message="Loading cyberware..." />;
  }
  const handleAdd = () => {
    if (newCyberware.name && newCyberware.type) {
      addCyberware(newCyberware);
      setNewCyberware({
        name: "",
        type: "",
        description: "",
        rarity: "common",
        installed: false
      });
      setIsAdding(false);
    }
  };
  const handleUpdate = () => {
    if (editForm) {
      updateCyberware(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };
  const handleToggleInstalled = (id: string) => {
    const item = cyberware.find(c => c.id === id);
    if (item) {
      updateCyberware({
        ...item,
        installed: !item.installed
      });
    }
  };
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-white";
      case "uncommon":
        return "text-green-400";
      case "rare":
        return "text-cyber-blue";
      case "epic":
        return "text-cyber-purple";
      case "legendary":
        return "text-cyber-yellow";
      default:
        return "text-white";
    }
  };
  const installedCount = cyberware.filter(item => item.installed).length;
  const totalCount = cyberware.length;
  return <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-white">
          <span className="text-cyber-pink glow-text">Cyberware</span> Loadout
        </h1>
        <button onClick={() => setIsAdding(true)} className="cyber-button flex items-center gap-2">
          <span>Add Cyberware</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="cyber-panel">
          <h3 className="font-bold text-lg mb-2">Installed Cyberware</h3>
          <div className="cyber-progress-bar">
            <div className="progress-fill bg-cyber-pink" style={{
            width: `${installedCount / Math.max(totalCount, 1) * 100}%`
          }}></div>
          </div>
          <div className="flex justify-between mt-1 text-sm">
            <span>{installedCount} installed</span>
            <span>{totalCount} total</span>
          </div>
        </div>

        <div className="cyber-panel">
          <h3 className="font-bold text-lg mb-2">Rarity Breakdown</h3>
          <div className="space-y-1">
            {(["common", "uncommon", "rare", "epic", "legendary"] as const).map(rarity => {
            const count = cyberware.filter(item => item.rarity === rarity).length;
            return <div key={rarity} className="flex justify-between">
                    <span className={`${getRarityColor(rarity)} capitalize`}>
                      {rarity}
                    </span>
                    <span>{count}</span>
                  </div>;
          })}
          </div>
        </div>

        
      </div>

      {isAdding && <div className="cyber-panel mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Cyberware</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple" value={newCyberware.name} onChange={e => setNewCyberware({
            ...newCyberware,
            name: e.target.value
          })} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type</label>
              <input className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple" value={newCyberware.type} onChange={e => setNewCyberware({
            ...newCyberware,
            type: e.target.value
          })} placeholder="e.g., Arms, Operating System, Nervous System" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Description
              </label>
              <textarea className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full h-20 focus:outline-none focus:ring-1 focus:ring-cyber-purple" value={newCyberware.description} onChange={e => setNewCyberware({
            ...newCyberware,
            description: e.target.value
          })} />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Rarity</label>
              <select className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple" value={newCyberware.rarity} onChange={e => setNewCyberware({
            ...newCyberware,
            rarity: e.target.value as any
          })}>
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="installed" checked={newCyberware.installed} onChange={e => setNewCyberware({
            ...newCyberware,
            installed: e.target.checked
          })} className="rounded bg-cyber-black border-cyber-purple/30 focus:ring-cyber-purple text-cyber-purple" />
              <label htmlFor="installed" className="text-sm text-gray-300">
                Already installed
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsAdding(false)} className="cyber-button text-sm">
                Cancel
              </button>
              <button onClick={handleAdd} className="cyber-button-accent text-sm" disabled={!newCyberware.name || !newCyberware.type}>
                Add Cyberware
              </button>
            </div>
          </div>
        </div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {cyberware.map(item => <div key={item.id} className={`cyber-panel ${item.installed ? "border-l-2 border-l-cyber-blue" : "border-l-2 border-l-gray-600 opacity-75"}`}>
            {editingId === item.id && editForm ? <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Name
                  </label>
                  <input className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple" value={editForm.name} onChange={e => setEditForm({
              ...editForm,
              name: e.target.value
            })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Type
                  </label>
                  <input className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple" value={editForm.type} onChange={e => setEditForm({
              ...editForm,
              type: e.target.value
            })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full h-20 focus:outline-none focus:ring-1 focus:ring-cyber-purple" value={editForm.description} onChange={e => setEditForm({
              ...editForm,
              description: e.target.value
            })} />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Rarity
                  </label>
                  <select className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple" value={editForm.rarity} onChange={e => setEditForm({
              ...editForm,
              rarity: e.target.value as any
            })}>
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id={`installed-${item.id}`} checked={editForm.installed} onChange={e => setEditForm({
              ...editForm,
              installed: e.target.checked
            })} className="rounded bg-cyber-black border-cyber-purple/30 focus:ring-cyber-purple text-cyber-purple" />
                  <label htmlFor={`installed-${item.id}`} className="text-sm text-gray-300">
                    Installed
                  </label>
                </div>
                <div className="flex justify-between pt-2">
                  <button onClick={() => handleDelete(item.id)} className="text-cyber-red hover:text-red-500 transition-colors text-sm">
                    Delete
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => {
                setEditingId(null);
                setEditForm(null);
              }} className="cyber-button text-sm">
                      Cancel
                    </button>
                    <button onClick={handleUpdate} className="cyber-button-accent text-sm">
                      Save
                    </button>
                  </div>
                </div>
              </div> : <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-bold text-lg ${getRarityColor(item.rarity)}`}>
                      {item.name}
                    </h3>
                    <div className="text-sm text-gray-400">{item.type}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item.id)} className="text-cyber-blue hover:text-cyber-purple transition-colors">
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mt-2">{item.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full border ${item.installed ? "border-cyber-blue text-cyber-blue" : "border-gray-600 text-gray-400"}`}>
                      {item.installed ? "Installed" : "Not Installed"}
                    </span>
                  </div>
                  <button onClick={() => handleToggleInstalled(item.id)} className="text-sm cyber-button">
                    {item.installed ? "Uninstall" : "Install"}
                  </button>
                </div>
              </div>}
          </div>)}
      </div>

      {cyberware.length === 0 && <div className="cyber-panel text-center py-10">
          <p className="text-gray-400">
            No cyberware found. Add some chrome to enhance your capabilities.
          </p>
        </div>}
    </div>;
}