import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { GraduationCap, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function SignUp() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const qc = useQueryClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== password2) {
      setError(t.auth?.passwordMismatch ?? "Le password non coincidono.");
      return;
    }
    if (password.length < 8) {
      setError(t.auth?.passwordTooShort ?? "La password deve essere di almeno 8 caratteri.");
      return;
    }
    setLoading(true);
    try {
      await register(email.trim(), password);
      qc.clear();
      setLocation("/completa-profilo");
    } catch (err: unknown) {
      const e = err as { error?: string };
      if (e?.error === "EMAIL_TAKEN") {
        setError(t.auth?.emailTaken ?? "Email già registrata. Prova ad accedere.");
      } else if (e?.error === "PASSWORD_TOO_SHORT") {
        setError(t.auth?.passwordTooShort ?? "La password deve essere di almeno 8 caratteri.");
      } else {
        setError(t.auth?.serverError ?? "Errore del server. Riprova.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <button
          onClick={() => window.history.length > 1 ? window.history.back() : setLocation("/")}
          className="flex items-center gap-2 text-foreground/50 hover:text-foreground font-bold text-sm mb-4 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
          Torna indietro
        </button>

        <div className="rounded-2xl border-4 border-foreground shadow-[8px_8px_0_0_hsl(var(--foreground))] overflow-hidden">

          <div className="bg-foreground px-6 py-5 flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl border-2 border-background/20 rotate-3">
              <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-background/50 text-[10px] font-black uppercase tracking-[0.3em]">Studenti di Roma</p>
              <h1 className="font-display text-xl font-black text-background tracking-tighter uppercase leading-none">
                Roma<span className="text-accent">Nex</span>
              </h1>
            </div>
          </div>

          <div className="bg-background px-6 py-6">
            <h2 className="font-display text-2xl font-black uppercase tracking-tighter mb-1">
              {t.auth?.signUpTitle ?? "Crea account"}
            </h2>
            <p className="text-foreground/50 text-sm font-medium mb-6">
              {t.auth?.signUpSub ?? "Unisciti alla community di studenti romani"}
            </p>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl border-2 border-red-500 bg-red-50 text-red-700 text-sm font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5">Email universitaria</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-foreground rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="tua@uniroma.it"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                  {t.auth?.password ?? "Password"} <span className="text-foreground/40 normal-case font-medium">(min. 8 caratteri)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border-2 border-foreground rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                  {t.auth?.confirmPassword ?? "Conferma password"}
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password2}
                  onChange={e => setPassword2(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-foreground rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary text-primary-foreground font-black uppercase tracking-wider rounded-xl border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] hover:translate-y-[2px] hover:translate-x-[2px] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {t.auth?.signUpBtn ?? "Registrati"}
              </button>
            </form>

            <p className="text-center text-sm text-foreground/50 font-medium mt-6">
              {t.auth?.hasAccount ?? "Hai già un account?"}{" "}
              <Link href="/sign-in" className="text-primary font-black hover:underline">
                {t.auth?.loginLink ?? "Accedi"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
