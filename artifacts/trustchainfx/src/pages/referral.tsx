import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useReferral } from "@/hooks/use-referral";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Users, DollarSign, Clock, Gift, ChevronRight, UserPlus, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Referral() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const {
    code, referralLink, referrals, totalBonus,
    activeCount, pendingCount, simulateReferral, activateReferrals, BONUS_PER_REFERRAL,
  } = useReferral(user?.email);

  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);

  if (!user) { setLocation("/login"); return null; }

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    });
  }

  function copyLink() {
    navigator.clipboard.writeText(referralLink).then(() => {
      setLinkCopied(true);
      toast({ title: "Referral link copied!", description: "Share it with friends to earn $25 per signup.", className: "border-primary bg-card" });
      setTimeout(() => setLinkCopied(false), 2000);
    });
  }

  function handleSimulate() {
    setSimulating(true);
    setTimeout(() => {
      simulateReferral();
      setSimulating(false);
      toast({ title: "New referral registered!", description: `You'll earn $${BONUS_PER_REFERRAL} once they activate their first investment.`, className: "border-primary bg-card" });
    }, 1200);
  }

  const HOW_IT_WORKS = [
    { icon: <Copy className="w-5 h-5" />, title: "Copy your link", desc: "Get your unique referral link from this page." },
    { icon: <UserPlus className="w-5 h-5" />, title: "Share with friends", desc: "Send your link via WhatsApp, Telegram, email or social media." },
    { icon: <DollarSign className="w-5 h-5" />, title: "Earn $25 per referral", desc: "When they sign up and make their first investment, $25 is credited to your balance." },
  ];

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="container mx-auto px-4 md:px-8 py-10 max-w-5xl"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Referral Programme</h1>
            <p className="text-muted-foreground mt-0.5">Earn <span className="text-primary font-semibold">${BONUS_PER_REFERRAL}</span> for every investor you bring to TrustChainFX.</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Referrals",  value: referrals.length,         icon: <Users className="w-4 h-4" />,      color: "text-primary" },
            { label: "Active",           value: activeCount,               icon: <Zap className="w-4 h-4" />,        color: "text-emerald-500" },
            { label: "Pending",          value: pendingCount,              icon: <Clock className="w-4 h-4" />,      color: "text-yellow-500" },
            { label: "Bonus Earned",     value: `$${totalBonus}`,          icon: <DollarSign className="w-4 h-4" />, color: "text-primary" },
          ].map((s) => (
            <Card key={s.label} className="bg-card/50 border-border/50">
              <CardContent className="pt-5 pb-4">
                <div className={`flex items-center gap-2 mb-2 ${s.color}`}>
                  {s.icon}
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{s.label}</span>
                </div>
                <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* Referral code + link */}
          <Card className="lg:col-span-3 bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Your Referral Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Code */}
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Referral Code</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-background border border-border rounded-lg px-4 py-3 font-mono text-xl font-bold tracking-widest text-primary">
                    {code}
                  </div>
                  <Button size="sm" variant="outline" onClick={copyCode} className="shrink-0 h-12 w-12 p-0">
                    {codeCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Link */}
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Referral Link</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-background border border-border rounded-lg px-3 py-2.5 text-xs font-mono text-muted-foreground truncate">
                    {referralLink}
                  </div>
                  <Button
                    size="sm"
                    className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={copyLink}
                  >
                    {linkCopied ? <><Check className="w-3.5 h-3.5 mr-1.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Link</>}
                  </Button>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 text-sm text-muted-foreground">
                💡 <span className="text-foreground font-medium">Tip:</span> Share via WhatsApp, Telegram, or email. Anyone who signs up through your link and invests earns you <span className="text-primary font-semibold">${BONUS_PER_REFERRAL}</span>.
              </div>

              {/* Demo button */}
              <div className="pt-1 border-t border-border/40">
                <p className="text-xs text-muted-foreground mb-3">Demo mode — simulate how a referral would look:</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/20 hover:bg-primary/10 hover:text-primary"
                    onClick={handleSimulate}
                    disabled={simulating}
                  >
                    {simulating ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Registering…
                      </span>
                    ) : (
                      <><UserPlus className="w-3.5 h-3.5 mr-1.5" /> Simulate a Referral</>
                    )}
                  </Button>
                  {pendingCount > 0 && (
                    <Button variant="outline" size="sm" className="border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-500" onClick={activateReferrals}>
                      <Zap className="w-3.5 h-3.5 mr-1.5" /> Activate Pending ({pendingCount})
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How it works */}
          <Card className="lg:col-span-2 bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-base">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{step.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}

              <div className="border-t border-border/40 pt-4 space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Terms</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• ${BONUS_PER_REFERRAL} credited per unique referral</li>
                  <li>• Bonus paid when referred user's first investment activates</li>
                  <li>• No limit on referrals</li>
                  <li>• Bonus added directly to your balance</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral list */}
        <Card className="bg-card/30 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Your Referrals ({referrals.length})</CardTitle>
            {referrals.length > 0 && (
              <span className="text-xs text-muted-foreground">${totalBonus} total earned</span>
            )}
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">No referrals yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Share your link above to start earning</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={copyLink}>
                  <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Link
                </Button>
              </div>
            ) : (
              <div className="space-y-0">
                <div className="hidden md:grid grid-cols-4 gap-4 px-3 pb-2 border-b border-border/40 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  <span>Name</span>
                  <span>Email</span>
                  <span>Joined</span>
                  <span className="text-right">Bonus</span>
                </div>
                <AnimatePresence initial={false}>
                  {referrals.map((ref) => (
                    <motion.div
                      key={ref.code + ref.joinedAt}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center px-3 py-3.5 border-b border-border/30 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                          {ref.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium">{ref.name}</span>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground hidden md:block">{ref.email}</span>
                      <span className="text-xs text-muted-foreground hidden md:block">
                        {new Date(ref.joinedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <div className="flex items-center justify-end gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ref.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-yellow-500/10 text-yellow-500"}`}>
                          {ref.status === "active" ? "Active" : "Pending"}
                        </span>
                        <span className="font-mono text-sm font-semibold text-primary">+${ref.bonusUSD}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground gap-1.5">
              ← Back to Dashboard
            </Button>
          </Link>
          <Link href="/packages">
            <Button variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary gap-1.5">
              View Investment Packages <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </Layout>
  );
}
