import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import { GraduationCap, LogIn, UserPlus, Eye, ShieldAlert, ArrowRight, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const STORAGE_KEY = "romanex-visit-mode";

export function WelcomeBanner() {
  const { isSignedIn, isLoaded } = useAuth();
  const [visible, setVisible] = useState(false);
  const [showGuestNotice, setShowGuestNotice] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 10000);
      return () => clearTimeout(timer);
    }
    return;
  }, [isLoaded, isSignedIn]);

  const handleGuest = () => {
    setShowGuestNotice(true);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, "guest");
      setVisible(false);
    }, 2800);
  };

  if (!visible) return null;

  const wt = t.welcome;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(10,10,20,0.85)", backdropFilter: "blur(8px)" }}>

      {!showGuestNotice ? (
        <div className="bg-background rounded-2xl border-4 border-foreground shadow-[8px_8px_0_0_hsl(var(--primary))] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">

          {/* Header */}
          <div className="bg-foreground px-6 py-4 flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl border-2 border-background/20 rotate-3">
              <GraduationCap className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-background/50 text-[10px] font-black uppercase tracking-[0.3em]">{wt.subtitle}</p>
              <h1 className="font-display text-xl font-black text-background tracking-tighter uppercase leading-none">
                Roma<span className="text-accent">Nex</span>
              </h1>
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-5 space-y-4">
            <div>
              <h2 className="text-lg font-black font-display uppercase tracking-tighter mb-1">
                {wt.question}
              </h2>
              <p className="text-foreground/60 font-medium text-xs leading-relaxed">
                {wt.desc}
              </p>
            </div>

            <div className="space-y-2">
              {/* Sign In */}
              <Link href="/sign-in" onClick={() => { localStorage.setItem(STORAGE_KEY, "auth"); setVisible(false); }}>
                <div className="group flex items-center gap-3 p-3 rounded-xl border-2 border-foreground bg-primary/5 hover:bg-primary hover:border-primary transition-all duration-200 cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 group-hover:bg-white/20 flex items-center justify-center border-2 border-primary/20 group-hover:border-white/30 shrink-0 transition-colors">
                    <LogIn className="w-4 h-4 text-primary group-hover:text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-sm group-hover:text-white transition-colors">{wt.signIn}</p>
                    <p className="text-xs text-foreground/70 group-hover:text-white/70 font-medium transition-colors">{wt.signInSub}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground/50 group-hover:text-white group-hover:translate-x-1 transition-all" strokeWidth={2.5} />
                </div>
              </Link>

              {/* Register */}
              <Link href="/sign-up" onClick={() => { localStorage.setItem(STORAGE_KEY, "auth"); setVisible(false); }}>
                <div className="group flex items-center gap-3 p-3 rounded-xl border-2 border-foreground bg-accent/5 hover:bg-accent hover:border-accent transition-all duration-200 cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 group-hover:bg-white/20 flex items-center justify-center border-2 border-accent/20 group-hover:border-white/30 shrink-0 transition-colors">
                    <UserPlus className="w-4 h-4 text-accent group-hover:text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-sm group-hover:text-white transition-colors">{wt.register}</p>
                    <p className="text-xs text-foreground/70 group-hover:text-white/70 font-medium transition-colors">{wt.registerSub}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-foreground/50 group-hover:text-white group-hover:translate-x-1 transition-all" strokeWidth={2.5} />
                </div>
              </Link>

              {/* Guest */}
              <button onClick={handleGuest} className="group w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-foreground/20 hover:border-foreground/40 bg-muted/30 hover:bg-muted/60 transition-all duration-200 text-left">
                <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center border-2 border-foreground/10 shrink-0">
                  <Eye className="w-4 h-4 text-foreground/60" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm text-foreground/70">{wt.guest}</p>
                  <p className="text-xs text-foreground/60 font-medium">{wt.guestSub}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-foreground/60 group-hover:translate-x-1 transition-all" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

      ) : (

        <div className="bg-background rounded-3xl border-4 border-foreground shadow-[12px_12px_0_0_hsl(38,92%,44%)] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300 text-center">
          <div className="bg-foreground/5 border-b-4 border-foreground px-8 py-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border-4 border-foreground flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0_0_hsl(var(--foreground))]">
              <ShieldAlert className="w-8 h-8 text-amber-600" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black font-display uppercase tracking-tighter mb-1">{wt.guestMode}</h2>
            <p className="text-foreground/60 font-medium text-sm">{wt.guestModeDesc}</p>
          </div>

          <div className="px-8 py-6 space-y-4">
            <div className="space-y-2 text-left">
              {wt.allowed.map((text, i) => (
                <div key={`ok-${i}`} className="flex items-center gap-3 text-sm font-bold px-3 py-2 rounded-xl bg-green-50 text-green-800">
                  <CheckCircle className="w-4 h-4 shrink-0 text-green-500" strokeWidth={2.5} />
                  {text}
                </div>
              ))}
              {wt.restricted.map((text, i) => (
                <div key={`no-${i}`} className="flex items-center gap-3 text-sm font-bold px-3 py-2 rounded-xl bg-red-50 text-red-700 line-through opacity-70">
                  <CheckCircle className="w-4 h-4 shrink-0 text-red-400" strokeWidth={2.5} />
                  {text}
                </div>
              ))}
            </div>
            <p className="text-xs text-foreground/60 font-medium pt-2">{wt.entering}</p>
          </div>
        </div>
      )}
    </div>
  );
}
