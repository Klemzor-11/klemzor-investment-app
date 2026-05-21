import { useState, useRef, useEffect, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { LANGUAGES } from "@/lib/translations";
import { Shield, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatWidget } from "@/components/chat-widget";

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { t, locale, setLocale } = useLanguage();
  const [location] = useLocation();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[0];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-primary">
            <Shield className="w-6 h-6" />
            <span className="font-bold text-lg tracking-wide uppercase text-foreground">
              TrustChain<span className="text-primary">FX</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors hover:text-primary ${location === "/" ? "text-primary" : "text-muted-foreground"}`}
            >
              {t.nav.home}
            </Link>
            <Link
              href="/packages"
              className={`transition-colors hover:text-primary ${location === "/packages" ? "text-primary" : "text-muted-foreground"}`}
            >
              {t.nav.packages}
            </Link>
            <Link
              href="/calculator"
              className={`transition-colors hover:text-primary ${location === "/calculator" ? "text-primary" : "text-muted-foreground"}`}
            >
              {t.nav.calculator}
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
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
              <div className="flex items-center gap-2">
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
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <ChatWidget />

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
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Legal</h4>
              <ul className="space-y-2">
                <li><span className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">{t.footer.privacy}</span></li>
                <li><span className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">{t.footer.terms}</span></li>
                <li><span className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">{t.footer.legal}</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">{t.footer.contact}</h4>
              <ul className="space-y-2">
                <li><span className="text-sm text-muted-foreground font-mono">support@trustchainfx.io</span></li>
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
    </div>
  );
}
