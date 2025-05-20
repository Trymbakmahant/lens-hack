const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

async function testConnection() {
  const prisma = new PrismaClient();

  try {
    // Try to connect to the database
    await prisma.$connect();
    console.log("Successfully connected to the database!");

    // Try a simple query
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log("Query result:", result);
  } catch (error) {
    console.error("Connection error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
