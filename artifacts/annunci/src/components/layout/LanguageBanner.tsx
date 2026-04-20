import { useState, useEffect } from "react";
import { Globe, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lang, LANG_LABELS } from "@/lib/i18n";

const DISMISSED_KEY = "romanex-lang-banner-dismissed";

const LANGS: Lang[] = ["it", "en", "es"];

export function LanguageBanner() {
  const { lang, setLang, t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  };

  const choose = (l: Lang) => {
    setLang(l);
    dismiss();
  };

  if (!visible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-white/70 text-xs font-medium uppercase tracking-widest shrink-0">
          <Globe className="w-4 h-4 text-violet-400" strokeWidth={2.5} />
          <span>{t.language.chooseLang}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center">
          {LANGS.map((l) => {
            const { flag, label } = LANG_LABELS[l];
            const active = lang === l;
            return (
              <button
                key={l}
                onClick={() => choose(l)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold border transition-all duration-200 ${
                  active
                    ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/30"
                    : "bg-white/5 border-white/15 text-white/70 hover:bg-white/10 hover:text-white hover:border-white/30"
                }`}
              >
                <span className="text-base">{flag}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={dismiss}
          className="ml-auto text-white/40 hover:text-white/80 transition-colors shrink-0 hidden sm:block"
          aria-label="Chiudi"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
