import { Annuncio } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { CATEGORIES, getCategoryConfig } from "@/lib/constants";
import { CategoryIcon } from "@/components/CategoryIcon";

interface AnnuncioCardProps {
  annuncio: Annuncio;
}

export function AnnuncioCard({ annuncio }: AnnuncioCardProps) {
  const getPlaceholderImage = (category: string) => {
    const cats: Record<string, string> = {
      appartamenti: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      libri: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=800&q=80",
      ripetizioni: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
      consigli: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80",
      "gruppi-studio": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    };
    
    const normalized = category.toLowerCase().replace(/\s+/g, '-');
    for (const [key, value] of Object.entries(cats)) {
      if (normalized.includes(key)) return value;
    }
    
    return "https://images.unsplash.com/photo-1519452310189-dd9e772186df?auto=format&fit=crop&w=800&q=80";
  };

  const imageUrl = annuncio.immagineUrl || getPlaceholderImage(annuncio.categoria);
  const categoryConfig = getCategoryConfig(annuncio.categoria.toLowerCase().replace(/\s+/g, '-'));
  
  const hasPrice = categoryConfig.hasPrice;
  const formattedPrice = hasPrice && annuncio.prezzo !== null && annuncio.prezzo !== undefined
    ? new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(annuncio.prezzo)
    : hasPrice ? 'Contatta' : 'Gratis / Info';

  return (
    <Link href={`/annunci/${annuncio.id}`} className="block h-full group">
      <Card className="h-full overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-border/50 group-hover:border-primary/30 rounded-2xl">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img 
            src={imageUrl} 
            alt={annuncio.titolo} 
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {annuncio.inEvidenza && (
            <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground border-none font-bold shadow-md uppercase tracking-wider text-[10px] px-2 py-0.5">
              In Evidenza
            </Badge>
          )}
          
          <Badge 
            className={`absolute bottom-3 right-3 shadow-md backdrop-blur-md border-none ${categoryConfig.colorClass.replace('cat-', 'bg-')} bg-white/90 text-foreground`}
          >
            <span className="flex items-center gap-1.5">
              <CategoryIcon name={annuncio.categoria} className="w-3.5 h-3.5" />
              {annuncio.categoria}
            </span>
          </Badge>
        </div>
        
        <CardContent className="flex-1 p-5 flex flex-col gap-3">
          <h3 className="font-display font-semibold text-xl line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-tight">
            {annuncio.titolo}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {annuncio.descrizione}
          </p>

          <div className="mt-auto pt-2 flex items-center justify-between">
            {hasPrice ? (
              <p className="text-2xl font-bold text-primary font-display tracking-tight">
                {formattedPrice}
              </p>
            ) : (
              <div className="flex items-center gap-1.5 text-secondary font-semibold font-display text-lg">
                <MessageCircle className="w-5 h-5" />
                Partecipa
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="px-5 py-4 border-t border-border/40 bg-muted/30 flex items-center justify-between text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[120px]">{annuncio.citta}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDistanceToNow(new Date(annuncio.createdAt), { addSuffix: true, locale: it })}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
