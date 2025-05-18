"use client";

import React, { useState, useEffect } from "react";
import GameBoard from "@/components/GameBoard";
import VotingPanel from "@/components/VotingPanel";
import ChatBox from "@/components/ChatBox";
import NightActions from "@/components/NightActions";
import WalletConnect from "@/components/WalletConnect";

interface Player {
  id: string;
  name: string;
  role: string;
  isAlive: boolean;
  votes?: number;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  role?: string;
}

// Demo data
const DEMO_PLAYERS: Player[] = [
  { id: "1", name: "Alice", role: "werewolf", isAlive: true, votes: 0 },
  { id: "2", name: "Bob", role: "villager", isAlive: true, votes: 0 },
  { id: "3", name: "Charlie", role: "detective", isAlive: true, votes: 0 },
  { id: "4", name: "Dave", role: "villager", isAlive: true, votes: 0 },
  { id: "5", name: "Eve", role: "werewolf", isAlive: true, votes: 0 },
];

const DEMO_ROLES = {
  "1": "werewolf",
  "2": "villager",
  "3": "detective",
  "4": "villager",
  "5": "werewolf",
};

export default function DemoPage() {
  const [phase, setPhase] = useState<"day" | "night">("day");
  const [timeLeft, setTimeLeft] = useState(60);
  const [messages, setMessages] = useState<Message[]>([]);
  const [players, setPlayers] = useState<Player[]>(DEMO_PLAYERS);
  const [selectedRole, setSelectedRole] = useState("werewolf");
  const [showRules, setShowRules] = useState(false);
  const [gameStatus, setGameStatus] = useState<"playing" | "ended">("playing");
  const [winner, setWinner] = useState<string | null>(null);

  // Simulate timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPhase((current) => (current === "day" ? "night" : "day"));
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check for game end conditions
  useEffect(() => {
    const alivePlayers = players.filter((p) => p.isAlive);
    const aliveWerewolves = alivePlayers.filter((p) => p.role === "werewolf");
    const aliveVillagers = alivePlayers.filter((p) => p.role !== "werewolf");

    if (aliveWerewolves.length === 0) {
      setGameStatus("ended");
      setWinner("Villagers");
    } else if (aliveWerewolves.length >= aliveVillagers.length) {
      setGameStatus("ended");
      setWinner("Werewolves");
    }
  }, [players]);

  const handleVote = (playerId: string) => {
    const updatedPlayers = players.map((player) =>
      player.id === playerId
        ? { ...player, votes: (player.votes || 0) + 1 }
        : player
    );
    setPlayers(updatedPlayers);
    addMessage({
      id: Date.now().toString(),
      sender: "System",
      content: `A vote was cast for ${
        players.find((p) => p.id === playerId)?.name
      }`,
      timestamp: new Date(),
    });
  };

  const handleNightAction = (targetId: string) => {
    const targetPlayer = players.find((p) => p.id === targetId);
    addMessage({
      id: Date.now().toString(),
      sender: "System",
      content: `${selectedRole} performed their action on ${targetPlayer?.name}`,
      timestamp: new Date(),
    });
  };

  const handleChatMessage = (content: string) => {
    addMessage({
      id: Date.now().toString(),
      sender: "You",
      content,
      timestamp: new Date(),
      role: selectedRole,
    });
  };

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const resetGame = () => {
    setPlayers(DEMO_PLAYERS);
    setMessages([]);
    setPhase("day");
    setTimeLeft(60);
    setGameStatus("playing");
    setWinner(null);
  };

  return (
    <div className="demo-container p-4 max-w-7xl mx-auto">
      <div className="controls mb-4 p-4 bg-gray-800 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Demo Controls</h2>
          <button
            onClick={() => setShowRules(!showRules)}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            {showRules ? "Hide Rules" : "Show Rules"}
          </button>
        </div>

        {showRules && (
          <div className="mb-4 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">
              Game Rules
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Day Phase: Players discuss and vote to eliminate a player</li>
              <li>Night Phase: Special roles perform their actions</li>
              <li>Werewolves win when they equal or outnumber villagers</li>
              <li>Villagers win when all werewolves are eliminated</li>
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setPhase("day")}
            className={`px-4 py-2 rounded transition-colors ${
              phase === "day"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Day Phase
          </button>
          <button
            onClick={() => setPhase("night")}
            className={`px-4 py-2 rounded transition-colors ${
              phase === "night"
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Night Phase
          </button>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="werewolf">Werewolf</option>
            <option value="detective">Detective</option>
            <option value="villager">Villager</option>
          </select>
          {gameStatus === "ended" && (
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              New Game
            </button>
          )}
        </div>
      </div>

      {gameStatus === "ended" && (
        <div className="mb-4 p-4 bg-gray-800 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Game Over!</h2>
          <p className="text-xl text-gray-300">The {winner} have won!</p>
        </div>
      )}

      <div className="wallet-section mb-4">
        <WalletConnect
          onConnect={(address) => console.log("Connected:", address)}
        />
      </div>

      <div className="game-layout grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="game-board-section">
          <GameBoard
            players={players}
            roles={DEMO_ROLES}
            timeLeft={timeLeft}
            phase={phase}
          />
        </div>

        <div className="game-actions-section">
          {phase === "day" ? (
            <VotingPanel
              players={players.filter((p) => p.isAlive)}
              onVote={handleVote}
              timeLeft={timeLeft}
            />
          ) : (
            <NightActions
              role={selectedRole}
              players={players.filter((p) => p.isAlive)}
              onAction={handleNightAction}
              timeLeft={timeLeft}
            />
          )}
        </div>

        <div className="chat-section md:col-span-2">
          <ChatBox
            messages={messages}
            onSendMessage={handleChatMessage}
            isNightPhase={phase === "night"}
            currentRole={selectedRole}
          />
        </div>
      </div>
    </div>
  );
}
