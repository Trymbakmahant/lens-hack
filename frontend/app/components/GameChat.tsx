"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

interface Message {
  type: string;
  user?: {
    address: string;
    username?: string;
  };
  message: string;
  timestamp?: string;
}

interface GameChatProps {
  gameId: string;
  username?: string;
}

export default function GameChat({ gameId, username }: GameChatProps) {
  const { address } = useAccount();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/`);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      // Join game room
      ws.send(
        JSON.stringify({
          type: "join",
          gameId,
          address,
          username,
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [gameId, address, username]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !wsRef.current) return;

    wsRef.current.send(
      JSON.stringify({
        type: "message",
        message: inputMessage,
      })
    );
    setInputMessage("");
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-lg border border-[#EADBC8]">
      {/* Chat header */}
      <div className="p-4 border-b border-[#EADBC8] bg-[#FFF5E6]">
        <h3 className="text-lg font-semibold text-[#8B7355]">
          Game Chat {isConnected ? "🟢" : "🔴"}
        </h3>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col">
            {msg.type === "message" && (
              <div className="flex items-start space-x-2">
                <div className="flex-1 bg-[#FFF5E6] rounded-lg p-3">
                  <p className="text-sm font-semibold text-[#8B7355]">
                    {msg.user?.username || msg.user?.address}
                  </p>
                  <p className="text-[#6B5B4E]">{msg.message}</p>
                </div>
              </div>
            )}
            {msg.type === "user_joined" && (
              <p className="text-sm text-gray-500 text-center">{msg.message}</p>
            )}
            {msg.type === "user_left" && (
              <p className="text-sm text-gray-500 text-center">{msg.message}</p>
            )}
            {msg.type === "error" && (
              <p className="text-sm text-red-500 text-center">{msg.message}</p>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-[#EADBC8]">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-lg border border-[#EADBC8] focus:outline-none focus:border-[#8B7355]"
          />
          <button
            type="submit"
            disabled={!isConnected}
            className="px-4 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#6B5B4E] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
