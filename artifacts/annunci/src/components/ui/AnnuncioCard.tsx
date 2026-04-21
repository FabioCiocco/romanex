import { Annuncio } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageCircle, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { it, enUS, es } from "date-fns/locale";
import { CATEGORIES, getCategoryConfig } from "@/lib/constants";
import { CategoryIcon } from "@/components/CategoryIcon";
import { useLanguage } from "@/contexts/LanguageContext";

const DATE_LOCALES = { it, en: enUS, es };

interface AnnuncioCardProps {
  annuncio: Annuncio;
  compact?: boolean;
  mini?: boolean;
}

export function AnnuncioCard({ annuncio, compact = false, mini = false }: AnnuncioCardProps) {
  const { t, lang } = useLanguage();
  const tc = t.common;
  const locale = lang === 'it' ? 'it-IT' : lang === 'es' ? 'es-ES' : 'en-GB';
  const dateLocale = DATE_LOCALES[lang] ?? it;

  const categoryConfig = getCategoryConfig(annuncio.categoria.toLowerCase().replace(/\s+/g, '-'));
  const hasImage = !!annuncio.immagineUrl;
  const hasPrice = categoryConfig.hasPrice;
  const formattedPrice = hasPrice && annuncio.prezzo !== null && annuncio.prezzo !== undefined
    ? new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(annuncio.prezzo)
    : hasPrice ? tc.onRequest : tc.free;

  return (
    <Link href={`/annunci/${annuncio.id}`} className="block h-full outline-none group hover-lift">
      <Card className={`h-full overflow-hidden flex flex-col rounded-2xl border-2 transition-colors duration-300 bg-card border-border hover:border-foreground relative
        ${annuncio.inEvidenza ? 'ring-2 ring-secondary ring-offset-1' : ''}
      `}>
        
        {/* Dynamic Category Color Top Border - only if no image */}
        {!hasImage && (
          <div className={`absolute top-0 left-0 right-0 ${mini ? 'h-1' : 'h-2'} z-10`} style={{backgroundColor: `hsl(var(--cat-bg))`}} />
        )}
        
        <div className={`relative ${hasImage ? (mini ? 'aspect-[2/1]' : compact ? 'aspect-[16/9]' : 'aspect-[4/3]') : (mini ? 'h-20' : compact ? 'h-28' : 'h-40')} overflow-hidden bg-muted/50 ${categoryConfig.colorClass}`}>
          {hasImage ? (
            <img 
              src={annuncio.immagineUrl!} 
              alt={annuncio.titolo} 
              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[hsl(var(--cat-bg))] opacity-10 group-hover:opacity-20 transition-opacity" />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          
          {annuncio.inEvidenza && (
            <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground border-2 border-foreground font-black shadow-[2px_2px_0_0_hsl(var(--foreground))] uppercase tracking-wider text-xs px-3 py-1 z-20">
              {tc.featured}
            </Badge>
          )}

          {!hasImage && (
             <div className="absolute inset-0 flex items-center justify-center z-10">
               <div className={`${mini ? 'w-12 h-12' : 'w-20 h-20'} rounded-2xl bg-[hsl(var(--cat-bg))] text-[hsl(var(--cat-fg))] flex items-center justify-center shadow-xl rotate-3 group-hover:rotate-6 transition-transform`}>
                 <CategoryIcon name={annuncio.categoria} className={mini ? 'w-6 h-6' : 'w-10 h-10'} />
               </div>
             </div>
          )}
          
          <Badge 
            className={`absolute bottom-4 right-4 border-2 border-foreground font-black shadow-[2px_2px_0_0_hsl(var(--foreground))] uppercase tracking-wider z-20 ${categoryConfig.colorClass}`}
            style={{ backgroundColor: `hsl(var(--cat-bg))`, color: `hsl(var(--cat-fg))` }}
          >
            <span className="flex items-center gap-2">
              <CategoryIcon name={annuncio.categoria} className="w-3.5 h-3.5" />
              {annuncio.categoria}
            </span>
          </Badge>
        </div>
        
        <CardContent className={`flex-1 ${mini ? 'p-3 gap-1.5' : compact ? 'p-4 gap-2' : 'p-6 gap-4'} flex flex-col relative z-20 bg-card`}>
          <h3 className={`font-display font-black ${mini ? 'text-sm' : compact ? 'text-base' : 'text-2xl'} line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-tight`}>
            {annuncio.titolo}
          </h3>
          
          {!compact && !mini && (
            <p className="text-base font-medium text-muted-foreground line-clamp-2 leading-relaxed">
              {annuncio.descrizione}
            </p>
          )}

          <div className={`mt-auto ${mini ? 'pt-1.5' : compact ? 'pt-2' : 'pt-4'} flex items-center justify-between`}>
            {hasPrice ? (
              <p className={`${mini ? 'text-sm' : compact ? 'text-lg' : 'text-3xl'} font-black font-display tracking-tight px-2 py-0.5 rounded-lg bg-accent/10 text-accent border border-accent/20`}>
                {formattedPrice}
              </p>
            ) : (
              <div className={`flex items-center gap-1.5 text-primary font-black font-display ${mini ? 'text-xs' : compact ? 'text-sm' : 'text-xl'} uppercase tracking-wide`}>
                <MessageCircle className={mini ? 'w-3 h-3' : compact ? 'w-4 h-4' : 'w-6 h-6'} strokeWidth={2.5} />
                {tc.participate}
              </div>
            )}
            <div className={`${mini ? 'w-6 h-6' : compact ? 'w-7 h-7' : 'w-10 h-10'} rounded-full bg-foreground text-background flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300`}>
              <ArrowUpRight className={mini ? 'w-3 h-3' : compact ? 'w-3.5 h-3.5' : 'w-5 h-5'} strokeWidth={3} />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className={`${mini ? 'px-3 py-2' : compact ? 'px-4 py-3' : 'px-6 py-5'} border-t border-border bg-muted/20 flex items-center justify-end text-xs text-foreground/70 font-bold uppercase tracking-wider relative z-20`}>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" strokeWidth={2.5} />
            <span>{formatDistanceToNow(new Date(annuncio.createdAt), { locale: dateLocale, addSuffix: true })}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
