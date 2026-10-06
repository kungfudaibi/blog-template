import Link from "next/link";

import type { SelectedDailyQuote } from "@/lib/daily-quote";

type DailyQuoteProps = {
  quote: SelectedDailyQuote | null;
};

export function DailyQuote({ quote }: DailyQuoteProps) {
  return (
    <section className="daily-quote" aria-labelledby="daily-quote-title">
      <h2 id="daily-quote-title">每日一言</h2>
      {quote ? (
        <blockquote>
          <p>{quote.text}</p>
          <footer>
            摘自 <Link href={`/moments/${quote.momentSlug}`}>{quote.sourceTitle}</Link>
            {" · "}<a href={quote.sourceUrl} target="_blank" rel="noopener noreferrer">出处</a>
          </footer>
        </blockquote>
      ) : (
        <p className="daily-quote__empty">还没有选好的句子。</p>
      )}
    </section>
  );
}
