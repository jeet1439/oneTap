import express from 'express';
import cors from 'cors';
import prisma from './lib/prisma.js';


const app = express();
app.use(cors());
app.use(express.json());


app.get("/test-db", async (req, res) => {
  try {
    await prisma.$connect();

    res.json({
      success: true,
      message: "Database connected successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

export default app;