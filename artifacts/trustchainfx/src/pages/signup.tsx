import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth, consumeLoginRedirect } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const SIGNUP_TEXT: Record<string, Record<string, string>> = {
  "en-us": { title: "Create Account", subtitle: "Join thousands of investors worldwide", nameLabel: "Full Name", namePlaceholder: "John Smith", emailLabel: "Email Address", emailPlaceholder: "investor@domain.com", passwordLabel: "Password", confirmLabel: "Confirm Password", submitBtn: "Create My Account", loginPrompt: "Already have an account?", loginCta: "Sign In", mismatch: "Passwords do not match", passwordHint: "Password must be at least 6 characters" },
  "en-gb": { title: "Create Account", subtitle: "Join thousands of investors worldwide", nameLabel: "Full Name", namePlaceholder: "John Smith", emailLabel: "Email Address", emailPlaceholder: "investor@domain.co.uk", passwordLabel: "Password", confirmLabel: "Confirm Password", submitBtn: "Create My Account", loginPrompt: "Already have an account?", loginCta: "Sign In", mismatch: "Passwords do not match", passwordHint: "Password must be at least 6 characters" },
  "es": { title: "Crear Cuenta", subtitle: "Únete a miles de inversores en todo el mundo", nameLabel: "Nombre Completo", namePlaceholder: "Juan García", emailLabel: "Correo Electrónico", emailPlaceholder: "inversor@dominio.com", passwordLabel: "Contraseña", confirmLabel: "Confirmar Contraseña", submitBtn: "Crear Mi Cuenta", loginPrompt: "¿Ya tienes una cuenta?", loginCta: "Iniciar sesión", mismatch: "Las contraseñas no coinciden", passwordHint: "La contraseña debe tener al menos 6 caracteres" },
  "fr": { title: "Créer un Compte", subtitle: "Rejoignez des milliers d'investisseurs dans le monde", nameLabel: "Nom Complet", namePlaceholder: "Jean Dupont", emailLabel: "Adresse E-mail", emailPlaceholder: "investisseur@domaine.fr", passwordLabel: "Mot de Passe", confirmLabel: "Confirmer le Mot de Passe", submitBtn: "Créer Mon Compte", loginPrompt: "Vous avez déjà un compte?", loginCta: "Se Connecter", mismatch: "Les mots de passe ne correspondent pas", passwordHint: "Le mot de passe doit contenir au moins 6 caractères" },
  "zh": { title: "创建账户", subtitle: "加入全球数千名投资者", nameLabel: "全名", namePlaceholder: "张伟", emailLabel: "电子邮件", emailPlaceholder: "investor@domain.com", passwordLabel: "密码", confirmLabel: "确认密码", submitBtn: "创建我的账户", loginPrompt: "已有账户？", loginCta: "登录", mismatch: "密码不匹配", passwordHint: "密码至少需要6个字符" },
  "de": { title: "Konto Erstellen", subtitle: "Schließen Sie sich Tausenden von Investoren weltweit an", nameLabel: "Vollständiger Name", namePlaceholder: "Max Mustermann", emailLabel: "E-Mail-Adresse", emailPlaceholder: "investor@domain.de", passwordLabel: "Passwort", confirmLabel: "Passwort Bestätigen", submitBtn: "Mein Konto Erstellen", loginPrompt: "Haben Sie bereits ein Konto?", loginCta: "Anmelden", mismatch: "Passwörter stimmen nicht überein", passwordHint: "Passwort muss mindestens 6 Zeichen lang sein" },
  "pt": { title: "Criar Conta", subtitle: "Junte-se a milhares de investidores no mundo todo", nameLabel: "Nome Completo", namePlaceholder: "João Silva", emailLabel: "Endereço de E-mail", emailPlaceholder: "investidor@dominio.com.br", passwordLabel: "Senha", confirmLabel: "Confirmar Senha", submitBtn: "Criar Minha Conta", loginPrompt: "Já tem uma conta?", loginCta: "Entrar", mismatch: "As senhas não coincidem", passwordHint: "A senha deve ter pelo menos 6 caracteres" },
  "ja": { title: "アカウント作成", subtitle: "世界中の何千人もの投資家に参加する", nameLabel: "フルネーム", namePlaceholder: "山田 太郎", emailLabel: "メールアドレス", emailPlaceholder: "investor@domain.jp", passwordLabel: "パスワード", confirmLabel: "パスワード確認", submitBtn: "アカウントを作成", loginPrompt: "すでにアカウントをお持ちですか？", loginCta: "サインイン", mismatch: "パスワードが一致しません", passwordHint: "パスワードは6文字以上必要です" },
};

