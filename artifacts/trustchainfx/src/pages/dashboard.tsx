import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, Wallet, Activity, Briefcase, Calculator, PackagePlus } from "lucide-react";
import { motion } from "framer-motion";

const chartData = [
  { month: "Jan", value: 12500 },
  { month: "Feb", value: 13800 },
  { month: "Mar", value: 13200 },
  { month: "Apr", value: 15400 },
  { month: "May", value: 17100 },
  { month: "Jun", value: 19850 },
];

const transactions = [
  { id: "TX-9021", type: "Yield Distribution", amount: "+$450.00", date: "Today, 09:41 AM", status: "Completed" },
  { id: "TX-8914", type: "Package Upgrade (Growth)", amount: "-$2,000.00", date: "Yesterday, 14:22 PM", status: "Completed" },
  { id: "TX-8802", type: "Initial Deposit", amount: "+$12,500.00", date: "Jan 12, 10:00 AM", status: "Completed" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  if (!user) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Portfolio Terminal</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/packages">
              <Button variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary">
                <PackagePlus className="w-4 h-4 mr-2" />
                New Investment
              </Button>
            </Link>
            <Link href="/calculator">
              <Button variant="secondary" className="bg-secondary hover:bg-secondary/80">
                <Calculator className="w-4 h-4 mr-2" />
                Yield Calculator
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 border-border/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Value</CardTitle>
              <Wallet className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground font-mono">$19,850.00</div>
              <p className="text-xs text-emerald-500 mt-1 flex items-center font-medium">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +$7,350.00 (58.8%)
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Invested Capital</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono">$12,500.00</div>
              <p className="text-xs text-muted-foreground mt-1">Across 2 active packages</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Monthly Yield</CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono text-accent">14.2%</div>
              <p className="text-xs text-muted-foreground mt-1">Weighted average</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Next Payout</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono">$450.00</div>
              <p className="text-xs text-muted-foreground mt-1">In 3 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-card/30 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Performance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--primary))' }}
                      formatter={(value: number) => [`$${value}`, 'Value']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/30 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Recent Ledger</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between border-b border-border/40 pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{tx.type}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{tx.id} • {tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono text-sm font-medium ${tx.amount.startsWith('+') ? 'text-emerald-500' : 'text-foreground'}`}>
                        {tx.amount}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{tx.status}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-sm text-primary hover:text-primary/80">
                View Complete Ledger <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}