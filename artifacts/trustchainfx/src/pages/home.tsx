import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, ShieldCheck, Zap } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function Home() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8 py-24 md:py-32 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              {t.home.badge}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
              {t.home.headline}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {t.home.headlineAccent}
              </span>.
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              {t.home.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button
                  size="lg"
                  data-testid="button-get-started"
                  className="w-full sm:w-auto text-lg h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                >
                  {t.home.cta1} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/packages">
                <Button
                  size="lg"
                  variant="outline"
                  data-testid="button-view-packages"
                  className="w-full sm:w-auto text-lg h-14 px-8 border-border hover:bg-secondary"
                >
                  {t.home.cta2}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-card/50 border-y border-border py-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t.home.feat1Title}</h3>
              <p className="text-muted-foreground">{t.home.feat1Desc}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 text-accent">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t.home.feat2Title}</h3>
              <p className="text-muted-foreground">{t.home.feat2Desc}</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t.home.feat3Title}</h3>
              <p className="text-muted-foreground">{t.home.feat3Desc}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
