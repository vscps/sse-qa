import sqlite3 from "sqlite3";
import path from "path";

const dbInstance = sqlite3.verbose();

const DB_FILE = path.join(__dirname, "../../live_ask.db");

let db: sqlite3.Database | null = null;

export function connectDB(): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    db = new dbInstance.Database(
      DB_FILE,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err: Error | null) => {
        if (err) {
          console.error("Error connecting to database:", err.message);
          reject(err);
        } else {
          console.log("Connected to the SQLite database.");
          db!.run(
            `
                    CREATE TABLE IF NOT EXISTS question_entries (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        sessionId TEXT NOT NULL,
                        question TEXT NOT NULL,
                        numLikes INTEGER NOT NULL,
                        isAnswered BOOLEAN NOT NULL,
                        createdAt TEXT NOT NULL
                    )
                `,
            (createErr: Error | null) => {
              if (createErr) {
                console.error("Error creating table question_entries.", createErr.message);
                reject(createErr);
              } else {
                console.log("Table question_entries checked/created.");
                resolve(db as sqlite3.Database);
              }
            }
          );
          db!.run(
            `
                    CREATE TABLE IF NOT EXISTS session_info (
                        sessionId TEXT PRIMERY KEY NOT NULL,
                        title TEXT NOT NULL,
                        description TEXT NOT NULL
                    )
                `,
            (createErr: Error | null) => {
              if (createErr) {
                console.error("Error creating table session_info:", createErr.message);
                reject(createErr);
              } else {
                console.log("Table session_info checked/created.");
                resolve(db as sqlite3.Database);
              }
            }
          );
        }
      }
    );
  });
}

export function getDB(): sqlite3.Database {
  if (!db) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return db;
}

export function closeDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err: Error | null) => {
        if (err) {
          console.error("Error closing database:", err.message);
          reject(err);
        } else {
          console.log("Database connection closed.");
          db = null;
          resolve();
        }
      });
    } else {
      console.log("No database connection to close.");
      resolve();
    }
  });
}