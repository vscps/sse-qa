require("dotenv").config();

import express, { NextFunction } from "express";
import cors from "cors";
import questionEndpoints from "./api/questionEndpoints";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.use("/questions", questionEndpoints);

app.get("/", (req, res) => {
  res.send("Hello World! 1234");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(
    `Open http://localhost:${PORT} in your browser to see SSE in action.`
  );
});
