import { useEffect, useRef, useState } from "react";

interface GameSocketHook {
  isConnected: boolean;
  sendMessage: (message: any) => void;
  lastMessage: any;
  error: string | null;
}

export const useGameSocket = (gameId: string): GameSocketHook => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/game/${gameId}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
        } catch (err) {
          setError("Failed to parse message");
        }
      };

      ws.current.onerror = (event) => {
        setError("WebSocket error occurred");
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };
    };

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [gameId]);

  const sendMessage = (message: any) => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify(message));
    } else {
      setError("Cannot send message: WebSocket is not connected");
    }
  };

  return {
    isConnected,
    sendMessage,
    lastMessage,
    error,
  };
};
