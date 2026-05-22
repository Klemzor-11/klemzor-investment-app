import { useState, useEffect, useCallback } from "react";

export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

const COINS = [
  { id: "bitcoin",      symbol: "BTC",  name: "Bitcoin"  },
  { id: "ethereum",     symbol: "ETH",  name: "Ethereum" },
  { id: "tether",       symbol: "USDT", name: "Tether"   },
  { id: "binancecoin",  symbol: "BNB",  name: "BNB"      },
  { id: "solana",       symbol: "SOL",  name: "Solana"   },
  { id: "ripple",       symbol: "XRP",  name: "XRP"      },
];

const CACHE_KEY = "trustchain_price_cache";
const CACHE_TTL = 30_000; // 30 seconds

interface CacheEntry { prices: CoinPrice[]; ts: number }

function readCache(): CoinPrice[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { prices, ts } = JSON.parse(raw) as CacheEntry;
    if (Date.now() - ts < CACHE_TTL) return prices;
  } catch { /* ignore */ }
  return null;
}

function writeCache(prices: CoinPrice[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ prices, ts: Date.now() }));
  } catch { /* ignore */ }
}

// Sensible fallback prices shown when API is unavailable
const FALLBACK: CoinPrice[] = [
  { id: "bitcoin",     symbol: "BTC",  name: "Bitcoin",  price: 67420,  change24h:  1.24 },
  { id: "ethereum",    symbol: "ETH",  name: "Ethereum", price: 3512,   change24h:  0.87 },
  { id: "tether",      symbol: "USDT", name: "Tether",   price: 1.0,    change24h:  0.01 },
  { id: "binancecoin", symbol: "BNB",  name: "BNB",      price: 598,    change24h: -0.43 },
  { id: "solana",      symbol: "SOL",  name: "Solana",   price: 174,    change24h:  2.11 },
  { id: "ripple",      symbol: "XRP",  name: "XRP",      price: 0.521,  change24h: -0.65 },
];

export function useCryptoPrices() {
  const [prices, setPrices] = useState<CoinPrice[]>(() => readCache() ?? FALLBACK);
  const [loading, setLoading] = useState(() => !readCache());
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState(false);

  const fetchPrices = useCallback(async () => {
    const cached = readCache();
    if (cached) { setPrices(cached); return; }

    try {
      const ids = COINS.map((c) => c.id).join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
        { signal: AbortSignal.timeout(8000) }
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const result: CoinPrice[] = COINS.map((coin) => ({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        price: data[coin.id]?.usd ?? 0,
        change24h: data[coin.id]?.usd_24h_change ?? 0,
      }));
      writeCache(result);
      setPrices(result);
      setLastUpdated(new Date());
      setError(false);
    } catch {
      setError(true);
      // Keep whatever prices we have; fall back to defaults if empty
      setPrices((prev) => (prev.length ? prev : FALLBACK));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const id = setInterval(fetchPrices, CACHE_TTL);
    return () => clearInterval(id);
  }, [fetchPrices]);

  return { prices, loading, lastUpdated, error, refetch: fetchPrices };
}
