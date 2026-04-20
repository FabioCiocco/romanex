import { Annuncio } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

interface AnnuncioCardProps {
  annuncio: Annuncio;
}

export function AnnuncioCard({ annuncio }: AnnuncioCardProps) {
  const getPlaceholderImage = (category: string) => {
    const cats: Record<string, string> = {
      motori: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
      immobili: "https://images.unsplash.com/photo-1560518883-ce09059eebff?auto=format&fit=crop&w=800&q=80",
      elettronica: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80",
      lavoro: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
      servizi: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    };
    
    const normalized = category.toLowerCase();
    for (const [key, value] of Object.entries(cats)) {
      if (normalized.includes(key)) return value;
    }
    
    return "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80";
  };

  const imageUrl = annuncio.immagineUrl || getPlaceholderImage(annuncio.categoria);
  const formattedPrice = annuncio.prezzo !== null && annuncio.prezzo !== undefined
    ? new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(annuncio.prezzo)
    : 'Contatta il venditore';

  return (
    <Link href={`/annunci/${annuncio.id}`} className="block h-full group">
      <Card className="h-full overflow-hidden flex flex-col hover-elevate transition-all duration-300 border-border/50 group-hover:border-primary/30">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img 
            src={imageUrl} 
            alt={annuncio.titolo} 
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {annuncio.inEvidenza && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-none font-medium shadow-md">
              In Evidenza
            </Badge>
          )}
          <Badge variant="secondary" className="absolute bottom-3 right-3 shadow-md backdrop-blur-sm bg-background/80">
            {annuncio.categoria}
          </Badge>
        </div>
        
        <CardContent className="flex-1 p-5 flex flex-col gap-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-lg line-clamp-2 text-foreground group-hover:text-primary transition-colors leading-tight">
              {annuncio.titolo}
            </h3>
          </div>
          <p className="text-xl font-bold text-primary mt-1">
            {formattedPrice}
          </p>
        </CardContent>
        
        <CardFooter className="px-5 py-4 border-t border-border/50 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
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
