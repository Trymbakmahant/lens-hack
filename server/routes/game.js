const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Game constants
const NB_PLAYERS = 4;
const GAME_DURATION = 60 * 5;
const ROLES = {
  WOLF: "wolf",
  DOCTOR: "doctor",
  DETECTIVE: "detective",
  VILLAGER: "villager",
};

// Helper function to get game state
async function getState(groveId) {
  const url = "https://api.grove.storage/" + groveId;
  const res = await fetch(url);
  const data = await res.json();
  return data?.state;
}

// Helper function to assign roles
function assignRoles(playerCount) {
  const roles = [];
  roles.push(ROLES.WOLF);
  roles.push(ROLES.DOCTOR);
  roles.push(ROLES.DETECTIVE);
  for (let i = 3; i < playerCount; i++) {
    roles.push(ROLES.VILLAGER);
  }
  return roles.sort(() => Math.random() - 0.5);
}

// Create game
router.post("/create", async (req, res) => {
  try {
    const { gameId, groveId, address, username } = req.body;

    if (!groveId) throw new Error("groveId is required");
    if (!gameId) throw new Error("gameId is required");
    if (!address) throw new Error("address is required");
    if (typeof gameId !== "string") throw new Error("gameId must be a string");
    if (gameId.length < 3)
      throw new Error("gameId must be at least 3 characters long");

    const existingGame = await prisma.game.findUnique({
      where: { gameId },
    });

    if (!existingGame) {
      const state = await getState(groveId);
      if (state !== 0) throw new Error("state 0 is required");

      const newUuid = crypto.randomUUID();

      const user = await prisma.user.upsert({
        where: { address },
        update: {
          username: username || undefined,
          groveId: groveId,
        },
        create: {
          address,
          username: username || null,
          groveId,
        },
      });

      const game = await prisma.game.create({
        data: {
          gameId,
          phase: "JOINING",
          players: [[groveId, newUuid, false]],
          roles: [],
          startTime: new Date(),
        },
      });

      await prisma.game.update({
        where: { id: game.id },
        data: {
          users: {
            connect: { id: user.id },
          },
        },
      });

      return res.json({ newUuid });
    }
    res.status(400).json({ error: "Game already exists" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Join game
router.post("/join", async (req, res) => {
  try {
    const { gameId, groveId, address, username } = req.body;

    const game = await prisma.game.findUnique({
      where: { gameId },
      include: { users: true },
    });

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    const players = game.players;
    if (players.length >= NB_PLAYERS) {
      return res.status(400).json({ error: "Game is full" });
    }

    const state = await getState(groveId);
    if (state !== 0) throw new Error("state 0 is required");

    const newUuid = crypto.randomUUID();
    players.push([groveId, newUuid, false]);

    const user = await prisma.user.upsert({
      where: { address },
      update: {
        username: username || undefined,
        groveId: groveId,
      },
      create: {
        address,
        username: username || null,
        groveId,
      },
    });

    if (players.length === NB_PLAYERS) {
      await prisma.game.update({
        where: { id: game.id },
        data: {
          roles: assignRoles(NB_PLAYERS),
          phase: "NIGHT",
          players,
          users: {
            connect: { id: user.id },
          },
        },
      });
    } else {
      await prisma.game.update({
        where: { id: game.id },
        data: {
          players,
          users: {
            connect: { id: user.id },
          },
        },
      });
    }

    res.json({ newUuid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Game action
router.post("/action", async (req, res) => {
  try {
    const { gameId, groveId, uuid, action, targetGroveId } = req.body;

    const game = await prisma.game.findUnique({
      where: { gameId },
    });

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    const players = game.players;
    const playerIndex = players.findIndex((p) => p[0] === groveId);

    if (playerIndex === -1 || players[playerIndex][1] !== uuid) {
      return res.status(401).json({ error: "Invalid player" });
    }

    const playerRole = game.roles[playerIndex];
    let updateData = {};

    if (game.phase === "NIGHT") {
      const nightActions = game.nightActions || {};
      if (!nightActions[groveId]) {
        nightActions[groveId] = {};
      }

      switch (playerRole) {
        case ROLES.WOLF:
          if (action === "KILL" && targetGroveId) {
            nightActions[groveId].kill = targetGroveId;
          }
          break;
        case ROLES.DOCTOR:
          if (action === "HEAL" && targetGroveId) {
            nightActions[groveId].heal = targetGroveId;
          }
          break;
        case ROLES.DETECTIVE:
          if (action === "INVESTIGATE" && targetGroveId) {
            const targetIndex = players.findIndex(
              (p) => p[0] === targetGroveId
            );
            nightActions[groveId].investigate = {
              target: targetGroveId,
              role: game.roles[targetIndex],
            };
          }
          break;
      }
      updateData.nightActions = nightActions;
    } else if (game.phase === "DAY") {
      if (action === "VOTE" && targetGroveId) {
        const votes = game.votes || {};
        votes[groveId] = targetGroveId;
        updateData.votes = votes;
      }
    }

    await prisma.game.update({
      where: { id: game.id },
      data: updateData,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Game status
router.get("/status", async (req, res) => {
  try {
    const { gameId } = req.query;
    const game = await prisma.game.findUnique({
      where: { gameId },
    });

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json({
      phase: game.phase,
      players: game.players.length,
      timeLeft: game.startTime
        ? Math.max(
            0,
            GAME_DURATION -
              (Math.floor(Date.now() / 1000) -
                Math.floor(game.startTime.getTime() / 1000))
          )
        : null,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all live games
router.get("/live", async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      where: {
        phase: {
          in: ["JOINING", "NIGHT", "DAY"],
        },
      },
      include: {
        users: true,
      },
      orderBy: {
        startTime: "desc",
      },
    });

    const formattedGames = games.map((game) => ({
      gameId: game.gameId,
      players: game.players.length,
      maxPlayers: NB_PLAYERS,
      status: game.phase.toLowerCase(),
      createdAt: game.startTime,
    }));

    res.json({ games: formattedGames });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
