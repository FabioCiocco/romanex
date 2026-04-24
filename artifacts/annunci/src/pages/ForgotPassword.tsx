import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { GraduationCap, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch {
      setError(t.auth?.serverError ?? "Errore del server. Riprova.");
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
            {sent ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-green-100 border-2 border-foreground flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-green-600" strokeWidth={2.5} />
                </div>
                <h2 className="font-display text-xl font-black uppercase tracking-tighter mb-2">
                  {t.auth?.resetSentTitle ?? "Email inviata!"}
                </h2>
                <p className="text-foreground/60 text-sm font-medium mb-6">
                  {t.auth?.resetSentDesc ?? "Controlla la tua email e segui le istruzioni per reimpostare la password."}
                </p>
                <Link href="/sign-in" className="text-primary font-black hover:underline text-sm">
                  ← {t.auth?.backToLogin ?? "Torna al login"}
                </Link>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-black uppercase tracking-tighter mb-1">
                  {t.auth?.forgotTitle ?? "Password dimenticata"}
                </h2>
                <p className="text-foreground/50 text-sm font-medium mb-6">
                  {t.auth?.forgotSub ?? "Inserisci la tua email e ti inviamo un link per reimpostare la password."}
                </p>

                {error && (
                  <div className="mb-4 px-4 py-3 rounded-xl border-2 border-red-500 bg-red-50 text-red-700 text-sm font-bold">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-foreground rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      placeholder="tua@email.it"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-primary text-primary-foreground font-black uppercase tracking-wider rounded-xl border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] hover:translate-y-[2px] hover:translate-x-[2px] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {t.auth?.sendResetLink ?? "Invia link di reset"}
                  </button>
                </form>

                <p className="text-center text-sm text-foreground/50 font-medium mt-6">
                  <Link href="/sign-in" className="text-primary font-black hover:underline">
                    ← {t.auth?.backToLogin ?? "Torna al login"}
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
