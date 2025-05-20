const WebSocket = require("ws");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");

// Game expiration time (5 minutes)
const GAME_EXPIRATION_TIME = 5 * 60 * 1000;

function setupGameWebSocket(wss) {
  const gameRooms = new Map();

  wss.on("connection", (ws) => {
    let currentGameId = null;
    let currentUser = null;

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message);

        switch (data.type) {
          case "join_game":
            const { gameId, address, username } = data;
            currentGameId = gameId;
            currentUser = { address, username };

            // Check if game exists and is not expired
            let game = await prisma.game.findUnique({
              where: { gameId },
              include: { users: true },
            });

            if (!game) {
              // Game doesn't exist, create new game
              game = await prisma.game.create({
                data: {
                  gameId,
                  phase: "JOINING",
                  players: [],
                  roles: [],
                  startTime: new Date(),
                },
              });
            } else {
              const gameAge = Date.now() - game.startTime.getTime();
              if (gameAge > GAME_EXPIRATION_TIME) {
                // Game expired, update existing game
                game = await prisma.game.update({
                  where: { gameId },
                  data: {
                    phase: "JOINING",
                    players: [],
                    roles: [],
                    startTime: new Date(),
                  },
                });
              }
            }

            // Create or get game room
            if (!gameRooms.has(gameId)) {
              gameRooms.set(gameId, new Set());
            }
            gameRooms.get(gameId).add(ws);

            // Add player to the game if not already present
            const players = game.players || [];
            const playerExists = players.some(
              ([playerAddress]) => playerAddress === address
            );

            if (!playerExists) {
              const newUuid = crypto.randomUUID();
              players.push([address, newUuid, false]);

              await prisma.game.update({
                where: { gameId },
                data: { players },
              });
            }

            // Send current game state
            const gameState = await prisma.game.findUnique({
              where: { gameId },
              include: { users: true },
            });

            if (gameState) {
              ws.send(
                JSON.stringify({
                  type: "game_state",
                  game: {
                    phase: gameState.phase,
                    players: gameState.players.length,
                    roles: gameState.roles,
                  },
                })
              );
            }
            break;

          case "ready_to_start":
            if (!currentGameId || !currentUser) return;

            const currentGame = await prisma.game.findUnique({
              where: { gameId: currentGameId },
              include: { users: true },
            });

            if (!currentGame) return;

            // Update player's committed status
            const updatedPlayers = currentGame.players.map(
              ([playerAddress, uuid, committed]) => {
                if (playerAddress === currentUser.address) {
                  return [playerAddress, uuid, true];
                }
                return [playerAddress, uuid, committed];
              }
            );

            await prisma.game.update({
              where: { gameId: currentGameId },
              data: { players: updatedPlayers },
            });

            // Broadcast updated game state
            const updatedGame = await prisma.game.findUnique({
              where: { gameId: currentGameId },
              include: { users: true },
            });

            broadcastToRoom(currentGameId, {
              type: "game_state",
              game: {
                phase: updatedGame.phase,
                players: updatedGame.players.length,
                roles: updatedGame.roles,
              },
            });
            break;
        }
      } catch (error) {
        console.error("WebSocket error:", error);
        ws.send(
          JSON.stringify({
            type: "error",
            message: "An error occurred",
          })
        );
      }
    });

    ws.on("close", () => {
      if (currentGameId && gameRooms.has(currentGameId)) {
        gameRooms.get(currentGameId).delete(ws);
        if (gameRooms.get(currentGameId).size === 0) {
          gameRooms.delete(currentGameId);
        }
      }
    });
  });

  function broadcastToRoom(gameId, message) {
    if (gameRooms.has(gameId)) {
      const room = gameRooms.get(gameId);
      room.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    }
  }

  return wss;
}

module.exports = setupGameWebSocket;
