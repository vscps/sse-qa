import { Router, Request, Response } from "express";

const router = Router();

interface Session {
  sessionId: string;
  title: string;
  description: string;
}

// Mock sessions data
const sessions: Session[] = [
  {
    sessionId: "hjfaj",
    title: "Tech Q&A Live",
    description: "Ask anything about software development",
  },
  {
    sessionId: "hughis8353",
    title: "Startup Advice",
    description: "Questions about starting your own company",
  },
];

// Create a new session (POST)
router.post("/", (req: Request, res: Response) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required." });
  }

  const sessionId = req.query.sessionId as string;

  const newSession: Session = {
    sessionId: sessionId,
    title,
    description,
  };

  sessions.push(newSession);
  res.status(201).json(newSession);
});

// Get all sessions
router.get("/", (req: Request, res: Response) => {
  res.json(sessions);
});

// Get session by ID
router.get("/:sessionId", (req: Request, res: Response) => {
  const id = req.params.sessionId;
  const session = sessions.find((session) => session.sessionId === id);

  if (!session) {
    return res.status(404).json({ message: "Session not found." });
  }

  res.json(session);
});

export default router;
