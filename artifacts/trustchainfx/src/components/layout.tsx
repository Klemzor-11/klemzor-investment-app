import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

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
              Home
            </Link>
            <Link 
              href="/packages" 
              className={`transition-colors hover:text-primary ${location === "/packages" ? "text-primary" : "text-muted-foreground"}`}
            >
              Packages
            </Link>
            <Link 
              href="/calculator" 
              className={`transition-colors hover:text-primary ${location === "/calculator" ? "text-primary" : "text-muted-foreground"}`}
            >
              Calculator
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user?.loggedIn ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" onClick={logout} className="text-muted-foreground hover:text-foreground">
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold tracking-wide">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="border-t border-border/40 bg-background/80 py-6">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <span className="font-semibold tracking-wide uppercase text-foreground/60">
            TrustChain<span className="text-primary">FX</span>
          </span>
          <span>
            Developed by{" "}
            <span className="text-primary font-medium">Andrea Donato</span>
            {" "}— Germany
          </span>
          <span>&copy; {new Date().getFullYear()} TrustChainFX. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}