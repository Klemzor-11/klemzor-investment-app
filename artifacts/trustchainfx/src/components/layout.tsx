import { useState, useRef, useEffect, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { LANGUAGES } from "@/lib/translations";
import { Shield, Globe, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatWidget } from "@/components/chat-widget";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type LegalDoc = "privacy" | "terms" | "legal" | null;

const LEGAL_CONTENT: Record<NonNullable<LegalDoc>, { title: string; body: string }> = {
  privacy: {
    title: "Privacy Policy",
    body: `TrustChainFX is committed to protecting your personal data. We collect only the information necessary to operate our platform — including your name, email address, and investment activity. Your data is never sold to third parties.

We use industry-standard AES-256 encryption for all stored data and TLS 1.3 for all data in transit. You may request deletion of your account and all associated data at any time by contacting support@trustchainfx.io.

Cookies are used solely for session management and language preferences. We do not use tracking or advertising cookies.

This policy was last updated: January 2025.`,
  },
  terms: {
    title: "Terms of Service",
    body: `By creating an account on TrustChainFX, you agree to the following terms:

1. You must be at least 18 years of age to use this platform.
2. All investments are subject to lock-in periods as described in each package tier.
3. Projected yields are based on historical algorithm performance and are not guaranteed.
4. TrustChainFX reserves the right to suspend accounts that violate our acceptable use policy.
5. Withdrawals are processed within 24 hours after the lock period expires.
6. You are responsible for complying with the tax laws in your jurisdiction.

For questions, contact support@trustchainfx.io.`,
  },
  legal: {
    title: "Legal Disclaimer",
    body: `The information on this platform does not constitute financial advice. All investment decisions are made at your own risk.

Cryptocurrency and algorithmic trading involve significant risk. Past performance of our algorithms does not guarantee future results. You should only invest funds you can afford to lose.

TrustChainFX is registered in Frankfurt, Germany and operates in compliance with applicable EU financial regulations. We are not liable for losses arising from market volatility, force majeure events, or user-initiated decisions.

For regulatory inquiries, contact legal@trustchainfx.io.`,
  },
};

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const [location] = useLocation();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [legalDoc, setLegalDoc] = useState<LegalDoc>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Close lang dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  const currentLang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/packages", label: t.nav.packages },
    { href: "/calculator", label: t.nav.calculator },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg tracking-wide uppercase text-foreground">
              TrustChain<span className="text-primary">FX</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-muted-foreground"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {/* Language switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen((v) => !v)}
                data-testid="button-language-switcher"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border border-border/40"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{currentLang.flag} {currentLang.label}</span>
                <span className="sm:hidden">{currentLang.flag}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border/60 bg-card shadow-xl z-50 overflow-hidden py-1">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      data-testid={`button-lang-${lang.code}`}
                      onClick={() => { setLocale(lang.code); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors hover:bg-secondary ${locale === lang.code ? "text-primary font-medium bg-primary/5" : "text-muted-foreground"}`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth buttons — desktop */}
            <div className="hidden md:flex items-center gap-2">
              {user?.loggedIn ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary">
                      {t.nav.dashboard}
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={logout} className="text-muted-foreground hover:text-foreground">
                    {t.nav.logout}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                      {t.nav.login}
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold tracking-wide">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              data-testid="button-mobile-menu"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-secondary ${location === link.href ? "text-primary bg-primary/5" : "text-muted-foreground"}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border/40 mt-2 space-y-1">
              {user?.loggedIn ? (
                <>
                  <Link href="/dashboard" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
                    {t.nav.dashboard}
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
                    {t.nav.login}
                  </Link>
                  <Link href="/signup" className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-primary hover:bg-primary/10 transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <ChatWidget />

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/40 bg-card/30">
        <div className="container mx-auto px-4 md:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-bold tracking-wide uppercase text-foreground">
                  TrustChain<span className="text-primary">FX</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Institutional-grade algorithmic investment infrastructure for the digital economy.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.footer.about}</Link></li>
                <li><Link href="/packages" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.packages}</Link></li>
                <li><Link href="/calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.calculator}</Link></li>
                <li><Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Create Account</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setLegalDoc("privacy")} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">
                    {t.footer.privacy}
                  </button>
                </li>
                <li>
                  <button onClick={() => setLegalDoc("terms")} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">
                    {t.footer.terms}
                  </button>
                </li>
                <li>
                  <button onClick={() => setLegalDoc("legal")} className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">
                    {t.footer.legal}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">{t.footer.contact}</h4>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:support@trustchainfx.io" className="text-sm text-muted-foreground font-mono hover:text-primary transition-colors">
                    support@trustchainfx.io
                  </a>
                </li>
                <li><span className="text-sm text-muted-foreground">Frankfurt, Germany</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} TrustChainFX. {t.footer.rights}
            </p>
            <p className="text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors cursor-default select-none">
              {t.footer.developer}
            </p>
          </div>
        </div>
      </footer>

      {/* ── LEGAL MODAL ── */}
      <Dialog open={!!legalDoc} onOpenChange={(open) => { if (!open) setLegalDoc(null); }}>
        <DialogContent className="max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {legalDoc ? LEGAL_CONTENT[legalDoc].title : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line max-h-[60vh] overflow-y-auto pr-1">
            {legalDoc ? LEGAL_CONTENT[legalDoc].body : ""}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
