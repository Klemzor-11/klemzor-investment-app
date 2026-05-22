import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: number;
  from: "user" | "bot";
  text: string;
  time: string;
  quickReplies?: string[];
};

const BOT_NAME = "Aria";

const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// ─── Response bank ────────────────────────────────────────────────────────────
// Each entry has multiple reply variants (rotated) + optional quick-reply chips
interface Flow {
  triggers: string[];
  replies: string[];
  quickReplies?: string[];
  context: string;
}

const FLOWS: Flow[] = [
  {
    context: "greeting",
    triggers: ["hello", "hi", "hey", "good morning", "good evening", "good afternoon", "sup", "howdy", "bonjour", "hola", "hallo", "こんにちは", "你好", "مرحبا", "olá"],
    replies: [
      "Hello! Welcome to TrustChainFX. I'm Aria, your investment assistant. How can I help you today?",
      "Hey there! Great to see you. Whether it's packages, yields, security, or deposits — I'm here. What can I help with?",
      "Hi! I'm Aria. Ask me anything about TrustChainFX — from how to get started to how withdrawals work.",
    ],
    quickReplies: ["Tell me about packages", "How do I start?", "What's the minimum?"],
  },
  {
    context: "packages",
    triggers: ["package", "plan", "tier", "option", "starter", "growth", "premium", "which plan", "best plan", "compare", "tiers"],
    replies: [
      "We have three tiers:\n• **Starter** — from $50 | 8% monthly ROI | 30-day lock\n• **Growth** — from $200 | 14% monthly ROI | 60-day lock ⭐ Most popular\n• **Premium** — from $1,000 | 22% monthly ROI | 90-day lock\n\nWhich one interests you most?",
      "Our packages are designed for every level:\n• **Starter ($50+)** — perfect for testing the waters at 8% monthly\n• **Growth ($200+)** — our most popular: 14% monthly ROI\n• **Premium ($1,000+)** — institutional-grade at 22% monthly\n\nWant me to break down any one in detail?",
    ],
    quickReplies: ["Tell me about Growth", "What's the Premium lock period?", "How do I invest?"],
  },
  {
    context: "starter",
    triggers: ["starter", "fifty", "$50", "50 dollar", "entry", "beginner", "new investor", "just starting"],
    replies: [
      "The Starter package is designed for new investors. Starting from just **$50**, you earn **8% monthly ROI** with a 30-day lock period. It includes daily compounding and standard algorithmic execution. It's a great way to experience real yields before scaling up.",
      "Starter is our entry-level tier: $50 minimum, 8% monthly ROI, 30-day lock. Zero management fees. Funds compound daily. Many of our premium investors started here — it's the best way to verify our platform before deploying more capital.",
    ],
    quickReplies: ["How do withdrawals work?", "Can I upgrade later?", "Tell me about Growth"],
  },
  {
    context: "growth",
    triggers: ["growth", "200", "$200", "mid", "middle", "popular", "hft", "high frequency"],
    replies: [
      "Growth is our most popular package for good reason. From **$200**, you earn **14% monthly ROI** over a 60-day lock. You get advanced HFT (high-frequency trading) model access, priority support, weekly distributions, and dedicated dashboard insights.",
      "The Growth tier sits at $200 minimum with **14% monthly returns**. It uses our most battle-tested HFT algorithms. The 60-day lock exists to allow the strategies to run full cycles — after that, withdrawals are standard.",
    ],
    quickReplies: ["What's the Premium tier?", "Explain withdrawals", "Can I deposit more later?"],
  },
  {
    context: "premium",
    triggers: ["premium", "1000", "$1000", "vip", "institutional", "high capital", "bespoke", "dedicated manager"],
    replies: [
      "Premium is our flagship tier for serious investors. Starting at **$1,000**, you earn **22% monthly ROI** with a 90-day lock. You get a dedicated investment manager, bespoke strategy allocation, instant withdrawals after the lock period, and early access to new features.",
      "Premium unlocks institutional-grade access: $1,000 minimum, **22% monthly**, 90-day lock. A dedicated account manager monitors your portfolio personally. Post-lock withdrawals are instant — no waiting period. It also includes a 1% performance fee on profits only, never on principal.",
    ],
    quickReplies: ["What's the 1% fee?", "What is a dedicated manager?", "How do I upgrade?"],
  },
  {
    context: "roi",
    triggers: ["roi", "return", "yield", "profit", "interest", "earn", "how much", "percentage", "percent", "%", "make money", "gains"],
    replies: [
      "Monthly ROI ranges by tier:\n• Starter: **8% / month**\n• Growth: **14% / month**\n• Premium: **22% / month**\n\nThese are generated algorithmically — not market-dependent. Our calculator at /calculator shows exact projections for any amount.",
      "Our yields run 8–22% per month depending on your tier. Returns come from algorithmic HFT strategies, not market speculation. On $1,000 in Growth, that's **$140/month** — compounding over 6 months becomes ~$2,192 in profit.",
    ],
    quickReplies: ["Open the calculator", "Are returns guaranteed?", "Tell me about compounding"],
  },
  {
    context: "withdraw",
    triggers: ["withdraw", "withdrawal", "cash out", "pull out", "take out", "get money", "access funds", "when can i", "unlock"],
    replies: [
      "Withdrawals unlock after your lock period:\n• Starter: **30 days**\n• Growth: **60 days**\n• Premium: **90 days** (then instant)\n\nOnce your lock ends, request a withdrawal from your dashboard. Processing takes up to 24 hours. Funds arrive in USDT (TRC20) to your wallet.",
      "After your lock period, withdrawals are processed within 24 hours. Go to your Dashboard → click **Withdraw** → enter your USDT TRC20 address and amount. The minimum withdrawal is $10. Premium users get instant processing post-lock.",
    ],
    quickReplies: ["What if I need funds early?", "What wallet do you support?", "Tell me about fees"],
  },
  {
    context: "deposit",
    triggers: ["deposit", "fund", "add money", "top up", "send crypto", "usdt", "trc20", "how to pay", "payment", "send funds"],
    replies: [
      "Deposits are made via **USDT (TRC20)**. Go to your Dashboard → click **Deposit** → copy our wallet address → send your USDT from any TRC20-compatible wallet. Your balance updates once the TRON network confirms (usually under 10 minutes).",
      "We accept **USDT on TRON (TRC20)** — low fees, fast settlement. From your dashboard, click Deposit, copy the wallet address, and send from Binance, Trust Wallet, or any TRC20 wallet. Bitcoin, ETH and BNB support are coming soon.",
    ],
    quickReplies: ["What's the wallet address?", "How long does it take?", "What's the minimum?"],
  },
  {
    context: "security",
    triggers: ["secure", "security", "safe", "trust", "hack", "protect", "encrypt", "cold storage", "multisig", "2fa", "mfa"],
    replies: [
      "TrustChainFX uses institutional-grade security:\n• **256-bit AES encryption** for stored data\n• **Cold-storage multi-signature wallets** — never hot\n• **Real-time fraud monitoring** 24/7\n• **TLS 1.3** for all data in transit\n\nNo single person can access funds — multi-sig requires multiple key holders.",
      "Security is our first principle. All funds live in cold-storage multi-sig vaults — no single point of failure. We use AES-256 encryption, real-time anomaly detection, and mandatory 2FA above $5,000 investments. We've never had a security breach.",
    ],
    quickReplies: ["Tell me about KYC", "How is my data used?", "What's cold storage?"],
  },
  {
    context: "fees",
    triggers: ["fee", "fees", "charge", "cost", "commission", "management fee", "how much does it cost"],
    replies: [
      "Fees are simple and transparent:\n• **Starter & Growth**: Zero management fees\n• **Premium**: 1% performance fee on profits only — never on your principal\n• **Withdrawal fee**: ~$1 network fee (TRON gas)\n\nNo hidden charges, ever.",
      "We keep fees minimal. Starter and Growth have **zero fees**. Premium has a 1% performance fee — only on the profit we generate for you, not your capital. Withdrawal fees are just the ~$1 TRON network gas fee.",
    ],
    quickReplies: ["Tell me about Premium", "What's the min deposit?", "How do withdrawals work?"],
  },
  {
    context: "kyc",
    triggers: ["kyc", "verify", "verification", "id", "identity", "document", "passport", "know your customer"],
    replies: [
      "KYC is only required for investments **above $5,000**. The process takes under 10 minutes and needs a government-issued ID (passport or driver's license). Investments under $5,000 can be deployed immediately after account creation — no documents needed.",
      "We require KYC for amounts over $5,000 — it's a regulatory requirement and protects all our users. Under $5,000, you can invest immediately after signing up. KYC verification is done securely and your documents are never stored longer than legally required.",
    ],
    quickReplies: ["Tell me about security", "What's the minimum?", "How do I start?"],
  },
  {
    context: "referral",
    triggers: ["referral", "refer", "invite", "share", "friend", "bonus", "affiliate", "earn more", "extra income"],
    replies: [
      "Our referral program lets you earn **$25 per person** you refer! Share your unique link — when they sign up and activate their first investment, the bonus is credited to your balance. Visit the **Referral** section in your dashboard to get your link.",
      "Refer a friend, earn $25. Every person who signs up using your referral link earns you a $25 credit when they make their first investment. There's no limit to how many people you can refer. Find your unique link in your dashboard under the Referral tab.",
    ],
    quickReplies: ["How do I get my link?", "When is the bonus paid?", "Is there a limit?"],
  },
  {
    context: "crypto_prices",
    triggers: ["bitcoin", "btc", "ethereum", "eth", "price", "market", "crypto", "bnb", "solana", "sol", "xrp", "ripple", "usdt"],
    replies: [
      "Our platform tracks live crypto prices — check the price ticker on our homepage for real-time BTC, ETH, SOL, BNB, XRP and USDT rates updated every 30 seconds. Our algorithms trade across these assets to generate your yields.",
      "Live crypto prices are displayed in our homepage ticker, refreshed every 30 seconds via CoinGecko. Our HFT strategies run across BTC, ETH, SOL, BNB and derivatives — market-neutral so your returns aren't dependent on any single price direction.",
    ],
    quickReplies: ["How are yields generated?", "Is my return market-dependent?", "Tell me about algorithms"],
  },
  {
    context: "algorithm",
    triggers: ["algorithm", "algo", "trading strategy", "hft", "bot", "automated", "how does it work", "how it works", "mechanism"],
    replies: [
      "Our algorithms are institutional-grade HFT (High-Frequency Trading) strategies. They execute thousands of micro-trades per second across crypto pairs, capturing micro-spreads and arbitrage opportunities. Because they're market-neutral, your returns aren't dependent on BTC going up or down.",
      "The TrustChainFX engine runs market-neutral HFT strategies — delta-hedged, meaning they profit from volatility and spread capture, not directional bets. This is why our yields are consistent regardless of whether the market is up or down.",
    ],
    quickReplies: ["Are returns guaranteed?", "How often do algorithms run?", "Tell me about packages"],
  },
  {
    context: "guarantee",
    triggers: ["guaranteed", "guarantee", "risk", "loss", "risky", "safe investment", "certain", "100%"],
    replies: [
      "No investment is legally guaranteed. Our **historical performance** shows consistent 8–22% monthly returns, but we always disclose: past performance doesn't guarantee future results. What we can guarantee is transparency, security, and that your principal is protected in cold storage.",
      "We're transparent: returns are based on algorithmic performance, not contractual guarantees. That said, our strategies have maintained positive returns for 36+ consecutive months with a max drawdown under 2%. Risk exists — only invest what you can afford.",
    ],
    quickReplies: ["What's the worst case?", "Tell me about security", "Show me the calculator"],
  },
  {
    context: "compound",
    triggers: ["compound", "compounding", "reinvest", "reinvestment", "daily compound", "interest on interest"],
    replies: [
      "All packages compound daily. This means your yield is added to your principal every day, and the next day's yield is calculated on that higher amount. Over 6 months, the compounding effect is significant — use our calculator to see the difference.",
      "Daily compounding is built in across all tiers. You don't need to do anything — it's automatic. On $1,000 at 14% monthly with daily compounding over 6 months, your balance grows to ~$3,192 instead of just $1,840 on simple interest.",
    ],
    quickReplies: ["Open the calculator", "Can I withdraw daily profits?", "Tell me about packages"],
  },
  {
    context: "minimum",
    triggers: ["minimum", "min", "smallest", "least amount", "how much to start", "how much do i need"],
    replies: [
      "You can start with as little as **$50** on our Starter package. There's no maximum investment limit. The Growth package starts at $200, and Premium at $1,000.",
      "The minimum investment is **$50** (Starter tier). You can add more to any package at any time. There's no upper limit — some of our institutional clients deploy $100,000+ in Premium.",
    ],
    quickReplies: ["Tell me about Starter", "How do I deposit?", "What are the returns?"],
  },
  {
    context: "support",
    triggers: ["human", "agent", "person", "representative", "manager", "talk to someone", "real person", "call", "email", "contact"],
    replies: [
      "I'm connecting your request to a senior advisor now. Our team typically responds within 2 minutes during business hours (CET). You can also email us directly at **support@trustchainfx.io** or use the chat during off-hours and we'll follow up.",
      "Happy to connect you with our team. For fastest response, email **support@trustchainfx.io** — we respond within 1 business hour. Or let me know if there's anything else I can answer directly right now.",
    ],
    quickReplies: ["I'll wait for the team", "Answer my question instead"],
  },
  {
    context: "country",
    triggers: ["country", "available", "region", "where", "location", "usa", "uk", "europe", "asia", "africa", "global", "international"],
    replies: [
      "TrustChainFX is available in **190+ countries**. The only exceptions are jurisdictions with active crypto investment restrictions. Our platform is fully multilingual — supporting English, Spanish, French, German, Mandarin, Japanese, and Portuguese.",
      "We're global — available in 190+ countries. Registered in Frankfurt, Germany under applicable EU financial regulations. No matter where you are, you invest and withdraw in USDT, so there are no currency conversion issues.",
    ],
    quickReplies: ["Tell me about languages", "How do I sign up?", "Tell me about security"],
  },
  {
    context: "withdraw_early",
    triggers: ["early withdraw", "before lock", "cancel", "emergency", "urgent", "need it back"],
    replies: [
      "Early withdrawal before the lock period ends carries a **10% early exit fee**. This exists to protect all investors from sudden liquidity pressures. We strongly recommend only investing capital you can commit for the full lock period.",
      "If you need funds before the lock expires, it's possible with a 10% early exit fee applied to the withdrawal amount. This helps us maintain stable algorithm performance. Premium tier is more flexible post-lock, with instant access.",
    ],
    quickReplies: ["Tell me about lock periods", "What's the fee structure?", "Tell me about Premium"],
  },
  {
    context: "tax",
    triggers: ["tax", "taxes", "taxable", "irs", "hmrc", "reporting", "capital gains"],
    replies: [
      "Tax treatment of crypto investment returns varies by jurisdiction — we're unable to give tax advice. We recommend consulting a local accountant. We do provide a **full transaction history export** from your dashboard to simplify your tax reporting.",
      "We don't provide tax advice as it's jurisdiction-specific. What we do provide: a complete downloadable ledger from your dashboard for accurate reporting. Most countries treat crypto yield as income or capital gains — your accountant can advise on the applicable rate.",
    ],
    quickReplies: ["Tell me about the ledger", "How do I export transactions?", "Contact support"],
  },
  {
    context: "thanks",
    triggers: ["thank", "thanks", "great", "awesome", "perfect", "brilliant", "helpful", "danke", "merci", "gracias", "arigatou", "appreciate"],
    replies: [
      "You're very welcome! Is there anything else I can help you with? The TrustChainFX team is here 24/7.",
      "Happy to help! Feel free to reach out anytime. Good luck with your investments! 🎯",
      "Glad I could assist! Don't hesitate to ask if anything else comes to mind.",
    ],
    quickReplies: ["Tell me something else", "I'm ready to invest", "Contact the team"],
  },
];

