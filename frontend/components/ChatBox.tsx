"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  role?: string;
}

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isNightPhase: boolean;
  currentRole: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  onSendMessage,
  isNightPhase,
  currentRole,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "werewolf":
        return "text-red-400";
      case "detective":
        return "text-blue-400";
      case "villager":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="chat-box h-[400px] flex flex-col bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Chat</h2>
        <div
          className={`text-sm px-3 py-1 rounded-full ${getRoleColor(
            currentRole
          )}`}
        >
          Playing as:{" "}
          {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`bg-gray-700 rounded-lg p-3 max-w-[80%] ${
              message.sender === "System" ? "mx-auto" : ""
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-semibold ${getRoleColor(message.role)}`}>
                {message.sender}
              </span>
              <span className="text-xs text-gray-400">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <p className="text-gray-200">{message.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={
            isNightPhase
              ? "Chat is disabled during night phase"
              : "Type your message..."
          }
          disabled={isNightPhase}
          className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isNightPhase || !newMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
