require('dotenv').config();

import express, { NextFunction } from 'express';
import cors from 'cors';
import { closeDB, connectDB } from './db/database';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// connect to sqlite db
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Open http://localhost:${PORT} in your browser.`);
  });
})
.catch((error: Error) => {
  console.error("Failed to start Databaseserver");
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Closing database connection...");
  await closeDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing database connection...");
  await closeDB();
  process.exit(0);
});







