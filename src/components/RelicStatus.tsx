
import { useState, useEffect } from "react";

type RelicData = {
  relicIntegrity: number;
  johnnyInfluence: number;
};

export function RelicStatus() {
  const [relicData, setRelicData] = useState<RelicData>(() => {
    const savedData = localStorage.getItem("v-relic-status");
    return savedData
      ? JSON.parse(savedData)
      : {
          relicIntegrity: 75,
          johnnyInfluence: 6,
        };
  });

  useEffect(() => {
    localStorage.setItem("v-relic-status", JSON.stringify(relicData));
  }, [relicData]);

  const handleRelicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRelicData({
      ...relicData,
      relicIntegrity: Number(e.target.value),
    });
  };

  const handleJohnnyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRelicData({
      ...relicData,
      johnnyInfluence: Number(e.target.value),
    });
  };

  const getIntegrityColor = (value: number) => {
    if (value <= 30) return "bg-cyber-red";
    if (value <= 70) return "bg-cyber-yellow";
    return "bg-cyber-blue";
  };

  const getInfluenceColor = (value: number) => {
    if (value >= 8) return "bg-cyber-red";
    if (value >= 4) return "bg-cyber-yellow";
    return "bg-cyber-blue";
  };

  return (
    <div className="cyber-panel">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="text-cyber-red glow-text mr-2">Relic</span> Status
      </h2>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-white text-sm">Relic Integrity</span>
            <span className="text-white text-sm font-bold">{relicData.relicIntegrity}%</span>
          </div>
          <div className="cyber-progress-bar mb-2">
            <div
              className={`progress-fill ${getIntegrityColor(relicData.relicIntegrity)}`}
              style={{ width: `${relicData.relicIntegrity}%` }}
            ></div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={relicData.relicIntegrity}
            onChange={handleRelicChange}
            className="w-full accent-cyber-purple"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-white text-sm">Johnny Influence</span>
            <span className="text-white text-sm font-bold">{relicData.johnnyInfluence}/10</span>
          </div>
          <div className="cyber-progress-bar mb-2">
            <div
              className={`progress-fill ${getInfluenceColor(relicData.johnnyInfluence)}`}
              style={{ width: `${(relicData.johnnyInfluence / 10) * 100}%` }}
            ></div>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={relicData.johnnyInfluence}
            onChange={handleJohnnyChange}
            className="w-full accent-cyber-purple"
          />
        </div>
      </div>
    </div>
  );
}
