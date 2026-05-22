import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Clock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const USDT_ADDRESS = "TAWTahox3hL6BhYmaLQfT7pLcN47CwdANn";

const COINS = [
  { id: "usdt", symbol: "USDT", name: "Tether (TRC20)", network: "TRON Network", active: true, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/30" },
  { id: "btc",  symbol: "BTC",  name: "Bitcoin",        network: "Bitcoin Network", active: false, color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  { id: "eth",  symbol: "ETH",  name: "Ethereum",       network: "ERC20 Network",  active: false, color: "text-blue-400",   bg: "bg-blue-400/10 border-blue-400/20" },
  { id: "bnb",  symbol: "BNB",  name: "BNB Chain",      network: "BEP20 Network",  active: false, color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
}

type Step = "coin" | "address" | "confirm" | "success";

export function DepositModal({ open, onClose, onDeposit }: Props) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("coin");
  const [selected, setSelected] = useState("usdt");
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  function reset() {
    setStep("coin");
    setAmount("");
    setCopied(false);
    setLoading(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function copyAddress() {
    navigator.clipboard.writeText(USDT_ADDRESS).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleConfirm() {
    const num = parseFloat(amount);
    if (!num || num < 1) {
      toast({ title: "Invalid amount", description: "Please enter at least $1", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      onDeposit(num);
      setLoading(false);
      setStep("success");
    }, 1800);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {step === "success" ? "Deposit Submitted" : "Deposit Funds"}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* STEP 1 — Select coin */}
          {step === "coin" && (
            <motion.div key="coin" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
              <p className="text-sm text-muted-foreground">Select a cryptocurrency to deposit:</p>
              {COINS.map((coin) => (
                <button
                  key={coin.id}
                  disabled={!coin.active}
                  onClick={() => { if (coin.active) { setSelected(coin.id); setStep("address"); } }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    coin.active
                      ? `${coin.bg} hover:opacity-90 cursor-pointer`
                      : "bg-muted/30 border-border/30 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${coin.active ? coin.bg : "bg-muted border-border/30"}`}>
                      <span className={coin.active ? coin.color : "text-muted-foreground"}>{coin.symbol.slice(0, 3)}</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold">{coin.name}</p>
                      <p className="text-xs text-muted-foreground">{coin.network}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!coin.active && <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">Soon</span>}
                    {coin.active && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {/* STEP 2 — Show address */}
          {step === "address" && (
            <motion.div key="address" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
              <div className="flex items-center gap-2 text-sm text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                <Check className="w-4 h-4 shrink-0" />
                Send only USDT (TRC20) to this address. Other tokens will be lost.
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">USDT Wallet Address (TRC20)</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-background border border-border rounded-lg px-3 py-2.5 font-mono text-xs text-foreground break-all select-all">
                    {USDT_ADDRESS}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    onClick={copyAddress}
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                {copied && <p className="text-xs text-emerald-500">Address copied to clipboard!</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Amount You Are Sending (USD equivalent)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">$</span>
                  <Input
                    type="number" min={1} placeholder="0.00"
                    className="pl-7 font-mono"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep("coin")}>Back</Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    if (!amount || parseFloat(amount) < 1) {
                      toast({ title: "Enter amount", description: "Enter how much you're sending", variant: "destructive" });
                      return;
                    }
                    setStep("confirm");
                  }}
                >
                  I've Sent Funds
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Confirm */}
          {step === "confirm" && (
            <motion.div key="confirm" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
              <div className="bg-muted/40 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network</span>
                  <span className="font-medium">TRON (TRC20)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-mono font-semibold text-primary">${parseFloat(amount || "0").toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Processing time</span>
                  <span>~10 minutes</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                After confirming, your deposit will appear as <span className="text-yellow-500 font-medium">Pending</span> in your ledger.
                It will be marked as Completed once the TRON network confirms the transaction.
              </p>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" disabled={loading} onClick={() => setStep("address")}>Back</Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleConfirm}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Processing…
                    </span>
                  ) : "Confirm Deposit"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4 — Success */}
          {step === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <p className="text-lg font-bold">Deposit Pending</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-primary font-semibold">${parseFloat(amount || "0").toFixed(2)}</span> will be credited once the TRON network confirms your transaction (usually under 10 minutes).
                </p>
              </div>
              <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
                Your balance has been updated. The transaction is visible in your ledger.
              </p>
              <Button className="w-full bg-primary text-primary-foreground" onClick={handleClose}>
                Back to Dashboard
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
