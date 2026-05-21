import { useState, useMemo } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Calculator as CalcIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function Calculator() {
  const [amount, setAmount] = useState<number>(1000);
  const [roi, setRoi] = useState<number>(14);
  const [months, setMonths] = useState<number>(6);

  const stats = useMemo(() => {
    const profit = amount * (roi / 100) * months;
    const total = amount + profit;
    
    // Generate projection data for chart
    const data = [];
    let currentTotal = amount;
    for (let i = 1; i <= months; i++) {
      const monthProfit = amount * (roi / 100);
      currentTotal += monthProfit;
      data.push({
        month: `Mo ${i}`,
        Principal: amount,
        Profit: Math.round(monthProfit * i),
      });
    }

    return { profit, total, data };
  }, [amount, roi, months]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <CalcIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Yield Calculator</h1>
            <p className="text-muted-foreground">Project your algorithmic returns</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div 
            className="lg:col-span-4 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="bg-card/50 border-border/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Initial Capital</Label>
                    <span className="font-mono text-sm text-primary">${amount.toLocaleString()}</span>
                  </div>
                  <Input 
                    type="number" 
                    value={amount || ""} 
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="font-mono"
                  />
                  <Slider 
                    value={[amount]} 
                    min={50} 
                    max={50000} 
                    step={50}
                    onValueChange={(v) => setAmount(v[0])} 
                    className="mt-2"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Monthly ROI (%)</Label>
                    <span className="font-mono text-sm text-primary">{roi}%</span>
                  </div>
                  <Input 
                    type="number" 
                    value={roi || ""} 
                    onChange={(e) => setRoi(Number(e.target.value))}
                    className="font-mono"
                  />
                  <Slider 
                    value={[roi]} 
                    min={1} 
                    max={50} 
                    step={1}
                    onValueChange={(v) => setRoi(v[0])} 
                    className="mt-2"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Duration (Months)</Label>
                    <span className="font-mono text-sm text-primary">{months} Mo</span>
                  </div>
                  <Slider 
                    value={[months]} 
                    min={1} 
                    max={24} 
                    step={1}
                    onValueChange={(v) => setMonths(v[0])} 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Projected Profit</span>
                  <span className="text-3xl font-mono font-bold text-emerald-500">
                    +${stats.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-border/50 flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Total Value</span>
                  <span className="text-2xl font-mono font-semibold">
                    ${stats.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            className="lg:col-span-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="h-full bg-card/30 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Growth Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                        cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        formatter={(value: number) => [`$${value}`, '']}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                      <Bar dataKey="Principal" stackId="a" fill="hsl(var(--secondary))" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="Profit" stackId="a" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}