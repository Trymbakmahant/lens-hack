"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import WalletConnect from "@/components/WalletConnect";

// Mock data for public games - replace with actual data from your backend
const mockPublicGames = [
  {
    id: "abc123",
    name: "Village Night",
    players: 4,
    maxPlayers: 8,
    status: "waiting",
  },
  {
    id: "def456",
    name: "Wolf Pack",
    players: 6,
    maxPlayers: 10,
    status: "waiting",
  },
  {
    id: "ghi789",
    name: "Mystery Manor",
    players: 3,
    maxPlayers: 8,
    status: "waiting",
  },
];

export default function LobbyPage() {
  const router = useRouter();
  const [gameId, setGameId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [selectedRole, setSelectedRole] = useState("villager");
  const [gameSettings, setGameSettings] = useState({
    maxPlayers: 8,
    roles: {
      wolves: 2,
      detectives: 1,
      doctors: 1,
    },
    isPublic: true,
    gameName: "",
  });

  const handleCreateGame = () => {
    const newGameId = Math.random().toString(36).substring(2, 8);
    router.push(`/game/${newGameId}`);
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameId && playerName) {
      router.push(`/game/${gameId}`);
    }
  };

  const handleJoinPublicGame = (gameId: string) => {
    router.push(`/game/${gameId}`);
  };

  return (
    <div className="min-h-screen bg-[#FFF5E6] text-[#4A4A4A] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#8B7355]">
          Game Lobby
        </h1>

        <div className="wallet-section mb-8">
          <WalletConnect
            onConnect={(address) => console.log("Connected:", address)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Create Game Section */}
          <div className="bg-white p-6 rounded-lg border-2 border-[#D4C4B7] shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-[#8B7355]">
              Create New Game
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#6B5B4E] mb-2">
                  Game Name
                </label>
                <input
                  type="text"
                  value={gameSettings.gameName}
                  onChange={(e) =>
                    setGameSettings({
                      ...gameSettings,
                      gameName: e.target.value,
                    })
                  }
                  placeholder="Enter Game Name"
                  className="w-full p-2 border-2 border-[#D4C4B7] rounded-lg bg-[#FFF5E6]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B5B4E] mb-2">
                  Maximum Players
                </label>
                <select
                  value={gameSettings.maxPlayers}
                  onChange={(e) =>
                    setGameSettings({
                      ...gameSettings,
                      maxPlayers: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border-2 border-[#D4C4B7] rounded-lg bg-[#FFF5E6]"
                >
                  {[6, 8, 10, 12].map((num) => (
                    <option key={num} value={num}>
                      {num} Players
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B5B4E] mb-2">
                  Number of Wolves
                </label>
                <select
                  value={gameSettings.roles.wolves}
                  onChange={(e) =>
                    setGameSettings({
                      ...gameSettings,
                      roles: {
                        ...gameSettings.roles,
                        wolves: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full p-2 border-2 border-[#D4C4B7] rounded-lg bg-[#FFF5E6]"
                >
                  {[1, 2, 3].map((num) => (
                    <option key={num} value={num}>
                      {num} Wolves
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B5B4E] mb-2">
                  Game Visibility
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={gameSettings.isPublic}
                      onChange={() =>
                        setGameSettings({
                          ...gameSettings,
                          isPublic: true,
                        })
                      }
                      className="form-radio text-[#8B7355]"
                    />
                    <span>Public</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={!gameSettings.isPublic}
                      onChange={() =>
                        setGameSettings({
                          ...gameSettings,
                          isPublic: false,
                        })
                      }
                      className="form-radio text-[#8B7355]"
                    />
                    <span>Private</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleCreateGame}
                className="w-full bg-[#8B7355] hover:bg-[#6B5B4E] text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
              >
                Create Game
              </button>
            </div>
          </div>

          {/* Join Game Section */}
          <div className="bg-white p-6 rounded-lg border-2 border-[#D4C4B7] shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-[#8B7355]">
              Join Existing Game
            </h2>

            <form onSubmit={handleJoinGame} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#6B5B4E] mb-2">
                  Game ID
                </label>
                <input
                  type="text"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  placeholder="Enter Game ID"
                  required
                  className="w-full p-2 border-2 border-[#D4C4B7] rounded-lg bg-[#FFF5E6]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B5B4E] mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter Your Name"
                  required
                  className="w-full p-2 border-2 border-[#D4C4B7] rounded-lg bg-[#FFF5E6]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6B5B4E] mb-2">
                  Preferred Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full p-2 border-2 border-[#D4C4B7] rounded-lg bg-[#FFF5E6]"
                >
                  <option value="villager">Villager</option>
                  <option value="wolf">Wolf</option>
                  <option value="detective">Detective</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#8B7355] hover:bg-[#6B5B4E] text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
              >
                Join Game
              </button>
            </form>
          </div>
        </div>

        {/* Public Games Section */}
        <div className="mt-8 bg-white p-6 rounded-lg border-2 border-[#D4C4B7] shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-[#8B7355]">
            Public Games
          </h2>
          <div className="grid gap-4">
            {mockPublicGames.map((game) => (
              <div
                key={game.id}
                className="flex items-center justify-between p-4 bg-[#FFF5E6] rounded-lg border border-[#D4C4B7]"
              >
                <div>
                  <h3 className="font-semibold text-[#8B7355]">{game.name}</h3>
                  <p className="text-sm text-[#6B5B4E]">
                    Players: {game.players}/{game.maxPlayers}
                  </p>
                </div>
                <button
                  onClick={() => handleJoinPublicGame(game.id)}
                  className="bg-[#8B7355] hover:bg-[#6B5B4E] text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Rules Section */}
        <div className="mt-8 bg-white p-6 rounded-lg border-2 border-[#D4C4B7] shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">
            Quick Rules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#8B7355]">
                Game Phases
              </h3>
              <ul className="list-disc list-inside text-[#6B5B4E] space-y-2">
                <li>
                  Night: Wolves hunt, Detective investigates, Doctor protects
                </li>
                <li>Day: Discuss and vote to eliminate suspicious players</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#8B7355]">
                Winning Conditions
              </h3>
              <ul className="list-disc list-inside text-[#6B5B4E] space-y-2">
                <li>Villagers win when all wolves are eliminated</li>
                <li>Wolves win when they equal or outnumber villagers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
