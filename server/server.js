const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const http = require("http");
require("dotenv").config();
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8080;
const prisma = new PrismaClient();

// Import routes and WebSocket
const gameRoutes = require("./routes/game");
const groveRoutes = require("./routes/grove");
const userRoutes = require("./routes/user");
const setupChatWebSocket = require("./websocket/chat");
const setupGameWebSocket = require("./websocket/game");

// Setup WebSocket
const wss = new WebSocket.Server({ server });
setupChatWebSocket(wss);
setupGameWebSocket(wss);

// Game constants
const NB_PLAYERS = 4; // Minimum players needed
const GAME_DURATION = 60 * 5; // 5 minutes per phase
const ROLES = {
  WOLF: "wolf",
  DOCTOR: "doctor",
  DETECTIVE: "detective",
  VILLAGER: "villager",
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  // Always have 1 wolf
  roles.push(ROLES.WOLF);
  // Always have 1 doctor
  roles.push(ROLES.DOCTOR);
  // Always have 1 detective
  roles.push(ROLES.DETECTIVE);
  // Fill remaining slots with villagers
  for (let i = 3; i < playerCount; i++) {
    roles.push(ROLES.VILLAGER);
  }
  // Shuffle roles
  return roles.sort(() => Math.random() - 0.5);
}

// Use routes
app.use("/api/game", gameRoutes);
app.use("/api/grove", groveRoutes);
app.use("/api/user", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Database connection and server startup
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("Database connection successful");

    // Start server
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Start the server
startServer();
