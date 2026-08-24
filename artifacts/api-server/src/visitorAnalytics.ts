import type { Express } from "express";
import { storage } from "./lib/storage";
import { logger } from "./lib/logger";

export function setupVisitorAnalytics(app: Express) {
  app.post("/api/visitor/record", async (_req, res) => {
    try {
      await storage.recordVisit(null, null);
      res.status(201).json({ success: true });
    } catch (error) {
      logger.error({ err: error }, "Failed to record visitor event");
      res.status(500).json({ error: "Failed to record visitor event" });
    }
  });

  app.get("/api/admin/visits", async (_req, res) => {
    try {
      const now = Date.now();
      const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
      const yearAgo = new Date(now - 365 * 24 * 60 * 60 * 1000);

      const [visitList, allTimestamps] = await Promise.all([
        storage.getVisits(500),
        storage.getVisitTimestampsSince(null),
      ]);

      const times = allTimestamps.map((timestamp) => new Date(timestamp).getTime());
      const stats = {
        allTime: times.length,
        last24Hours: times.filter((time) => time >= dayAgo.getTime()).length,
        lastWeek: times.filter((time) => time >= weekAgo.getTime()).length,
        lastMonth: times.filter((time) => time >= monthAgo.getTime()).length,
        lastYear: times.filter((time) => time >= yearAgo.getTime()).length,
      };

      const buildSeries = (
        start: number,
        bucketMs: number,
        buckets: number,
        labelFn: (date: Date) => string,
      ) => {
        const counts = new Array(buckets).fill(0);
        for (const time of times) {
          if (time >= start) {
            const index = Math.min(
              Math.floor((time - start) / bucketMs),
              buckets - 1,
            );
            counts[index]++;
          }
        }

        return counts.map((count, index) => ({
          label: labelFn(new Date(start + index * bucketMs)),
          count,
        }));
      };

      const HOUR = 60 * 60 * 1000;
      const DAY = 24 * HOUR;
      const series = {
        last24Hours: buildSeries(
          now - 24 * HOUR,
          HOUR,
          24,
          (date) => date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
        ),
        lastWeek: buildSeries(
          now - 7 * DAY,
          DAY,
          7,
          (date) =>
            date.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
        ),
        lastMonth: buildSeries(
          now - 30 * DAY,
          DAY,
          30,
          (date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        ),
        lastYear: buildSeries(
          now - 365 * DAY,
          (365 / 12) * DAY,
          12,
          (date) =>
            date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        ),
        allTime: (() => {
          const earliest = times.length ? Math.min(...times) : now;
          const span = Math.max(now - earliest, DAY);
          const buckets = Math.min(24, Math.max(6, Math.ceil(span / (30 * DAY))));
          return buildSeries(
            earliest,
            span / buckets,
            buckets,
            (date) =>
              date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "2-digit",
              }),
          );
        })(),
      };

      res.json({
        stats,
        series,
        visits: visitList.map((visit) => ({
          id: visit.id,
          email: visit.email,
          visitedAt: visit.visitedAt,
        })),
      });
    } catch (error) {
      logger.error({ err: error }, "Visitor analytics error");
      res.status(500).json({ error: "Failed to load visitor data" });
    }
  });
}