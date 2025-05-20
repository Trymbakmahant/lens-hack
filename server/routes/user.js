const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create user
router.post("/create", async (req, res) => {
  try {
    const { address, groveId, username, avatar } = req.body;

    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    if (!groveId) {
      return res.status(400).json({ error: "Grove ID is required" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { address },
    });

    if (existingUser) {
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { address },
        data: {
          username: username || existingUser.username,
          groveId: groveId || existingUser.groveId,
          avatar: avatar || "http://localhost:3000/lens.jpeg",
        },
      });
      return res.json({ success: true, user: updatedUser });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        address,
        username: username || null,
        groveId,
        avatar: avatar || "http://localhost:3000/lens.jpeg",
      },
    });

    res.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

module.exports = router;
