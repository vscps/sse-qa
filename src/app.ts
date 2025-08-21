require("dotenv").config();

import express, { NextFunction } from "express";
import cors from "cors";
import questionEndpoints from "./api/questionEndpoints";
import sessionEndpoints from "./api/sessionEndpoints";
import { closeDB, connectDB } from "./db/database";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use("/questions", questionEndpoints);
app.use("/sessions", sessionEndpoints);

// connect to sqlite db
connectDB().then(() => {
  app.get("/updates", (req, res) => {
    // Set necessary headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow cross-origin requests

    let counter = 0;

    // Function to send events
    const sendEvent = () => {
      counter++;
      const message = `Server sent message ${counter} at ${new Date().toLocaleTimeString()}`;

      // SSE data format: data: [your_message]\n\n
      res.write(`data: ${message}\n\n`);
      console.log(`Sent: ${message}`);
    };

    // Send an event every 3 seconds
    const intervalId = setInterval(sendEvent, 3000);

    // Clean up when the client disconnects
    req.on("close", () => {
      clearInterval(intervalId); // Stop sending events to this client
      console.log("Client disconnected. Stopped sending events.");
      res.end(); // End the response
    });
  });

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
