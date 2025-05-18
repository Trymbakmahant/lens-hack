"use client";

import React, { useState, useEffect } from "react";
import GameBoard from "@/components/GameBoard";
import VotingPanel from "@/components/VotingPanel";
import ChatBox from "@/components/ChatBox";
import NightActions from "@/components/NightActions";
import WalletConnect from "@/components/WalletConnect";

// Demo data
const DEMO_PLAYERS = [
  { id: "1", name: "Alice", role: "werewolf", isAlive: true },
  { id: "2", name: "Bob", role: "villager", isAlive: true },
  { id: "3", name: "Charlie", role: "detective", isAlive: true },
  { id: "4", name: "Dave", role: "villager", isAlive: true },
  { id: "5", name: "Eve", role: "werewolf", isAlive: true },
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
  const [messages, setMessages] = useState<any[]>([]);
  const [players, setPlayers] = useState(DEMO_PLAYERS);
  const [selectedRole, setSelectedRole] = useState("werewolf");

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

  const handleVote = (playerId: string) => {
    const updatedPlayers = players.map((player) =>
      player.id === playerId ? { ...player, isAlive: false } : player
    );
    setPlayers(updatedPlayers);
    addMessage({
      id: Date.now().toString(),
      sender: "System",
      content: `${
        players.find((p) => p.id === playerId)?.name
      } was eliminated!`,
      timestamp: new Date(),
    });
  };

  const handleNightAction = (targetId: string) => {
    addMessage({
      id: Date.now().toString(),
      sender: "System",
      content: `${selectedRole} performed their action on ${
        players.find((p) => p.id === targetId)?.name
      }`,
      timestamp: new Date(),
    });
  };

  const handleChatMessage = (content: string) => {
    addMessage({
      id: Date.now().toString(),
      sender: "You",
      content,
      timestamp: new Date(),
    });
  };

  const addMessage = (message: any) => {
    setMessages((prev) => [...prev, message]);
  };

  return (
    <div className="demo-container p-4">
      <div className="controls mb-4 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-bold mb-2">Demo Controls</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setPhase("day")}
            className={`px-4 py-2 rounded ${
              phase === "day" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Day Phase
          </button>
          <button
            onClick={() => setPhase("night")}
            className={`px-4 py-2 rounded ${
              phase === "night" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Night Phase
          </button>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 rounded border"
          >
            <option value="werewolf">Werewolf</option>
            <option value="detective">Detective</option>
            <option value="villager">Villager</option>
          </select>
        </div>
      </div>

      <div className="wallet-section mb-4">
        <WalletConnect
          onConnect={(address) => console.log("Connected:", address)}
        />
      </div>

      <div className="game-layout grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="game-board-section">
          <GameBoard players={players} roles={DEMO_ROLES} timeLeft={timeLeft} />
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
          />
        </div>
      </div>
    </div>
  );
}
