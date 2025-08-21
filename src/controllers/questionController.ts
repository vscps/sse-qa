import { Request, Response } from 'express'
import { create } from '../models/questionModel'

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
