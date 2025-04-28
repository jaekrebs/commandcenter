
import { useState } from "react";

interface NPCSearchProps {
  onSearch: (term: string) => void;
}

export function NPCSearch({ onSearch }: NPCSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="w-full md:w-64">
      <input
        type="text"
        placeholder="Search NPCs..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="bg-cyber-black border border-cyber-purple/30 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-cyber-purple"
      />
    </div>
  );
}
