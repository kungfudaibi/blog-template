import { describe, expect, it } from "vitest";

import { loadDailyQuotes, selectDailyQuote } from "@/lib/daily-quote";

const quotes = [
  { text: "第一句。", sourceTitle: "极乐迪斯科", sourceUrl: "https://example.org/first", momentSlug: "disco-elysium" },
  { text: "第二句。", sourceTitle: "极乐迪斯科", sourceUrl: "https://example.org/second", momentSlug: "disco-elysium" },
];

describe("daily quote", () => {
  it("loads sourced work quotes independently of unwritten moment prose", () => {
    expect(loadDailyQuotes()).toEqual(expect.arrayContaining([
      expect.objectContaining({ sourceTitle: "极乐迪斯科", sourceUrl: expect.stringMatching(/^https:\/\//), momentSlug: "disco-elysium" }),
    ]));
  });

  it("returns null when no work quotes have been collected", () => {
    expect(selectDailyQuote([], new Date("2026-10-05T00:00:00Z"))).toBeNull();
  });

  it("keeps one sentence for the Shanghai day and rotates the next day", () => {
    const beforeMidnight = selectDailyQuote(quotes, new Date("2026-10-05T15:59:00Z"));
    const sameDay = selectDailyQuote(quotes, new Date("2026-10-05T00:00:00Z"));
    const nextDay = selectDailyQuote(quotes, new Date("2026-10-05T16:00:00Z"));

    expect(beforeMidnight).toEqual(sameDay);
    expect(beforeMidnight).toMatchObject({
      sourceTitle: "极乐迪斯科",
    });
    expect(nextDay?.text).not.toBe(beforeMidnight?.text);
  });
});
