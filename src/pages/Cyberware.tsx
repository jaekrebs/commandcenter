
import { useState } from "react";
import { useCyberware, CyberwareItem } from "@/hooks/useCyberware";
import { LoadingState } from "@/components/LoadingState";
import { CyberwareStats } from "@/components/cyberware/CyberwareStats";
import { AddCyberwareForm } from "@/components/cyberware/AddCyberwareForm";
import { CyberwareItemComponent } from "@/components/cyberware/CyberwareItem";

export default function Gear() {
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
    return <LoadingState message="Loading gear..." />;
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

  const handleEdit = (id: string) => {
    const item = cyberware.find(c => c.id === id);
    if (item) {
      setEditingId(id);
      setEditForm(item);
    }
  };

  const handleDelete = (id: string) => {
    deleteCyberware(id);
    setEditingId(null);
    setEditForm(null);
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

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-white">
          <span className="text-cyber-pink glow-text">Gear</span> Loadout
        </h1>
        <button
          onClick={() => setIsAdding(true)}
          className="cyber-button flex items-center gap-2"
        >
          <span>Add Gear</span>
        </button>
      </div>

      <CyberwareStats cyberware={cyberware} />

      {isAdding && (
        <AddCyberwareForm
          newCyberware={newCyberware}
          setNewCyberware={setNewCyberware}
          onAdd={handleAdd}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {cyberware.map(item => (
          <CyberwareItemComponent
            key={item.id}
            item={item}
            editForm={editForm}
            editingId={editingId}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onCancelEdit={() => {
              setEditingId(null);
              setEditForm(null);
            }}
            onToggleInstalled={handleToggleInstalled}
            setEditForm={setEditForm}
            getRarityColor={getRarityColor}
          />
        ))}
      </div>

      {cyberware.length === 0 && (
        <div className="cyber-panel text-center py-10">
          <p className="text-gray-400">
            No gear found. Add some chrome to enhance your capabilities.
          </p>
        </div>
      )}
    </div>
  );
}
