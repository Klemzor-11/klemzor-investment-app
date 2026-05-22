import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useBalance } from "@/hooks/use-balance";
import { useReferral } from "@/hooks/use-referral";
import { useLanguage } from "@/hooks/use-language";
import { Layout } from "@/components/layout";
import { DepositModal } from "@/components/deposit-modal";
import { WithdrawModal } from "@/components/withdraw-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, Wallet, Activity, Briefcase, Calculator, PackagePlus, ChevronDown, ArrowDownLeft, ArrowUpRight as WithdrawIcon, Gift, Users, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const chartData = [
  { month: "Jan", value: 12500 },
  { month: "Feb", value: 13800 },
  { month: "Mar", value: 13200 },
  { month: "Apr", value: 15400 },
  { month: "May", value: 17100 },
  { month: "Jun", value: 19850 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { balance, transactions, deposit, withdraw } = useBalance();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [showAllTx, setShowAllTx] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  const { code, referrals, totalBonus } = useReferral(user?.email);

  if (!user) {
    setLocation("/login");
    return null;
  }

  const displayName = user.name || user.email;
  const visibleTransactions = showAllTx ? transactions : transactions.slice(0, 3);
  const invested = 12500;
  const gain = balance - invested;
  const gainPct = ((gain / invested) * 100).toFixed(1);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="container mx-auto px-4 md:px-8 py-8 max-w-7xl"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t.dashboard.title}</h1>
            <p className="text-muted-foreground mt-1">
              {t.dashboard.subtitle}, <span className="text-foreground font-medium">{displayName}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              onClick={() => setDepositOpen(true)}
              data-testid="button-deposit"
            >
              <ArrowDownLeft className="w-4 h-4 mr-2" />
              Deposit
            </Button>
            <Button
              variant="outline"
              className="border-border hover:bg-secondary"
              onClick={() => setWithdrawOpen(true)}
              data-testid="button-withdraw"
            >
              <WithdrawIcon className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
            <Link href="/packages">
              <Button variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary" data-testid="button-new-investment">
                <PackagePlus className="w-4 h-4 mr-2" />
                {t.dashboard.newInvestment}
              </Button>
            </Link>
            <Link href="/calculator">
              <Button variant="secondary" className="bg-secondary hover:bg-secondary/80" data-testid="button-yield-calculator">
                <Calculator className="w-4 h-4 mr-2" />
                {t.dashboard.yieldCalculator}
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t.dashboard.totalValue}</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground font-mono" data-testid="text-total-value">
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className={`text-xs mt-1 flex items-center font-medium ${gain >= 0 ? "text-emerald-500" : "text-red-400"}`}>
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {gain >= 0 ? "+" : ""}${gain.toFixed(2)} ({gainPct}%)
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t.dashboard.investedCapital}</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono">$12,500.00</div>
              <p className="text-xs text-muted-foreground mt-1">{t.dashboard.acrossPackages}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t.dashboard.monthlyYield}</CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono text-accent">14.2%</div>
              <p className="text-xs text-muted-foreground mt-1">{t.dashboard.weightedAverage}</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t.dashboard.nextPayout}</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono">$450.00</div>
              <p className="text-xs text-muted-foreground mt-1">{t.dashboard.inDays}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts + Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-card/30 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">{t.dashboard.performanceHistory}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                      itemStyle={{ color: "hsl(var(--primary))" }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Portfolio Value"]}
                    />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3}
                      dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/30 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">{t.dashboard.recentLedger}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {visibleTransactions.map((tx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between border-b border-border/40 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="min-w-0 flex-1 mr-3">
                        <p className="font-medium text-sm truncate">{tx.type}</p>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{tx.id} · {tx.date}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`font-mono text-sm font-medium ${tx.amount.startsWith("+") ? "text-emerald-500" : "text-foreground"}`}>
                          {tx.amount}
                        </p>
                        <p className={`text-xs mt-0.5 ${tx.status === "Pending" ? "text-yellow-500" : "text-muted-foreground"}`}>
                          {tx.status}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {transactions.length > 3 && (
                <Button
                  variant="ghost"
                  className="w-full mt-5 text-sm text-primary hover:text-primary/80 hover:bg-primary/5"
                  onClick={() => setShowAllTx((v) => !v)}
                  data-testid="button-view-ledger"
                >
                  {showAllTx ? "Show Less" : t.dashboard.viewLedger}
                  <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${showAllTx ? "rotate-180" : ""}`} />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Referral widget */}
        <Card className="mt-8 bg-gradient-to-r from-primary/10 via-card/50 to-accent/10 border-primary/20">
          <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-5 px-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-primary/15 rounded-xl text-primary shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Referral Programme — Earn $25 per investor you invite</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your code: <span className="font-mono text-primary font-bold">{code}</span>
                  {referrals.length > 0 && (
                    <span className="ml-3 text-muted-foreground">
                      <Users className="w-3 h-3 inline mr-1" />
                      {referrals.length} referral{referrals.length !== 1 ? "s" : ""} · <span className="text-emerald-500 font-medium">${totalBonus} earned</span>
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Link href="/referral" className="shrink-0">
              <Button size="sm" variant="outline" className="border-primary/30 hover:bg-primary/10 hover:text-primary gap-1.5 whitespace-nowrap">
                {referrals.length > 0 ? "View Referrals" : "Get Your Link"}
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      <DepositModal
        open={depositOpen}
        onClose={() => setDepositOpen(false)}
        onDeposit={(amount) => deposit(amount)}
      />
      <WithdrawModal
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        onWithdraw={(amount, address) => withdraw(amount, address)}
        balance={balance}
      />
    </Layout>
  );
}
