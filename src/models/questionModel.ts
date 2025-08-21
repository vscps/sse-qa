import { getDB } from '../db/database'
import type { Question } from '../types/model'

// DTO
type NewQuestionData = {
  question: string
  sessionId: string
}

export const create = (questionData: NewQuestionData): Promise<Question> => {
  const { question, sessionId } = questionData
  const sql = `INSERT INTO question_entries (question, sessionId, numLikes, isAnswered, createdAt) VALUES (?, ?, 0, 0, datetime('now'));`
  const db = getDB()

  return new Promise((resolve, reject) => {
    db.run(
      sql,
      [question, sessionId],
      function (this: { lastID: number }, err: Error | null) {
        if (err) return reject(err)
        db.get(
          'SELECT * FROM question_entries WHERE id = ?',
          [this.lastID],
          (getErr: Error | null, row: Question) => {
            if (getErr) return reject(getErr)
            resolve(row)
          },
        )
      },
    )
  })
}

export const incrementUpvotes = (
  questionId: number,
): Promise<Question | null> => {
  const sql = `UPDATE question_entries SET numLikes = numLikes + 1 WHERE id = ?;`
  const db = getDB()

  return new Promise((resolve, reject) => {
    db.run(
      sql,
      [questionId],
      function (this: { changes: number }, err: Error | null) {
        if (err) return reject(err)
        if (this.changes === 0) return resolve(null)
        db.get(
          'SELECT * FROM question_entries WHERE id = ?',
          [questionId],
          (getErr: Error | null, row: Question) => {
            if (getErr) return reject(getErr)
            resolve(row)
          },
        )
      },
    )
  })
}

export const decrementUpvotes = (
  questionId: number,
): Promise<Question | null> => {
  const sql = `UPDATE question_entries SET numLikes = numLikes - 1 WHERE id = ? AND numLikes > 0;`
  const db = getDB()

  return new Promise((resolve, reject) => {
    db.run(
      sql,
      [questionId],
      function (this: { changes: number }, err: Error | null) {
        if (err) return reject(err)
        if (this.changes === 0) return resolve(null)
        db.get(
          'SELECT * FROM question_entries WHERE id = ?',
          [questionId],
          (getErr: Error | null, row: Question) => {
            if (getErr) return reject(getErr)
            resolve(row)
          },
        )
      },
    )
  })
}
