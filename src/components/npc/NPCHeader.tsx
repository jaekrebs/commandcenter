
import { NPCSearch } from "./NPCSearch";

interface NPCHeaderProps {
  onSearch: (term: string) => void;
}

export function NPCHeader({ onSearch }: NPCHeaderProps) {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-white">
          NPC <span className="text-cyber-purple glow-text">Relationships</span>
        </h1>
        <NPCSearch onSearch={onSearch} />
      </div>

      <div className="cyber-panel mb-6">
        <p className="text-gray-300">
          Track your relationships with key characters in Night City. Adjust ratings for friendship, trust, lust, and love as your interactions evolve.
        </p>
      </div>
    </>
  );
}
