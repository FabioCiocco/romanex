import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { GraduationCap, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function useSearchParam(key: string): string {
  const [val, setVal] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) ?? "";
  });
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVal(params.get(key) ?? "");
  }, [key]);
  return val;
}

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const token = useSearchParam("token");

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" strokeWidth={2} />
          <h2 className="font-display text-xl font-black uppercase tracking-tighter mb-2">Link non valido</h2>
          <p className="text-foreground/50 text-sm mb-4">Il link di reset non è valido o è scaduto.</p>
          <Link href="/forgot-password" className="text-primary font-black hover:underline">Richiedi un nuovo link</Link>
        </div>
      </div>
    );
  }

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
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => setLocation("/sign-in"), 3000);
    } catch (err: unknown) {
      const e = err as { error?: string };
      if (e?.error === "TOKEN_INVALID") {
        setError(t.auth?.tokenInvalid ?? "Il link è scaduto o non valido. Richiedi un nuovo reset.");
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
            {done ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-green-100 border-2 border-foreground flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-green-600" strokeWidth={2.5} />
                </div>
                <h2 className="font-display text-xl font-black uppercase tracking-tighter mb-2">Password aggiornata!</h2>
                <p className="text-foreground/60 text-sm font-medium">Redirect al login in corso…</p>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-black uppercase tracking-tighter mb-1">
                  {t.auth?.resetTitle ?? "Nuova password"}
                </h2>
                <p className="text-foreground/50 text-sm font-medium mb-6">
                  {t.auth?.resetSub ?? "Scegli una nuova password sicura."}
                </p>

                {error && (
                  <div className="mb-4 px-4 py-3 rounded-xl border-2 border-red-500 bg-red-50 text-red-700 text-sm font-bold">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Nuova password <span className="text-foreground/40 normal-case font-medium">(min. 8 caratteri)</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border-2 border-foreground rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">Conferma password</label>
                    <input
                      type={showPass ? "text" : "password"}
                      required
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
                    Aggiorna password
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
