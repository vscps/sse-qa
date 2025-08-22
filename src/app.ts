require("dotenv").config();

import express, { NextFunction } from "express";
import cors from "cors";
import questionEndpoints from "./api/questionEndpoints";
import sessionEndpoints from "./api/sessionEndpoints";
import { closeDB, connectDB } from "./db/database";
import { eventsHandler, testSSE } from "./sse/server";

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use("/questions", questionEndpoints);
app.use("/sessions", sessionEndpoints);

// connect to sqlite db
connectDB().then(() => {
  
  app.get('/events', eventsHandler);

  // only for testing SSE, can be removed later
  // app.post('/test', testSSE);

  app.listen(PORT, () => {
    console.log(`Open http://localhost:${PORT} in your browser.`);
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
});