const FALLBACKS = [
  "That's a great question — let me flag it for one of our senior advisors. They'll follow up shortly. Anything else I can help with in the meantime?",
  "I want to give you the most accurate answer, so I'm escalating this to our investment team. Can I help with anything else while you wait?",
  "Hmm, I'm not sure about that specific point. For detailed questions like this, our advisors at **support@trustchainfx.io** can give you a precise answer. I'm always here for general questions though!",
  "Good question — this is outside my immediate knowledge. Our team can answer it definitively. Try **support@trustchainfx.io** or ask me something else!",
  "I didn't quite catch that. Could you rephrase? I can help with packages, yields, deposits, withdrawals, security, fees, referrals, and more.",
];

// ─── Bot engine ───────────────────────────────────────────────────────────────
interface BotState {
  context: string;
  fallbackIdx: number;
  replyCounters: Record<string, number>;
}

const state: BotState = { context: "", fallbackIdx: 0, replyCounters: {} };

function getBotReply(input: string): { text: string; quickReplies?: string[] } {
  const lower = input.toLowerCase().trim();

  // Handle follow-ups in context
  if (["more", "tell me more", "explain", "elaborate", "go on", "continue", "detail"].some((w) => lower.includes(w)) && state.context) {
    const prev = FLOWS.find((f) => f.context === state.context);
    if (prev) {
      const idx = (state.replyCounters[state.context] ?? 0) % prev.replies.length;
      state.replyCounters[state.context] = idx + 1;
      return { text: prev.replies[idx], quickReplies: prev.quickReplies };
    }
  }

  // Handle number extraction for investment amounts
  const amountMatch = lower.match(/\$?(\d{2,6})/);
  if (amountMatch && (lower.includes("invest") || lower.includes("deposit") || lower.includes("start"))) {
    const amount = parseInt(amountMatch[1]);
    if (amount < 50) return { text: `The minimum investment is $50. Even a small amount on our Starter package earns **8% monthly ROI** — that's a great starting point!`, quickReplies: ["Tell me about Starter", "How do I deposit?"] };
    if (amount < 200) return { text: `With $${amount}, you'd be in the **Starter tier** (8% monthly ROI, 30-day lock). That's $${Math.round(amount * 0.08)}/month on your investment. Want to see a full projection in our calculator?`, quickReplies: ["Open calculator", "Tell me more about Starter", "What about Growth?"] };
    if (amount < 1000) return { text: `With $${amount}, you qualify for **Growth** (14% monthly ROI, 60-day lock). That's $${Math.round(amount * 0.14)}/month. The Growth tier is our most popular for this range.`, quickReplies: ["Tell me about Growth", "How do withdrawals work?", "Open calculator"] };
    return { text: `With $${amount.toLocaleString()}, you qualify for **Premium** (22% monthly ROI, 90-day lock) — that's $${Math.round(amount * 0.22).toLocaleString()}/month. Alternatively, Growth at 14% is also available. Which interests you?`, quickReplies: ["Tell me about Premium", "Compare packages", "Open calculator"] };
  }

  // Match flows
  for (const flow of FLOWS) {
    if (flow.triggers.some((t) => lower.includes(t))) {
      state.context = flow.context;
      const idx = (state.replyCounters[flow.context] ?? 0) % flow.replies.length;
      state.replyCounters[flow.context] = idx + 1;
      return { text: flow.replies[idx], quickReplies: flow.quickReplies };
    }
  }

  // Fallback
  const fb = FALLBACKS[state.fallbackIdx % FALLBACKS.length];
  state.fallbackIdx++;
  return { text: fb, quickReplies: ["Tell me about packages", "How do I start?", "Contact support"] };
}

