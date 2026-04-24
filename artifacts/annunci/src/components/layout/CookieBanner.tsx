import { useState, useEffect } from "react";
import { Cookie, X, Check } from "lucide-react";
import { Link } from "wouter";

const CONSENT_KEY = "romanex_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
      <div
        className="max-w-2xl mx-auto bg-foreground text-background rounded-2xl border-2 border-foreground shadow-[6px_6px_0_0_hsl(var(--primary))] pointer-events-auto"
        role="dialog"
        aria-label="Banner consenso cookie"
      >
        <div className="flex items-start gap-4 p-5">
          <div className="bg-accent text-foreground rounded-xl p-2 flex-shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-base uppercase tracking-tight mb-1">
              Questo sito usa i cookie 🍪
            </p>
            <p className="text-background/70 text-sm leading-relaxed font-medium">
              Utilizziamo solo cookie tecnici necessari al funzionamento del sito e all'autenticazione. 
              Nessun cookie di tracciamento o pubblicitario.{" "}
              <Link
                href="/cookie-policy"
                className="text-accent font-bold underline underline-offset-2 hover:no-underline"
              >
                Cookie Policy
              </Link>{" "}
              ·{" "}
              <Link
                href="/privacy"
                className="text-accent font-bold underline underline-offset-2 hover:no-underline"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
          <button
            onClick={reject}
            className="text-background/40 hover:text-background/80 transition-colors flex-shrink-0 mt-0.5"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-3 px-5 pb-5">
          <button
            onClick={accept}
            className="flex-1 flex items-center justify-center gap-2 bg-accent text-foreground font-black text-sm uppercase tracking-wider py-2.5 px-4 rounded-xl hover:brightness-110 transition-all border-2 border-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))] hover:shadow-[1px_1px_0_0_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            <Check className="w-4 h-4" />
            Accetta
          </button>
          <button
            onClick={reject}
            className="flex-1 flex items-center justify-center gap-2 bg-background/10 text-background font-black text-sm uppercase tracking-wider py-2.5 px-4 rounded-xl hover:bg-background/20 transition-colors border-2 border-background/20"
          >
            Solo necessari
          </button>
        </div>
      </div>
    </div>
  );
}
