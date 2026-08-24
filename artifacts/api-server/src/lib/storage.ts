import { db } from "@workspace/db";
import { visitsTable } from "@workspace/db";
import { desc, gte } from "drizzle-orm";

type Visit = typeof visitsTable.$inferSelect;

export const storage = {
  async recordVisit(userId: number | null, email: string | null): Promise<void> {
    await db.insert(visitsTable).values({ userId, email });
  },

  async getVisits(limit: number): Promise<Visit[]> {
    return db
      .select()
      .from(visitsTable)
      .orderBy(desc(visitsTable.visitedAt))
      .limit(limit);
  },

  async getVisitTimestampsSince(since: Date | null): Promise<string[]> {
    const rows = since
      ? await db
          .select({ visitedAt: visitsTable.visitedAt })
          .from(visitsTable)
          .where(gte(visitsTable.visitedAt, since))
      : await db.select({ visitedAt: visitsTable.visitedAt }).from(visitsTable);
    return rows.map((r) => r.visitedAt.toISOString());
  },
};