// ─── Component ────────────────────────────────────────────────────────────────
function formatBotText(text: string) {
  return text.split("\n").map((line, i) => {
    const html = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return <span key={i} className="block" dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{
    id: 1, from: "bot",
    text: "Hi! I'm Aria, your TrustChainFX assistant. Ask me about packages, yields, deposits, withdrawals, or anything else.",
    time: now(),
    quickReplies: ["Tell me about packages", "How do I start?", "What's the minimum deposit?"],
  }]);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 300); } }, [open]);
  useEffect(() => { if (open && !minimised) bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open, minimised]);

  const pushBotMessage = useCallback((text: string, quickReplies?: string[]) => {
    const botMsg: Message = { id: Date.now() + 1, from: "bot", text, time: now(), quickReplies };
    setMessages((prev) => [...prev, botMsg]);
    setTyping(false);
    if (!open || minimised) setUnread((n) => n + 1);
  }, [open, minimised]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = { id: Date.now(), from: "user", text: trimmed, time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    const delay = 600 + Math.random() * 900;
    setTimeout(() => {
      const { text: reply, quickReplies } = getBotReply(trimmed);
      pushBotMessage(reply, quickReplies);
    }, delay);
  }, [pushBotMessage]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: minimised ? 0.95 : 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[360px] rounded-2xl border border-border/60 bg-card shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: minimised ? "56px" : "520px" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/20 to-accent/10 border-b border-border/40 cursor-pointer select-none"
              onClick={() => setMinimised((v) => !v)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">A</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{BOT_NAME}</p>
                  <p className="text-xs text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    Online — replies instantly
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); setMinimised((v) => !v); }} className="text-muted-foreground hover:text-foreground p-1" data-testid="button-chat-minimise">
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setOpen(false); }} className="text-muted-foreground hover:text-foreground p-1" data-testid="button-chat-close">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!minimised && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-background/60" style={{ minHeight: 0 }}>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-2 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      {msg.from === "bot" && (
                        <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0 mt-0.5">A</div>
                      )}
                      <div className={`max-w-[82%] flex flex-col gap-1 ${msg.from === "user" ? "items-end" : "items-start"}`}>
                        <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${msg.from === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border/50 text-foreground rounded-tl-sm"}`}>
                          {msg.from === "bot" ? formatBotText(msg.text) : msg.text}
                        </div>
                        {msg.from === "bot" && msg.quickReplies && msg.quickReplies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {msg.quickReplies.map((qr) => (
                              <button
                                key={qr}
                                onClick={() => sendMessage(qr)}
                                className="text-xs px-2.5 py-1 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors bg-card"
                              >
                                {qr}
                              </button>
                            ))}
                          </div>
                        )}
                        <span className="text-[10px] text-muted-foreground px-1">{msg.time}</span>
                      </div>
                    </div>
                  ))}

                  {typing && (
                    <div className="flex gap-2 items-center">
                      <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">A</div>
                      <div className="bg-card border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="px-3 py-3 border-t border-border/40 bg-card/80 flex gap-2 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Ask me anything…"
                    data-testid="input-chat-message"
                    className="flex-1 bg-background border border-border/50 rounded-xl px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 text-foreground"
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim()}
                    data-testid="button-chat-send"
                    className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-center py-1.5 bg-card/50">
                  <span className="text-[10px] text-muted-foreground/50">Powered by TrustChainFX AI</span>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        onClick={() => { setOpen((v) => !v); setUnread(0); }}
        data-testid="button-chat-toggle"
        className="relative w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center justify-center hover:bg-primary/90 hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] transition-all"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="c" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X className="w-6 h-6" /></motion.div>
            : <motion.div key="o" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><MessageCircle className="w-6 h-6" /></motion.div>
          }
        </AnimatePresence>
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
    </div>
  );
}
