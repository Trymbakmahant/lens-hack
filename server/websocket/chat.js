const WebSocket = require("ws");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function setupWebSocket(wss) {
  // Store active game rooms
  const gameRooms = new Map();

  wss.on("connection", (ws) => {
    let currentGameId = null;
    let currentUser = null;

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message);

        // Handle initial connection with gameId and user info
        if (data.type === "join") {
          const { gameId, address, username } = data;

          // Validate game exists
          const game = await prisma.game.findUnique({
            where: { gameId },
          });

          if (!game) {
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Game not found",
              })
            );
            return;
          }

          // Create or get game room
          if (!gameRooms.has(gameId)) {
            gameRooms.set(gameId, new Set());
          }

          // Add user to room
          currentGameId = gameId;
          currentUser = { address, username };
          gameRooms.get(gameId).add(ws);

          // Send join confirmation
          ws.send(
            JSON.stringify({
              type: "joined",
              gameId,
              message: `${username || address} joined the chat`,
            })
          );

          // Broadcast to other users in the room
          broadcastToRoom(
            gameId,
            {
              type: "user_joined",
              user: { address, username },
              message: `${username || address} joined the chat`,
            },
            ws
          );
        }
        // Handle chat messages
        else if (data.type === "message" && currentGameId) {
          const { message } = data;

          // Broadcast message to all users in the game room
          broadcastToRoom(currentGameId, {
            type: "message",
            user: currentUser,
            message,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("WebSocket error:", error);
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Invalid message format",
          })
        );
      }
    });

    ws.on("close", () => {
      if (currentGameId && gameRooms.has(currentGameId)) {
        // Remove user from room
        gameRooms.get(currentGameId).delete(ws);

        // Broadcast user left message
        broadcastToRoom(currentGameId, {
          type: "user_left",
          user: currentUser,
          message: `${
            currentUser?.username || currentUser?.address
          } left the chat`,
        });

        // Clean up empty rooms
        if (gameRooms.get(currentGameId).size === 0) {
          gameRooms.delete(currentGameId);
        }
      }
    });
  });

  // Helper function to broadcast to all users in a room except sender
  function broadcastToRoom(gameId, message, excludeWs = null) {
    if (gameRooms.has(gameId)) {
      gameRooms.get(gameId).forEach((client) => {
        if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }
  }

  return wss;
}

module.exports = setupWebSocket;
