import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lang, LANG_LABELS } from "@/lib/i18n";

const LANGS: Lang[] = ["it", "en", "es"];

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = LANG_LABELS[lang];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/15"
      >
        <Globe className="w-4 h-4" strokeWidth={2.5} />
        <span className="text-base">{current.flag}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={3} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 min-w-[160px]">
          <div className="p-1">
            {LANGS.map((l) => {
              const { flag, label } = LANG_LABELS[l];
              const active = lang === l;
              return (
                <button
                  key={l}
                  onClick={() => { setLang(l); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    active
                      ? "bg-violet-600/20 text-violet-300"
                      : "text-white/70 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <span className="text-base">{flag}</span>
                  <span>{label}</span>
                  {active && <Check className="w-3.5 h-3.5 ml-auto text-violet-400" strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
