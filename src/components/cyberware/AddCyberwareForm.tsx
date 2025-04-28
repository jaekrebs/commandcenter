
import { CyberwareItem } from "@/hooks/useCyberware";

interface AddCyberwareFormProps {
  newCyberware: Omit<CyberwareItem, "id">;
  setNewCyberware: (cyberware: Omit<CyberwareItem, "id">) => void;
  onAdd: () => void;
  onCancel: () => void;
}

export function AddCyberwareForm({ 
  newCyberware, 
  setNewCyberware, 
  onAdd, 
  onCancel 
}: AddCyberwareFormProps) {
  return (
    <div className="cyber-panel mb-6">
      <h2 className="text-xl font-bold mb-4">Add New Cyberware</h2>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Name</label>
          <input
            className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
            value={newCyberware.name}
            onChange={e => setNewCyberware({ ...newCyberware, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Type</label>
          <input
            className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
            value={newCyberware.type}
            onChange={e => setNewCyberware({ ...newCyberware, type: e.target.value })}
            placeholder="e.g., Arms, Operating System, Nervous System"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Description</label>
          <textarea
            className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full h-20 focus:outline-none focus:ring-1 focus:ring-cyber-purple"
            value={newCyberware.description}
            onChange={e => setNewCyberware({ ...newCyberware, description: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Rarity</label>
          <select
            className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
            value={newCyberware.rarity}
            onChange={e => setNewCyberware({ ...newCyberware, rarity: e.target.value as any })}
          >
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="installed"
            checked={newCyberware.installed}
            onChange={e => setNewCyberware({ ...newCyberware, installed: e.target.checked })}
            className="rounded bg-cyber-black border-cyber-purple/30 focus:ring-cyber-purple text-cyber-purple"
          />
          <label htmlFor="installed" className="text-sm text-gray-300">
            Already installed
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onCancel} className="cyber-button text-sm">
            Cancel
          </button>
          <button
            onClick={onAdd}
            className="cyber-button-accent text-sm"
            disabled={!newCyberware.name || !newCyberware.type}
          >
            Add Cyberware
          </button>
        </div>
      </div>
    </div>
  );
}
