import { db } from "@workspace/db";
import { usersTable, visitsTable } from "@workspace/db";
import { eq, desc, gte } from "drizzle-orm";

type User = typeof usersTable.$inferSelect;
type Visit = typeof visitsTable.$inferSelect;

export const storage = {
  async getUserById(id: number): Promise<User | null> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return user ?? null;
  },

  async getUserByGoogleId(googleId: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.googleId, googleId));
    return user ?? null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return user ?? null;
  },

  async createUserWithGoogle(data: {
    username: string;
    googleId: string;
    email: string | null;
    displayName: string | null;
  }): Promise<User> {
    const [user] = await db.insert(usersTable).values(data).returning();
    return user!;
  },

  async updateUserGoogle(
    id: number,
    data: { googleId?: string; displayName?: string | null },
  ): Promise<User> {
    const [user] = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning();
    return user!;
  },

  async recordVisit(userId: number, email: string | null): Promise<void> {
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
