import { Layout } from "@/components/layout";
import { PriceTicker } from "@/components/price-ticker";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, ShieldCheck, Zap, Star } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const HERO_IMAGES = [
  { src: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&q=80",  alt: "Bitcoin coin",           className: "rounded-2xl w-full h-40 object-cover shadow-lg" },
  { src: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80",  alt: "Stock trading charts",   className: "rounded-2xl w-full h-40 object-cover shadow-lg" },
  { src: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=600&q=80",  alt: "Gold coins investment",  className: "rounded-2xl w-full h-40 object-cover shadow-lg" },
  { src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",  alt: "Business investment team", className: "rounded-2xl w-full h-40 object-cover shadow-lg" },
];

const STATS = [
  { value: "$2.4B+", label: "Assets Managed" },
  { value: "150K+", label: "Active Investors" },
  { value: "190+",  label: "Countries" },
  { value: "99.9%", label: "Uptime" },
];

const TESTIMONIALS = [
  { name: "Marcus W.", role: "Portfolio Manager, Frankfurt", quote: "TrustChainFX gave me institutional access to algorithmic yields I couldn't get anywhere else. My Growth package has returned 14% every month for six months straight.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80", stars: 5 },
  { name: "Sofia R.", role: "Independent Investor, Madrid", quote: "I started with the Starter pack at $50 just to test it. Within 30 days I upgraded to Premium. The transparency and consistent returns are unlike anything I've used.", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b193?w=120&q=80", stars: 5 },
  { name: "James T.", role: "Entrepreneur, London", quote: "The security architecture is genuinely impressive. Cold storage multi-sig with real-time monitoring. I sleep well knowing my capital is protected at every layer.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80", stars: 5 },
];

const GALLERY = [
  { src: "https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=800&q=80", alt: "Crypto trading terminal" },
  { src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80", alt: "Investor with laptop" },
  { src: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80", alt: "Analyst reviewing returns" },
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* ── LIVE PRICE TICKER ── */}
      <PriceTicker />

      {/* ── HERO ── */}
      <div className="relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[60%] rounded-full bg-primary/8 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] rounded-full bg-accent/8 blur-[140px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-7 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              {t.home.badge}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5 leading-[1.08]">
              {t.home.headline}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {t.home.headlineAccent}
              </span>.
            </h1>
            <p className="text-lg text-muted-foreground mb-9 leading-relaxed max-w-lg">
              {t.home.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/signup">
                <Button size="lg" data-testid="button-get-started" className="text-lg h-13 px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_24px_rgba(245,158,11,0.35)]">
                  {t.home.cta1} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/packages">
                <Button size="lg" variant="outline" data-testid="button-view-packages" className="text-lg h-13 px-8 border-border hover:bg-secondary">
                  {t.home.cta2}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right — image mosaic */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="grid grid-cols-2 gap-3"
          >
            {HERO_IMAGES.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className={`overflow-hidden rounded-2xl border border-border/30 shadow-xl ${i === 1 ? "mt-5" : ""} ${i === 3 ? "-mt-5" : ""}`}
              >
                <img src={img.src} alt={img.alt} className="w-full h-44 object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div className="border-y border-border/50 bg-card/40">
        <div className="container mx-auto px-4 md:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <div className="text-3xl font-mono font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div className="bg-card/30 py-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Built for serious capital</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Every decision at TrustChainFX is made to protect and grow your investment with precision.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck className="w-8 h-8" />, title: t.home.feat1Title, desc: t.home.feat1Desc, color: "text-primary", bg: "bg-primary/10" },
              { icon: <Zap className="w-8 h-8" />, title: t.home.feat2Title, desc: t.home.feat2Desc, color: "text-accent", bg: "bg-accent/10" },
              { icon: <BarChart3 className="w-8 h-8" />, title: t.home.feat3Title, desc: t.home.feat3Desc, color: "text-primary", bg: "bg-primary/10" },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-8 rounded-2xl border border-border/40 bg-card/50 hover:border-primary/30 transition-colors"
              >
                <div className={`w-16 h-16 rounded-2xl ${feat.bg} flex items-center justify-center mb-6 ${feat.color}`}>{feat.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feat.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── GALLERY STRIP ── */}
      <div className="py-16 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GALLERY.map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="overflow-hidden rounded-2xl border border-border/30 shadow-lg">
                <img src={img.src} alt={img.alt} className="w-full h-56 object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div className="bg-card/30 border-t border-border/40 py-24">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Real people. Real returns.</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Thousands of investors across 190+ countries trust TrustChainFX with their capital.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="bg-card/60 border border-border/50 rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/25 transition-colors"
              >
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.stars }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-border/40">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover border border-border/50" />
                  <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <div className="relative overflow-hidden border-t border-border/40">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
              Start with as little as <span className="text-primary">$50</span>.
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-lg">
              Deploy capital today and receive your first yield distribution within 30 days.
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                Open Your Account <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
