import { db } from "./db";
import { scores, type Score, type InsertScore } from "@shared/schema";
import { desc } from "drizzle-orm";

export interface IStorage {
  getTopScores(limit?: number): Promise<Score[]>;
  createScore(score: InsertScore): Promise<Score>;
}

export class DatabaseStorage implements IStorage {
  async getTopScores(limit: number = 10): Promise<Score[]> {
    return await db.select().from(scores).orderBy(desc(scores.score)).limit(limit);
  }

  async createScore(score: InsertScore): Promise<Score> {
    const [inserted] = await db.insert(scores).values(score).returning();
    return inserted;
  }
}

export const storage = new DatabaseStorage();