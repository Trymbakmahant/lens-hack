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
    <div className="game-container">
      <GameBoard players={players} roles={{}} timeLeft={timeLeft} />

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

      <ChatBox
        messages={messages}
        onSendMessage={handleChatMessage}
        isNightPhase={currentPhase === "night"}
      />
    </div>
  );
}
