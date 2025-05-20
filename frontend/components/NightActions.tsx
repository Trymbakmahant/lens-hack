"use client";

import React, { useState } from "react";
import { gameService, Player } from "../services/gameService";

interface NightActionsProps {
  role: string;
  players: Player[];
  onAction: (targetId: string) => void;
  timeLeft: number;
}

const NightActions: React.FC<NightActionsProps> = ({
  role,
  players,
  onAction,
  timeLeft,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAction = async (targetId: string) => {
    try {
      setError(null);
      setSelectedTarget(targetId);

      // Map role to action type
      const actionMap: Record<string, "KILL" | "HEAL" | "INVESTIGATE"> = {
        werewolf: "KILL",
        doctor: "HEAL",
        detective: "INVESTIGATE",
      };

      const action = actionMap[role.toLowerCase()];
      if (!action) {
        throw new Error("Invalid role");
      }

      await gameService.performAction(action, targetId);
      onAction(targetId);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to perform action"
      );
      setSelectedTarget(null);
    }
  };

  const getActionDescription = () => {
    switch (role.toLowerCase()) {
      case "werewolf":
        return "Choose a player to eliminate";
      case "doctor":
        return "Choose a player to heal";
      case "detective":
        return "Choose a player to investigate";
      default:
        return "Waiting for your action...";
    }
  };

  return (
    <div className="night-actions p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        Night Phase - {role.charAt(0).toUpperCase() + role.slice(1)}
      </h2>
      <div className="text-sm text-gray-400 mb-2">Time Left: {timeLeft}s</div>
      <p className="text-gray-300 mb-4">{getActionDescription()}</p>

      {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

      <div className="grid grid-cols-2 gap-2">
        {players.map((player) => (
          <button
            key={player.id}
            className={`p-2 rounded transition-colors duration-200 ${
              selectedTarget === player.id
                ? "bg-blue-600 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-300"
            }`}
            onClick={() => handleAction(player.id)}
            disabled={selectedTarget !== null}
          >
            {player.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NightActions;
