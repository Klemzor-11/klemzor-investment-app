import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth, consumeLoginRedirect } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 3) { setError("Invalid credentials."); return; }
    login(email);
    const redirect = consumeLoginRedirect();
    setLocation(redirect);
  };

  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center py-12 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl p-8 relative z-10">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Shield className="w-8 h-8" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2 tracking-tight">{t.login.title}</h2>
            <p className="text-muted-foreground text-center mb-8 text-sm font-mono">{t.login.subtitle}</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">
                  {t.login.emailLabel}
                </Label>
                <Input
                  id="email" type="email"
                  placeholder={t.login.emailPlaceholder}
                  className="bg-background border-border focus:border-primary/50 font-mono"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-email" required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-widest text-muted-foreground">
                  {t.login.passwordLabel}
                </Label>
                <Input
                  id="password" type="password" placeholder="••••••••"
                  className="bg-background border-border focus:border-primary/50 font-mono tracking-widest"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  data-testid="input-password" required
                />
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                data-testid="button-submit-login"
                className="w-full h-12 text-md font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all"
              >
                {t.login.submitBtn}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline font-medium">Create one free</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
