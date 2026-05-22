import { useCryptoPrices } from "@/hooks/use-crypto-prices";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

function fmt(price: number): string {
  if (price >= 1000) return price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  if (price >= 1)    return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toFixed(4);
}

export function PriceTicker() {
  const { prices, loading, lastUpdated, error } = useCryptoPrices();

  const items = prices.length ? prices : [];
  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="w-full border-b border-border/50 bg-card/60 backdrop-blur overflow-hidden">
      <div className="flex items-center h-10">
        {/* LIVE badge */}
        <div className="shrink-0 flex items-center gap-1.5 px-4 border-r border-border/50 h-full bg-primary/10">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-bold text-primary tracking-widest">LIVE</span>
        </div>

        {/* Scrolling prices */}
        <div className="relative flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center gap-2 px-4 h-10 text-xs text-muted-foreground">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Loading prices…
            </div>
          ) : (
            <div
              className="flex items-center gap-0 whitespace-nowrap animate-ticker"
              style={{ width: "max-content" }}
            >
              {doubled.map((coin, idx) => {
                const up = coin.change24h >= 0;
                return (
                  <div key={`${coin.id}-${idx}`} className="inline-flex items-center gap-2 px-5 h-10 border-r border-border/30">
                    <span className="text-xs font-bold text-foreground">{coin.symbol}</span>
                    <span className="text-xs font-mono text-foreground">${fmt(coin.price)}</span>
                    <span className={`text-xs font-medium flex items-center gap-0.5 ${up ? "text-emerald-500" : "text-red-400"}`}>
                      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {up ? "+" : ""}{coin.change24h.toFixed(2)}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Updated time */}
        {lastUpdated && (
          <div className="shrink-0 px-3 border-l border-border/40 h-full flex items-center">
            <span className="text-[10px] text-muted-foreground/60 hidden md:block">
              {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
        )}
        {error && (
          <div className="shrink-0 px-3 border-l border-border/40 h-full flex items-center">
            <span className="text-[10px] text-amber-500/80 hidden md:block">Cached</span>
          </div>
        )}
      </div>
    </div>
  );
}
