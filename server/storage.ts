import { db } from "./db";
import { scores, type Score, type InsertScore } from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  getTopScores(mode?: string, limit?: number): Promise<Score[]>;
  createScore(score: InsertScore): Promise<Score>;
}

export class DatabaseStorage implements IStorage {
  async getTopScores(mode?: string, limit: number = 10): Promise<Score[]> {
    let query = db.select().from(scores);
    if (mode) {
      query = query.where(eq(scores.mode, mode)) as any;
    }
    return await query.orderBy(desc(scores.score)).limit(limit);
  }

  async createScore(score: InsertScore): Promise<Score> {
    const [inserted] = await db.insert(scores).values(score).returning();
    return inserted;
  }
}

export const storage = new DatabaseStorage();