import db from '../config/db'
import type { Question } from '../types/model'

// DTO
type NewQuestionData = {
  question: string
  sessionId: string
}

export const create = (questionData: NewQuestionData): Promise<Question> => {
  const { question, sessionId } = questionData
  const sql = `INSERT INTO questions (question, session_id) VALUES (?, ?);`

  return new Promise((resolve, reject) => {
    db.run(
      sql,
      [question, sessionId],
      function (this: { lastID: number }, err: Error | null) {
        if (err) return reject(err)
        db.get(
          'SELECT * FROM questions WHERE id = ?',
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
  const sql = `UPDATE questions SET upvotes = upvotes + 1 WHERE id = ?;`

  return new Promise((resolve, reject) => {
    db.run(
      sql,
      [questionId],
      function (this: { changes: number }, err: Error | null) {
        if (err) return reject(err)
        if (this.changes === 0) return resolve(null)
        db.get(
          'SELECT * FROM questions WHERE id = ?',
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
  const sql = `UPDATE questions SET upvotes = upvotes - 1 WHERE id = ? AND upvotes > 0;`

  return new Promise((resolve, reject) => {
    db.run(
      sql,
      [questionId],
      function (this: { changes: number }, err: Error | null) {
        if (err) return reject(err)
        if (this.changes === 0) return resolve(null)
        db.get(
          'SELECT * FROM questions WHERE id = ?',
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
