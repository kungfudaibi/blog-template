import { z } from "zod";

import dailyQuotes from "@/content/daily-quotes.json";

const workQuoteSchema = z.object({
  text: z.string().trim().min(1).max(220),
  sourceTitle: z.string().trim().min(1).max(100),
  sourceUrl: z.url().startsWith("https://"),
  momentSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
}).strict();

export type WorkQuote = z.infer<typeof workQuoteSchema>;

export type SelectedDailyQuote = WorkQuote;

export function loadDailyQuotes(): WorkQuote[] {
  return z.array(workQuoteSchema).parse(dailyQuotes);
}

function shanghaiDayNumber(now: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return Math.floor(
    Date.UTC(Number(value.year), Number(value.month) - 1, Number(value.day)) / 86400000,
  );
}

export function selectDailyQuote(
  quotes: WorkQuote[],
  now: Date = new Date(),
): SelectedDailyQuote | null {
  if (quotes.length === 0) return null;
  return quotes[shanghaiDayNumber(now) % quotes.length];
}
