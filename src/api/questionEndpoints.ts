import { Router, Request, Response } from 'express'
import {
  createQuestion,
  upvoteQuestion,
  removeUpvote,
} from '../controllers/questionController'

const router = Router()

interface Question {
  id: number
  question: string
  numLikes: number
  isAnswered: boolean
  createdAt: string
  sessionId: string
}

// Mock questions data
let questions: Question[] = [
  {
    id: 1,
    question: 'What is Server-Sent Events?',
    numLikes: 5,
    isAnswered: false,
    createdAt: '2025-08-20T10:00:00Z',
    sessionId: 'session-1',
  },
  {
    id: 2,
    question: 'How to scale a PostgreSQL database?',
    numLikes: 3,
    isAnswered: true,
    createdAt: '2025-08-20T11:00:00Z',
    sessionId: 'session-1',
  },
  {
    id: 3,
    question: 'What legal structure should a startup choose?',
    numLikes: 7,
    isAnswered: false,
    createdAt: '2025-08-19T15:30:00Z',
    sessionId: 'session-2',
  },
]

// GET all questions and filter optionally by sessionID if sessionID is present as a query
router.get('/', (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string
  if (sessionId) {
    const activeSessionQuestions = questions.filter(
      (question) => question.sessionId === sessionId,
    )
    return res.json(activeSessionQuestions)
  }
  res.json(questions)
})

// Create a new question with sessionId in URL
router.post('/:sessionId', createQuestion)

// Upvote a question
router.patch('/:questionId/upvote', upvoteQuestion)

// Remove upvote from a question
router.patch('/:questionId/downvote', removeUpvote)

  if (!question) {
    return res.status(404).json({ error: 'Question not found' })
  }

  res.json(question)
})

// PATCH to update likes or answered status
router.patch('/:id', (req: Request, res: Response) => {
  const { id } = req.params
  const { numLikes, isAnswered } = req.body as {
    numLikes: number
    isAnswered: boolean
  }

  const question = questions.find((question) => question.id === parseInt(id))
  if (!question) {
    return res.status(404).json({ error: 'Question not found' })
  }

  question.numLikes = numLikes
  question.isAnswered = isAnswered

  res.json(question)
})

export default router
