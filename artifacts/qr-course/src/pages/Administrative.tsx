import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "wouter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Layout } from "@/components/layout/Layout";
import { useAuth, useIsAdmin } from "@/auth";

interface Bucket {
  label: string;
  count: number;
}

interface AdminVisitsData {
  stats: {
    allTime: number;
    last24Hours: number;
    lastWeek: number;
    lastMonth: number;
    lastYear: number;
  };
  series: {
    last24Hours: Bucket[];
    lastWeek: Bucket[];
    lastMonth: Bucket[];
    lastYear: Bucket[];
    allTime: Bucket[];
  };
  visits: Array<{ id: number; email: string | null; visitedAt: string }>;
}

type Period = "last24Hours" | "lastWeek" | "lastMonth" | "lastYear" | "allTime";

const PERIOD_LABELS: Record<Period, string> = {
  last24Hours: "Last 24 Hours",
  lastWeek: "Last 7 Days",
  lastMonth: "Last 30 Days",
  lastYear: "Last Year",
  allTime: "All Time",
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 flex flex-col gap-1">
      <div className="text-3xl font-bold font-serif text-primary">{value.toLocaleString()}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export default function Administrative() {
  const { isLoading: authLoading } = useAuth();
  const { isAdmin } = useIsAdmin();
  const [period, setPeriod] = useState<Period>("last24Hours");

  const { data, isLoading, error } = useQuery<AdminVisitsData>({
    queryKey: ["admin-visits"],
    queryFn: async () => {
      const res = await fetch("/api/admin/visits");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json() as Promise<AdminVisitsData>;
    },
    enabled: isAdmin,
    staleTime: 60_000,
    refetchInterval: 2 * 60_000,
  });

  if (authLoading) return null;
  if (!isAdmin) return <Redirect to="/dashboard" />;

  const chartData = data?.series[period] ?? [];
  const maxCount = Math.max(...chartData.map((b) => b.count), 1);

  return (
    <Layout>
      <div className="p-8 max-w-6xl mx-auto w-full flex flex-col gap-8">

        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Administrative</h1>
          <p className="text-muted-foreground mt-1">Google login activity for this app.</p>
        </div>

        {isLoading && (
          <div className="text-sm text-muted-foreground">Loading…</div>
        )}

        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
            Failed to load data: {(error as Error).message}
          </div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard label="Last 24 Hours" value={data.stats.last24Hours} />
              <StatCard label="Last 7 Days" value={data.stats.lastWeek} />
              <StatCard label="Last 30 Days" value={data.stats.lastMonth} />
              <StatCard label="Last Year" value={data.stats.lastYear} />
              <StatCard label="All Time" value={data.stats.allTime} />
            </div>

            <div className="rounded-lg border border-border bg-card p-6 flex flex-col gap-5">
              <div className="flex flex-wrap gap-2">
                {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                      period === p
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    {PERIOD_LABELS[p]}
                  </button>
                ))}
              </div>

              <div className="h-56">
                {chartData.every((b) => b.count === 0) ? (
                  <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                    No logins in this period.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11 }}
                        interval="preserveStartEnd"
                        className="text-muted-foreground"
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11 }}
                        domain={[0, maxCount + 1]}
                        className="text-muted-foreground"
                      />
                      <Tooltip
                        formatter={(value: number) => [value, "Logins"]}
                        contentStyle={{
                          fontSize: 12,
                          borderRadius: 6,
                          border: "1px solid hsl(var(--border))",
                          background: "hsl(var(--card))",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        radius={[3, 3, 0, 0]}
                        fill="hsl(var(--primary))"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card flex flex-col">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-base">Login Log</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {data.visits.length} most recent login events
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/40">
                      <th className="px-6 py-3 text-left font-medium text-muted-foreground">#</th>
                      <th className="px-6 py-3 text-left font-medium text-muted-foreground">Gmail</th>
                      <th className="px-6 py-3 text-left font-medium text-muted-foreground">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.visits.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                          No logins recorded yet.
                        </td>
                      </tr>
                    )}
                    {data.visits.map((v, i) => (
                      <tr
                        key={v.id}
                        className="border-b border-border/50 last:border-0 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-6 py-3 text-muted-foreground tabular-nums">
                          {i + 1}
                        </td>
                        <td className="px-6 py-3 font-mono">
                          {v.email ?? "—"}
                        </td>
                        <td className="px-6 py-3 text-muted-foreground">
                          {new Date(v.visitedAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
