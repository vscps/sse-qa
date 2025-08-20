import { Router, Request, Response } from "express";

const router = Router();

interface Session {
  id: string;
  title: string;
  description: string;
}

interface Question {
  id: string;
  question: string;
  num_likes: number;
  is_answered: boolean;
  created_at: string;
  session_id: string;
}

// Mock sessions data
const sessions: Session[] = [
  {
    id: "session-1",
    title: "Tech Q&A Live",
    description: "Ask anything about software development",
  },
  {
    id: "session-2",
    title: "Startup Advice",
    description: "Questions about starting your own company",
  },
];

// Mock questions data
let questions: Question[] = [
  {
    id: "q1",
    question: "What is Server-Sent Events?",
    num_likes: 5,
    is_answered: false,
    created_at: "2025-08-20T10:00:00Z",
    session_id: "session-1",
  },
  {
    id: "q2",
    question: "How to scale a PostgreSQL database?",
    num_likes: 3,
    is_answered: true,
    created_at: "2025-08-20T11:00:00Z",
    session_id: "session-1",
  },
  {
    id: "q3",
    question: "What legal structure should a startup choose?",
    num_likes: 7,
    is_answered: false,
    created_at: "2025-08-19T15:30:00Z",
    session_id: "session-2",
  },
];

// GET all questions and filter optionally by sessionID if sessionID is present as a query
router.get("/", (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;
  if (sessionId) {
    const activeSessionQuestions = questions.filter(
      (q) => q.session_id === sessionId
    );
    return res.json(activeSessionQuestions);
  }
  res.json(questions);
});
