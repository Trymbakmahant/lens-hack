"use client";

import React, { useState, useEffect } from "react";
import GameBoard from "@/components/GameBoard";
import VotingPanel from "@/components/VotingPanel";
import ChatBox from "@/components/ChatBox";
import NightActions from "@/components/NightActions";
import { config } from "@/config/env";

interface Player {
  id: string;
  name: string;
  role: string;
  isAlive: boolean;
  votes?: number;
  isWherewolf?: boolean;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  role?: string;
}

// Demo data for 3 players
const DEMO_PLAYERS: Player[] = [
  {
    id: "1",
    name: "Alice",
    role: "werewolf",
    isAlive: true,
    votes: 0,
    isWherewolf: true,
  },
  { id: "2", name: "Bob", role: "doctor", isAlive: true, votes: 0 },
  { id: "3", name: "Charlie", role: "villager", isAlive: true, votes: 0 },
];

const DEMO_ROLES = {
  "1": "werewolf",
  "2": "doctor",
  "3": "villager",
};

export default function DemoPage() {
  const [phase, setPhase] = useState<"day" | "night">("day");
  const [timeLeft, setTimeLeft] = useState(60);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "System",
      content: "Game initialized! Welcome to the Werewolf Demo.",
      timestamp: new Date(),
    },
  ]);
  const [players, setPlayers] = useState<Player[]>(DEMO_PLAYERS);
  const [selectedRole, setSelectedRole] = useState("werewolf");
  const [showRules, setShowRules] = useState(false);
  const [gameStatus, setGameStatus] = useState<"playing" | "ended">("playing");
  const [winner, setWinner] = useState<string | null>(null);
  const [revealTime, setRevealTime] = useState<number | null>(() => {
    const now = Math.floor(Date.now() / 1000);
    return now + 300; // 5 minutes from now
  });

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

  // Simulate WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(`${config.wsUrl}/ws/game?gameId=demo`);

    ws.onopen = () => {
      console.log("WebSocket Connected");
      addMessage({
        id: Date.now().toString(),
        sender: "System",
        content: "Connected to game server",
        timestamp: new Date(),
      });
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
      addMessage({
        id: Date.now().toString(),
        sender: "System",
        content: "Disconnected from game server",
        timestamp: new Date(),
      });
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

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
    const currentPlayer = players.find((p) => p.role === selectedRole);

    if (selectedRole === "werewolf") {
      // Werewolf kills target
      setPlayers(
        players.map((p) => (p.id === targetId ? { ...p, isAlive: false } : p))
      );
    } else if (selectedRole === "doctor") {
      // Doctor heals target
      setPlayers(
        players.map((p) => (p.id === targetId ? { ...p, isAlive: true } : p))
      );
    }

    addMessage({
      id: Date.now().toString(),
      sender: "System",
      content: `${currentPlayer?.name} (${selectedRole}) performed their action on ${targetPlayer?.name}`,
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
    setRevealTime(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="demo-container max-w-7xl mx-auto">
        <div className="controls mb-6 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Demo Controls</h2>
            <button
              onClick={() => setShowRules(!showRules)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
            >
              {showRules ? "Hide Rules" : "Show Rules"}
            </button>
          </div>

          {showRules && (
            <div className="mb-6 p-6 bg-gray-800/70 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Game Rules
              </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-3">
                <li className="text-indigo-300">
                  3 Players: 1 Werewolf, 1 Doctor, 1 Villager
                </li>
                <li className="text-amber-300">
                  Day Phase: Players discuss and vote to eliminate a player
                </li>
                <li className="text-purple-300">
                  Night Phase: Werewolf can kill, Doctor can heal
                </li>
                <li className="text-red-300">
                  Werewolves win when they equal or outnumber villagers
                </li>
                <li className="text-green-300">
                  Villagers win when all werewolves are eliminated
                </li>
                <li className="text-blue-300">
                  Werewolf identity is revealed after 5 minutes
                </li>
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setPhase("day")}
              className={`px-6 py-3 rounded-lg transition-all transform hover:scale-105 ${
                phase === "day"
                  ? "bg-amber-500 text-gray-900 font-bold shadow-lg"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Day Phase
            </button>
            <button
              onClick={() => setPhase("night")}
              className={`px-6 py-3 rounded-lg transition-all transform hover:scale-105 ${
                phase === "night"
                  ? "bg-indigo-600 text-white font-bold shadow-lg"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Night Phase
            </button>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-6 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
            >
              <option value="werewolf">Werewolf</option>
              <option value="doctor">Doctor</option>
              <option value="villager">Villager</option>
            </select>
            {gameStatus === "ended" && (
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
              >
                New Game
              </button>
            )}
          </div>
        </div>

        {gameStatus === "ended" && (
          <div className="mb-6 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl text-center border border-gray-700 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-3">Game Over!</h2>
            <p className="text-2xl text-gray-300">
              The <span className="text-indigo-400 font-bold">{winner}</span>{" "}
              have won!
            </p>
          </div>
        )}

        <div className="game-layout grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="game-board-section bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-2xl">
            <GameBoard
              players={players}
              roles={DEMO_ROLES}
              timeLeft={timeLeft}
              phase={phase}
              revealTime={revealTime}
            />
          </div>

          <div className="game-actions-section bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-2xl">
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

          <div className="chat-section md:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-2xl">
            <ChatBox
              messages={messages}
              onSendMessage={handleChatMessage}
              isNightPhase={phase === "night"}
              currentRole={selectedRole}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
