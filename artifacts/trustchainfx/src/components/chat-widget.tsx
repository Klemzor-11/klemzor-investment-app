import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";

type Message = {
  id: number;
  from: "user" | "bot";
  text: string;
  time: string;
};

const BOT_NAME = "Aria";
const BOT_AVATAR = "A";

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const BOT_FLOWS: { triggers: string[]; reply: string }[] = [
  {
    triggers: ["hello", "hi", "hey", "good", "bonjour", "hola", "hallo", "こんにちは", "你好"],
    reply: "Hello! Welcome to TrustChainFX. How can I assist you today? You can ask me about our investment packages, yields, security, or withdrawals.",
  },
  {
    triggers: ["package", "plan", "tier", "starter", "growth", "premium"],
    reply: "We offer three tiers:\n• **Starter** — from $50 | 8% monthly ROI | 30-day lock\n• **Growth** — from $200 | 14% monthly ROI | 60-day lock\n• **Premium** — from $1,000 | 22% monthly ROI | 90-day lock\n\nWould you like details on any specific package?",
  },
  {
    triggers: ["roi", "return", "yield", "profit", "interest", "earn"],
    reply: "Our yields range from 8% to 22% monthly ROI depending on your package. Returns are algorithmically generated and distributed on a schedule based on your tier. Use our Yield Calculator to project your exact returns.",
  },
  {
    triggers: ["withdraw", "withdrawal", "cash out", "money out", "payout"],
    reply: "Withdrawals are available after the lock period ends:\n• Starter: 30 days\n• Growth: 60 days\n• Premium: 90 days (instant post-lock)\n\nPayouts are processed within 24 hours of a withdrawal request.",
  },
  {
    triggers: ["secure", "security", "safe", "trust", "hack", "protect"],
    reply: "TrustChainFX uses bank-grade, military-level security:\n• Cold storage multi-signature wallets\n• 256-bit AES encryption\n• Multi-factor authentication\n• Real-time fraud monitoring\n\nYour funds are never held in hot wallets.",
  },
  {
    triggers: ["deposit", "invest", "start", "begin", "minimum"],
    reply: "The minimum investment is just $50 for our Starter package. To begin:\n1. Create your account\n2. Choose an investment tier\n3. Deploy your capital\n\nFunds are put to work immediately after confirmation.",
  },
  {
    triggers: ["human", "agent", "person", "support", "help", "representative", "speak"],
    reply: "I'm connecting you with a human specialist now. Our average response time is under 2 minutes. In the meantime, feel free to browse our FAQ or use the calculator to project your returns.",
  },
  {
    triggers: ["fee", "fees", "charge", "cost", "commission"],
    reply: "TrustChainFX charges zero management fees on Starter and Growth tiers. Premium tier has a 1% performance fee applied only on profits — never on your principal.",
  },
  {
    triggers: ["kyc", "verify", "verification", "id", "identity", "document"],
    reply: "KYC verification is required for investments above $5,000. The process takes under 10 minutes and requires a government-issued ID. Smaller investments can be deployed immediately after account creation.",
  },
  {
    triggers: ["country", "available", "where", "location", "region"],
    reply: "TrustChainFX is available in 190+ countries worldwide. The only exclusions are jurisdictions with active investment restrictions. Your language and currency preferences are auto-detected.",
  },
  {
    triggers: ["thank", "thanks", "danke", "merci", "gracias", "arigatou", "謝謝"],
    reply: "You're welcome! Is there anything else I can help you with? The TrustChainFX team is here 24/7.",
  },
];

const FALLBACK_REPLIES = [
  "That's a great question. Let me flag this for one of our senior advisors who will follow up with you shortly. In the meantime, can I help with anything else?",
  "I want to make sure you get the most accurate answer. I'm escalating this to a specialist — expect a response within a few minutes.",
  "I appreciate you asking. This is something our investment team can answer in more detail. Would you prefer a callback or an email follow-up?",
];

let fallbackIdx = 0;

function getBotReply(input: string): string {
  const lower = input.toLowerCase();
  for (const flow of BOT_FLOWS) {
    if (flow.triggers.some((t) => lower.includes(t))) {
      return flow.reply;
    }
  }
  const reply = FALLBACK_REPLIES[fallbackIdx % FALLBACK_REPLIES.length];
  fallbackIdx++;
  return reply;
}

function formatBotText(text: string) {
  return text.split("\n").map((line, i) => {
    const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    return (
      <span key={i} className="block" dangerouslySetInnerHTML={{ __html: formatted }} />
    );
  });
}

export function ChatWidget() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "bot",
      text: "Hello! I'm Aria, your TrustChainFX support specialist. How can I help you today?",
      time: now(),
    },
  ]);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    if (open && !minimised) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, minimised]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now(), from: "user", text, time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const delay = 800 + Math.random() * 800;
    setTimeout(() => {
      const botReply = getBotReply(text);
      const botMsg: Message = { id: Date.now() + 1, from: "bot", text: botReply, time: now() };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
      if (!open || minimised) setUnread((n) => n + 1);
    }, delay);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
            <div
              className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/20 to-accent/10 border-b border-border/40 cursor-pointer select-none"
              onClick={() => setMinimised((v) => !v)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                  {BOT_AVATAR}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{BOT_NAME}</p>
                  <p className="text-xs text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    Online — typically replies instantly
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setMinimised((v) => !v); }}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  data-testid="button-chat-minimise"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  data-testid="button-chat-close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!minimised && (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-background/60" style={{ minHeight: 0 }}>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {msg.from === "bot" && (
                        <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0 mt-0.5">
                          {BOT_AVATAR}
                        </div>
                      )}
                      <div className={`max-w-[80%] ${msg.from === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                        <div
                          className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                            msg.from === "user"
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "bg-card border border-border/50 text-foreground rounded-tl-sm"
                          }`}
                        >
                          {msg.from === "bot" ? formatBotText(msg.text) : msg.text}
                        </div>
                        <span className="text-[10px] text-muted-foreground px-1">{msg.time}</span>
                      </div>
                    </div>
                  ))}

                  {typing && (
                    <div className="flex gap-2 items-center">
                      <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                        {BOT_AVATAR}
                      </div>
                      <div className="bg-card border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>

                <div className="px-3 py-3 border-t border-border/40 bg-card/80 flex gap-2 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder="Type a message..."
                    data-testid="input-chat-message"
                    className="flex-1 bg-background border border-border/50 rounded-xl px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 text-foreground"
                  />
                  <button
                    onClick={sendMessage}
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

      <button
        onClick={() => { setOpen((v) => !v); setUnread(0); }}
        data-testid="button-chat-toggle"
        className="relative w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center justify-center hover:bg-primary/90 hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] transition-all"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
    </div>
  );
}
