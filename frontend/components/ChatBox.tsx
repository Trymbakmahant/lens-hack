"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isNightPhase: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  onSendMessage,
  isNightPhase,
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

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <span className="sender">{message.sender}: </span>
            <span className="content">{message.content}</span>
            <span className="timestamp">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chat-input">
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
        />
        <button type="submit" disabled={isNightPhase || !newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
