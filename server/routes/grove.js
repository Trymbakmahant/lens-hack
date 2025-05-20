const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Helper function to get game state
async function getState(groveId) {
  const url = "https://api.grove.storage/" + groveId;
  const res = await fetch(url);
  const data = await res.json();
  return data?.state;
}

// Check grove status
router.post("/check", async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    // Get user's groveId from database
    const user = await prisma.user.findUnique({
      where: { address },
      select: { groveId: true },
    });

    if (!user || !user.groveId) {
      return res.json({ hasGrove: false });
    }

    // Check grove state
    const state = await getState(user.groveId);

    return res.json({
      hasGrove: true,
      groveId: user.groveId,
      state: state,
    });
  } catch (error) {
    console.error("Error checking grove:", error);
    res.status(500).json({ error: "Failed to check grove status" });
  }
});

// Save grove ID
router.post("/save", async (req, res) => {
  try {
    const { address, groveId, username } = req.body;

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { address },
    });

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { address },
        data: {
          groveId,
          username,
        },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          address,
          groveId,
          username,
        },
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error saving grove:", error);
    res.status(500).json({ error: "Failed to save grove" });
  }
});

module.exports = router;
