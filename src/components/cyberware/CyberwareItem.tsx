
import { Edit } from "lucide-react";
import { CyberwareItem as CyberwareItemType } from "@/hooks/useCyberware";

interface CyberwareItemProps {
  item: CyberwareItemType;
  editForm: CyberwareItemType | null;
  editingId: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: () => void;
  onCancelEdit: () => void;
  onToggleInstalled: (id: string) => void;
  setEditForm: (form: CyberwareItemType | null) => void;
  getRarityColor: (rarity: string) => string;
}

export function CyberwareItemComponent({
  item,
  editForm,
  editingId,
  onEdit,
  onDelete,
  onUpdate,
  onCancelEdit,
  onToggleInstalled,
  setEditForm,
  getRarityColor,
}: CyberwareItemProps) {
  return (
    <div
      className={`cyber-panel ${
        item.installed
          ? "border-l-2 border-l-cyber-blue"
          : "border-l-2 border-l-gray-600 opacity-75"
      }`}
    >
      {editingId === item.id && editForm ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Type</label>
            <input
              className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
              value={editForm.type}
              onChange={(e) =>
                setEditForm({ ...editForm, type: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Description
            </label>
            <textarea
              className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full h-20 focus:outline-none focus:ring-1 focus:ring-cyber-purple"
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Rarity</label>
            <select
              className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
              value={editForm.rarity}
              onChange={(e) =>
                setEditForm({ ...editForm, rarity: e.target.value as any })
              }
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
              id={`installed-${item.id}`}
              checked={editForm.installed}
              onChange={(e) =>
                setEditForm({ ...editForm, installed: e.target.checked })
              }
              className="rounded bg-cyber-black border-cyber-purple/30 focus:ring-cyber-purple text-cyber-purple"
            />
            <label
              htmlFor={`installed-${item.id}`}
              className="text-sm text-gray-300"
            >
              Installed
            </label>
          </div>
          <div className="flex justify-between pt-2">
            <button
              onClick={() => onDelete(item.id)}
              className="text-cyber-red hover:text-red-500 transition-colors text-sm"
            >
              Delete
            </button>
            <div className="flex gap-2">
              <button onClick={onCancelEdit} className="cyber-button text-sm">
                Cancel
              </button>
              <button onClick={onUpdate} className="cyber-button-accent text-sm">
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`font-bold text-lg ${getRarityColor(item.rarity)}`}>
                {item.name}
              </h3>
              <div className="text-sm text-gray-400">{item.type}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(item.id)}
                className="text-cyber-blue hover:text-cyber-purple transition-colors"
              >
                <Edit size={16} />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-300 mt-2">{item.description}</p>
          <div className="flex justify-between items-center mt-4">
            <div>
              <span
                className={`inline-block px-2 py-0.5 text-xs rounded-full border ${
                  item.installed
                    ? "border-cyber-blue text-cyber-blue"
                    : "border-gray-600 text-gray-400"
                }`}
              >
                {item.installed ? "Installed" : "Not Installed"}
              </span>
            </div>
            <button
              onClick={() => onToggleInstalled(item.id)}
              className="text-sm cyber-button"
            >
              {item.installed ? "Uninstall" : "Install"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
