import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Check, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  onWithdraw: (amount: number, address: string) => void;
  balance: number;
}

type Step = "form" | "review" | "success";

export function WithdrawModal({ open, onClose, onWithdraw, balance }: Props) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("form");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  function reset() { setStep("form"); setAmount(""); setAddress(""); setLoading(false); }
  function handleClose() { reset(); onClose(); }

  const num = parseFloat(amount) || 0;

  function validateForm() {
    if (num < 10) { toast({ title: "Minimum $10", description: "Minimum withdrawal is $10", variant: "destructive" }); return false; }
    if (num > balance) { toast({ title: "Insufficient balance", description: `You only have $${balance.toLocaleString()} available`, variant: "destructive" }); return false; }
    if (!address.trim() || address.trim().length < 10) { toast({ title: "Invalid address", description: "Enter a valid wallet address", variant: "destructive" }); return false; }
    return true;
  }

  function handleSubmit() {
    setLoading(true);
    setTimeout(() => {
      onWithdraw(num, address.trim());
      setLoading(false);
      setStep("success");
    }, 2000);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {step === "success" ? "Withdrawal Submitted" : "Withdraw Funds"}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* FORM */}
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
              <div className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-3">
                <span className="text-sm text-muted-foreground">Available balance</span>
                <span className="font-mono font-bold text-foreground">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Withdrawal Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">$</span>
                  <Input
                    type="number" min={10} placeholder="0.00"
                    className="pl-7 font-mono"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setAmount((balance * pct / 100).toFixed(2))}
                      className="flex-1 text-xs py-1 rounded-md bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Your Wallet Address (USDT TRC20)</Label>
                <Input
                  placeholder="Enter your USDT TRC20 address"
                  className="font-mono text-xs"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="flex items-start gap-2 text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Withdrawals are processed within 24 hours after your lock period expires. Minimum withdrawal: $10.</span>
              </div>

              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11"
                onClick={() => { if (validateForm()) setStep("review"); }}
              >
                Review Withdrawal
              </Button>
            </motion.div>
          )}

          {/* REVIEW */}
          {step === "review" && (
            <motion.div key="review" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
              <div className="bg-muted/40 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-mono font-semibold text-foreground">${num.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network fee</span>
                  <span className="font-mono text-muted-foreground">~$1.00</span>
                </div>
                <div className="border-t border-border/40 pt-3 flex justify-between text-sm">
                  <span className="text-muted-foreground">You will receive</span>
                  <span className="font-mono font-bold text-primary">${Math.max(0, num - 1).toFixed(2)}</span>
                </div>
                <div className="border-t border-border/40 pt-3 space-y-1">
                  <span className="text-xs text-muted-foreground">To address</span>
                  <p className="font-mono text-xs text-foreground break-all">{address}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                After submission, your balance will reflect this withdrawal immediately. Processing takes up to 24 hours.
              </p>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" disabled={loading} onClick={() => setStep("form")}>Back</Button>
                <Button
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Submitting…
                    </span>
                  ) : "Confirm Withdrawal"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* SUCCESS */}
          {step === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <p className="text-lg font-bold">Withdrawal Pending</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-primary font-semibold">${num.toFixed(2)}</span> will be sent to your wallet within 24 hours.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 justify-center">
                <Check className="w-3.5 h-3.5" />
                Transaction added to your ledger
              </div>
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
