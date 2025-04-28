
type MissionFiltersProps = {
  activeTab: "all" | "main" | "side" | "gig";
  onTabChange: (tab: "all" | "main" | "side" | "gig") => void;
};

export function MissionFilters({ activeTab, onTabChange }: MissionFiltersProps) {
  return (
    <div className="mb-6 border-b border-cyber-purple/20">
      <div className="flex flex-wrap space-x-1 space-y-1 sm:space-y-0">
        {(["all", "main", "side", "gig"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-cyber-purple text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab === "all"
              ? "All Missions"
              : tab === "main"
              ? "Main Missions"
              : tab === "side"
              ? "Side Jobs"
              : "Gigs"}
          </button>
        ))}
      </div>
    </div>
  );
}
