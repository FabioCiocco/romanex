import { useState, useEffect } from "react";
import { useUser } from "@clerk/react";
import { Link } from "wouter";
import { ShieldAlert, X, LogIn, UserPlus } from "lucide-react";

const STORAGE_KEY = "romanex-visit-mode";

export function GuestBar() {
  const { isSignedIn, isLoaded } = useUser();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      localStorage.removeItem(STORAGE_KEY);
      setVisible(false);
      return;
    }
    setVisible(localStorage.getItem(STORAGE_KEY) === "guest");
  }, [isLoaded, isSignedIn]);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "guest-dismissed");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="w-full bg-amber-50 border-b-2 border-amber-300/70 px-4 py-2">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" strokeWidth={2.5} />
          <p className="text-amber-800 font-bold text-xs truncate">
            <span className="font-black uppercase tracking-wide">Modalità ospite</span>
            <span className="hidden sm:inline text-amber-700 font-medium"> — contatti e pubblicazione riservati agli iscritti.</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/sign-in">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1.5 rounded-full transition-colors cursor-pointer">
              <LogIn className="w-3.5 h-3.5" strokeWidth={2.5} />
              Accedi
            </span>
          </Link>
          <Link href="/sign-up">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-full transition-colors cursor-pointer">
              <UserPlus className="w-3.5 h-3.5" strokeWidth={2.5} />
              Registrati
            </span>
          </Link>
          <button onClick={dismiss} className="p-1 rounded-full hover:bg-amber-200 text-amber-500 hover:text-amber-700 transition-colors ml-1">
            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