const perks = [
  "No management fees on Starter & Growth",
  "Instant account activation",
  "Military-grade 256-bit encryption",
  "24/7 dedicated support",
];

export default function Signup() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { locale } = useLanguage();
  const s = SIGNUP_TEXT[locale] ?? SIGNUP_TEXT["en-us"];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Please enter your full name."); return; }
    if (password !== confirm) { setError(s.mismatch); return; }
    if (password.length < 6) { setError(s.passwordHint); return; }
    login(email, name.trim());
    const redirect = consumeLoginRedirect();
    setLocation(redirect);
  };

  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center py-12 px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-[-5%] w-72 h-72 rounded-full bg-primary/8 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-[-5%] w-72 h-72 rounded-full bg-accent/8 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex flex-col gap-8"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-bold tracking-wide uppercase text-sm text-foreground/70">
                  TrustChain<span className="text-primary">FX</span>
                </span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-3 leading-tight">
                Your capital, working <span className="text-primary">around the clock</span>.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Access institutional-grade algorithmic yields. Deploy as little as $50 and watch it grow with military-grade security backing every transaction.
              </p>
            </div>

            <div className="space-y-3">
              {perks.map((perk) => (
                <div key={perk} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground">{perk}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card/50 border border-border/50 rounded-xl p-4">
                <div className="text-2xl font-mono font-bold text-primary">$2.4B+</div>
                <div className="text-xs text-muted-foreground mt-1">Assets Under Management</div>
              </div>
              <div className="bg-card/50 border border-border/50 rounded-xl p-4">
                <div className="text-2xl font-mono font-bold text-accent">150K+</div>
                <div className="text-xs text-muted-foreground mt-1">Active Investors</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl p-8">
              <div className="flex justify-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <Shield className="w-7 h-7" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center mb-1 tracking-tight">{s.title}</h2>
              <p className="text-muted-foreground text-center mb-6 text-sm">{s.subtitle}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs uppercase tracking-widest text-muted-foreground">{s.nameLabel}</Label>
                  <Input
                    id="name" type="text" placeholder={s.namePlaceholder}
                    className="bg-background border-border focus:border-primary/50"
                    value={name} onChange={(e) => setName(e.target.value)}
                    data-testid="input-name" required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-email" className="text-xs uppercase tracking-widest text-muted-foreground">{s.emailLabel}</Label>
                  <Input
                    id="signup-email" type="email" placeholder={s.emailPlaceholder}
                    className="bg-background border-border focus:border-primary/50 font-mono"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-signup-email" required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-password" className="text-xs uppercase tracking-widest text-muted-foreground">{s.passwordLabel}</Label>
                  <Input
                    id="signup-password" type="password" placeholder="••••••••"
                    className="bg-background border-border focus:border-primary/50 font-mono tracking-widest"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    data-testid="input-signup-password" required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password" className="text-xs uppercase tracking-widest text-muted-foreground">{s.confirmLabel}</Label>
                  <Input
                    id="confirm-password" type="password" placeholder="••••••••"
                    className="bg-background border-border focus:border-primary/50 font-mono tracking-widest"
                    value={confirm} onChange={(e) => setConfirm(e.target.value)}
                    data-testid="input-confirm-password" required
                  />
                </div>

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  data-testid="button-submit-signup"
                  className="w-full h-12 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all mt-2"
                >
                  {s.submitBtn}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                {s.loginPrompt}{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">{s.loginCta}</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
