import { useState, useEffect } from "react";
import { useUser } from "@clerk/react";
import { Link } from "wouter";
import { GraduationCap, LogIn, UserPlus, Eye, ShieldAlert, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "romanex-visit-mode";

export function WelcomeBanner() {
  const { isSignedIn, isLoaded } = useUser();
  const [visible, setVisible] = useState(false);
  const [showGuestNotice, setShowGuestNotice] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, [isLoaded, isSignedIn]);

  const handleGuest = () => {
    setShowGuestNotice(true);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, "guest");
      setVisible(false);
    }, 2800);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(10,10,20,0.85)", backdropFilter: "blur(8px)" }}>

      {!showGuestNotice ? (
        /* ── Scelta principale ── */
        <div className="bg-background rounded-3xl border-4 border-foreground shadow-[12px_12px_0_0_hsl(var(--primary))] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">

          {/* Header */}
          <div className="bg-foreground px-8 py-7 flex items-center gap-4">
            <div className="bg-primary text-primary-foreground p-2.5 rounded-2xl border-2 border-background/20 rotate-3">
              <GraduationCap className="h-8 w-8" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-background/50 text-xs font-black uppercase tracking-[0.3em]">Benvenuto su</p>
              <h1 className="font-display text-3xl font-black text-background tracking-tighter uppercase leading-none">
                Roma<span className="text-accent">Nex</span>
              </h1>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-7 space-y-6">
            <div>
              <h2 className="text-2xl font-black font-display uppercase tracking-tighter mb-2">
                Come vuoi continuare?
              </h2>
              <p className="text-foreground/60 font-medium text-sm leading-relaxed">
                La bacheca degli universitari romani. Appartamenti, libri, ripetizioni e molto altro.
              </p>
            </div>

            <div className="space-y-3">
              {/* Accedi */}
              <Link href="/sign-in" onClick={() => setVisible(false)}>
                <div className="group flex items-center gap-4 p-4 rounded-2xl border-2 border-foreground bg-primary/5 hover:bg-primary hover:border-primary transition-all duration-200 cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 group-hover:bg-white/20 flex items-center justify-center border-2 border-primary/20 group-hover:border-white/30 shrink-0 transition-colors">
                    <LogIn className="w-5 h-5 text-primary group-hover:text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-base group-hover:text-white transition-colors">Accedi</p>
                    <p className="text-sm text-foreground/50 group-hover:text-white/70 font-medium transition-colors">Hai già un account? Entra subito</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-foreground/30 group-hover:text-white group-hover:translate-x-1 transition-all" strokeWidth={2.5} />
                </div>
              </Link>

              {/* Registrati */}
              <Link href="/sign-up" onClick={() => setVisible(false)}>
                <div className="group flex items-center gap-4 p-4 rounded-2xl border-2 border-foreground bg-accent/5 hover:bg-accent hover:border-accent transition-all duration-200 cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-accent/10 group-hover:bg-white/20 flex items-center justify-center border-2 border-accent/20 group-hover:border-white/30 shrink-0 transition-colors">
                    <UserPlus className="w-5 h-5 text-accent group-hover:text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-base group-hover:text-white transition-colors">Crea account gratis</p>
                    <p className="text-sm text-foreground/50 group-hover:text-white/70 font-medium transition-colors">Accesso completo in meno di un minuto</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-foreground/30 group-hover:text-white group-hover:translate-x-1 transition-all" strokeWidth={2.5} />
                </div>
              </Link>

              {/* Ospite */}
              <button onClick={handleGuest} className="group w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-foreground/20 hover:border-foreground/40 bg-muted/30 hover:bg-muted/60 transition-all duration-200 text-left">
                <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center border-2 border-foreground/10 shrink-0">
                  <Eye className="w-5 h-5 text-foreground/40" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="font-black text-base text-foreground/60">Naviga come ospite</p>
                  <p className="text-sm text-foreground/40 font-medium">Solo visualizzazione — alcune funzioni sono bloccate</p>
                </div>
                <ArrowRight className="w-5 h-5 text-foreground/20 group-hover:text-foreground/40 group-hover:translate-x-1 transition-all" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

      ) : (

        /* ── Avviso modalità ospite ── */
        <div className="bg-background rounded-3xl border-4 border-foreground shadow-[12px_12px_0_0_hsl(38,92%,44%)] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 text-center">
          <div className="bg-foreground/5 border-b-4 border-foreground px-8 py-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-4 border-foreground flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0_0_hsl(var(--foreground))]">
              <ShieldAlert className="w-8 h-8 text-amber-600" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black font-display uppercase tracking-tighter mb-1">Modalità ospite</h2>
            <p className="text-foreground/60 font-medium text-sm">Stai navigando con accesso limitato</p>
          </div>

          <div className="px-8 py-6 space-y-4">
            <div className="space-y-2 text-left">
              {[
                { ok: true,  text: "Sfoglia tutti gli annunci" },
                { ok: true,  text: "Leggi descrizioni e prezzi" },
                { ok: false, text: "Visualizza i contatti" },
                { ok: false, text: "Pubblica annunci" },
                { ok: false, text: "Salva nei preferiti" },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 text-sm font-bold px-3 py-2 rounded-xl ${item.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700 line-through opacity-70"}`}>
                  <CheckCircle className={`w-4 h-4 shrink-0 ${item.ok ? "text-green-500" : "text-red-400"}`} strokeWidth={2.5} />
                  {item.text}
                </div>
              ))}
            </div>
            <p className="text-xs text-foreground/40 font-medium pt-2">Entri nella bacheca tra un momento…</p>
          </div>
        </div>
      )}
    </div>
  );
}
