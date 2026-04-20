import { Megaphone, Mail, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function AdBanner() {
  const { t } = useLanguage();
  const ad = t.adBanner;

  return (
    <div className="w-full border-t-2 border-foreground/10 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">

          <div className="flex items-center gap-3 text-foreground/40">
            <div className="w-8 h-8 rounded-lg border-2 border-dashed border-foreground/20 flex items-center justify-center shrink-0">
              <Megaphone className="w-4 h-4" strokeWidth={2} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em]">{ad.label}</span>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-2xl h-16 rounded-xl border-2 border-dashed border-foreground/15 bg-background/40 flex items-center justify-center">
              <p className="text-foreground/25 text-xs font-bold uppercase tracking-widest">{ad.slot}</p>
            </div>
          </div>

          <a
            href="mailto:ads@romanex.it"
            className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-primary border-2 border-primary/30 hover:border-primary hover:bg-primary/5 px-4 py-2 rounded-lg transition-all duration-200 shrink-0 group"
          >
            <Mail className="w-3.5 h-3.5" strokeWidth={2.5} />
            {ad.cta}
            <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </div>
  );
}
