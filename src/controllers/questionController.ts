import { Request, Response } from 'express'
import { create } from '../models/questionModel'
import * as QuestionModel from '../models/questionModel'

// Create a new question
export const createQuestion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { sessionId } = req.params
    const { question } = req.body
    const newQuestion = await create({ question, sessionId })
    res.status(201).json(newQuestion)
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error.' })
  }
}

// Upvote a question
export const upvoteQuestion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const questionId = parseInt(req.params.questionId, 10)
    if (isNaN(questionId)) {
      res.status(400).json({ error: 'Question ID must be a valid number.' })
      return
    }

    const updatedQuestion = await QuestionModel.incrementUpvotes(questionId)
    if (!updatedQuestion) {
      res
        .status(404)
        .json({ error: `Question with ID '${questionId}' not found.` })
      return
    }

    res.status(200).json(updatedQuestion)
  } catch (error) {
    console.error('Error upvoting question:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}

// Remove an upvote from a question
export const removeUpvote = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const questionId = parseInt(req.params.questionId, 10)
    if (isNaN(questionId)) {
      res.status(400).json({ error: 'Question ID must be a valid number.' })
      return
    }

    const updatedQuestion = await QuestionModel.decrementUpvotes(questionId)
    if (!updatedQuestion) {
      res.status(404).json({
        error: `Question with ID '${questionId}' not found or already has 0 votes.`,
      })
      return
    }

    res.status(200).json(updatedQuestion)
  } catch (error) {
    console.error('Error removing upvote:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}
