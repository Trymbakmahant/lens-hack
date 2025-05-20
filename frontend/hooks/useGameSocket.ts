import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { useAccount } from "wagmi";
import { useUserStore } from "../store/userStore";

export const useGameSocket = (gameId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const { address } = useAccount();
  const { username } = useUserStore();
  const { setPhase, setPlayers, setRoles, setReady } = useGameStore();

  useEffect(() => {
    const connectWebSocket = () => {
      const wsUrl = `ws://localhost:8080/ws/game`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setIsConnected(true);
        setError(null);

        // Join game room
        if (address && username) {
          ws.current?.send(
            JSON.stringify({
              type: "JOIN_GAME",
              data: {
                gameId,
                address,
                playerUuid: username,
              },
            })
          );
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case "GAME_STATE":
              setPhase(data.data.phase);
              setPlayers(data.data.players);
              setRoles(data.data.roles || []);
              break;
            case "ERROR":
              setError(data.data);
              break;
          }
        } catch (err) {
          console.error("Failed to parse message:", err);
          setError("Failed to parse message");
        }
      };

      ws.current.onerror = () => {
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
  }, [gameId, address, username, setPhase, setPlayers, setRoles]);

  const sendReady = () => {
    if (ws.current && isConnected) {
      ws.current.send(
        JSON.stringify({
          type: "ready_to_start",
        })
      );
      setReady(true);
    }
  };

  return {
    isConnected,
    error,
    sendReady,
  };
};
