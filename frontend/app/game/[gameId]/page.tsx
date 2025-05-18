"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import GameBoard from "@/components/GameBoard";
import VotingPanel from "@/components/VotingPanel";
import ChatBox from "@/components/ChatBox";
import NightActions from "@/components/NightActions";
import { useGameSocket } from "@/hooks/useGameSocket";
import { useGameStore } from "@/store/gameStore";

export default function GamePage() {
  const params = useParams();
  const gameId = params.gameId as string;
  const { isConnected, sendMessage, lastMessage, error } =
    useGameSocket(gameId);
  const {
    players,
    currentPhase,
    timeLeft,
    messages,
    setPlayers,
    setPhase,
    setTimeLeft,
    addMessage,
  } = useGameStore();

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case "gameState":
          setPlayers(lastMessage.players);
          setPhase(lastMessage.phase);
          setTimeLeft(lastMessage.timeLeft);
          break;
        case "chat":
          addMessage(lastMessage);
          break;
        default:
          console.log("Unknown message type:", lastMessage.type);
      }
    }
  }, [lastMessage, setPlayers, setPhase, setTimeLeft, addMessage]);

  const handleVote = (playerId: string) => {
    sendMessage({
      type: "vote",
      playerId,
    });
  };

  const handleNightAction = (targetId: string) => {
    sendMessage({
      type: "nightAction",
      targetId,
    });
  };

  const handleChatMessage = (content: string) => {
    sendMessage({
      type: "chat",
      content,
    });
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!isConnected) {
    return <div className="loading">Connecting to game server...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Board Section */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
            <GameBoard players={players} roles={{}} timeLeft={timeLeft} />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Phase Actions */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            {currentPhase === "day" ? (
              <VotingPanel
                players={players}
                onVote={handleVote}
                timeLeft={timeLeft}
              />
            ) : (
              <NightActions
                role="werewolf"
                players={players}
                onAction={handleNightAction}
                timeLeft={timeLeft}
              />
            )}
          </div>

          {/* Chat Section */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6">
            <ChatBox
              messages={messages}
              onSendMessage={handleChatMessage}
              isNightPhase={currentPhase === "night"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
