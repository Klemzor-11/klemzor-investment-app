import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { useLocation } from "wouter";

export default function Packages() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const packages = [
    {
      id: "starter",
      name: "Starter",
      description: t.packages.subtitle.split(".")[0],
      min: 50,
      roi: 8,
      lock: 30,
      features: ["Basic support", "Standard algorithms", "Daily compounding", "30-day lock period"],
      popular: false,
    },
    {
      id: "growth",
      name: "Growth",
      description: "Our core offering. Optimised HFT strategies for balanced risk/reward.",
      min: 200,
      roi: 14,
      lock: 60,
      features: ["Priority support", "Advanced HFT models", "Weekly distributions", "60-day lock period", "Dedicated dashboard insights"],
      popular: true,
    },
    {
      id: "premium",
      name: "Premium",
      description: "Institutional-grade deployment with maximum capital efficiency.",
      min: 1000,
      roi: 22,
      lock: 90,
      features: ["Dedicated manager", "Bespoke strategy allocation", "Instant withdrawals post-lock", "90-day lock period", "VIP access & early features"],
      popular: false,
    },
  ];

  const handleInvest = (pkgName: string) => {
    if (!user) {
      toast({
        title: t.packages.authRequired,
        description: t.packages.authDesc,
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }
    toast({
      title: t.packages.investInitiated,
      description: `${pkgName} — ${t.packages.investDesc}`,
      className: "border-primary bg-card text-card-foreground",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{t.packages.title}</h1>
          <p className="text-lg text-muted-foreground">
            Select an algorithmic package tailored to your capital and time horizon.
            All funds are secured by multi-signature smart contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              data-testid={`card-package-${pkg.id}`}
            >
              <Card className={`relative h-full flex flex-col ${pkg.popular ? "border-primary shadow-[0_0_30px_rgba(245,158,11,0.15)] bg-card/80" : "bg-card/50 border-border/50"}`}>
                {pkg.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {t.packages.mostPopular}
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription className="min-h-[40px]">{pkg.description}</CardDescription>
                  <div className="mt-4 pb-4 border-b border-border/50">
                    <div className="text-4xl font-mono font-bold text-foreground">
                      <span className="text-xl text-muted-foreground font-sans">{t.packages.from} </span>
                      ${pkg.min}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="text-sm font-medium text-primary">
                        {pkg.roi}% <span className="text-muted-foreground font-normal">{t.packages.monthlyRoi}</span>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <ShieldAlert className="w-3 h-3 mr-1" /> {pkg.lock} {t.packages.days}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start">
                        <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${pkg.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary hover:bg-secondary/80"}`}
                    onClick={() => handleInvest(pkg.name)}
                    data-testid={`button-invest-${pkg.id}`}
                  >
                    {t.packages.investNow}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
