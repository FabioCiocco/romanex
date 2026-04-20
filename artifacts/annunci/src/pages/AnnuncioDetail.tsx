import { Layout } from "@/components/layout/Layout";
import { useGetAnnuncio, getGetAnnuncioQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Phone, Mail, Share2, Heart, AlertCircle, ChevronLeft, Calendar } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { it } from "date-fns/locale";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AnnuncioDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: annuncio, isLoading, error } = useGetAnnuncio(id, {
    query: {
      enabled: !!id,
      queryKey: getGetAnnuncioQueryKey(id)
    }
  });

  const getPlaceholderImage = (category: string) => {
    const cats: Record<string, string> = {
      motori: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      immobili: "https://images.unsplash.com/photo-1560518883-ce09059eebff?auto=format&fit=crop&w=1200&q=80",
      elettronica: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80",
      lavoro: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
      servizi: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    };
    
    const normalized = (category || "").toLowerCase();
    for (const [key, value] of Object.entries(cats)) {
      if (normalized.includes(key)) return value;
    }
    
    return "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=1200&q=80";
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: annuncio?.titolo,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiato!",
        description: "Il link dell'annuncio è stato copiato negli appunti.",
      });
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Rimosso dai preferiti" : "Aggiunto ai preferiti",
      description: isFavorite ? "L'annuncio è stato rimosso dai tuoi preferiti." : "Troverai questo annuncio nella tua lista preferiti.",
    });
  };

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Annuncio non trovato</AlertTitle>
            <AlertDescription>
              L'annuncio che stai cercando non esiste o è stato rimosso.
            </AlertDescription>
          </Alert>
          <div className="text-center mt-8">
            <Link href="/annunci">
              <Button>Torna alla ricerca</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <Link href="/annunci" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Torna agli annunci
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {isLoading || !annuncio ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-[300px] w-full rounded-2xl" />
              <Skeleton className="h-[200px] w-full rounded-2xl" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="relative rounded-3xl overflow-hidden bg-muted border aspect-[4/3] md:aspect-[16/9]">
                <img 
                  src={annuncio.immagineUrl || getPlaceholderImage(annuncio.categoria)} 
                  alt={annuncio.titolo}
                  className="w-full h-full object-cover"
                />
                {annuncio.inEvidenza && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground border-none px-3 py-1 shadow-lg text-sm">
                    In Evidenza
                  </Badge>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-background/80 backdrop-blur hover:bg-background" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-background/80 backdrop-blur hover:bg-background" onClick={handleFavorite}>
                    <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>
              </div>

              {/* Title & Mobile Price */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                    {annuncio.categoria}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Pubblicato {formatDistanceToNow(new Date(annuncio.createdAt), { addSuffix: true, locale: it })}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  {annuncio.titolo}
                </h1>
                
                {/* Price shown here on mobile, hidden on desktop */}
                <div className="lg:hidden mt-4">
                  <p className="text-3xl font-bold text-primary">
                    {annuncio.prezzo !== null && annuncio.prezzo !== undefined
                      ? new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(annuncio.prezzo)
                      : 'Contatta il venditore'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4 pt-6 border-t">
                <h2 className="text-2xl font-semibold">Descrizione</h2>
                <div className="prose prose-slate max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {annuncio.descrizione}
                </div>
              </div>
              
              {/* Additional Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Luogo</p>
                    <p className="text-foreground font-medium">{annuncio.citta}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Data di inserimento</p>
                    <p className="text-foreground font-medium">{format(new Date(annuncio.createdAt), 'dd MMMM yyyy', { locale: it })}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Sticky container for desktop */}
              <div className="sticky top-24 space-y-6">
                
                {/* Price & Action Card */}
                <div className="bg-card border rounded-2xl p-6 shadow-xl shadow-primary/5">
                  <div className="hidden lg:block mb-6 pb-6 border-b">
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2">Prezzo</p>
                    <p className="text-4xl font-bold text-primary">
                      {annuncio.prezzo !== null && annuncio.prezzo !== undefined
                        ? new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(annuncio.prezzo)
                        : 'Su richiesta'}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Contatta l'inserzionista</h3>
                    
                    <div className="space-y-3">
                      <Button className="w-full h-12 text-base gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white">
                        <Phone className="w-5 h-5" />
                        Mostra numero
                      </Button>
                      
                      <Button variant="outline" className="w-full h-12 text-base gap-2 border-primary/20 text-primary hover:bg-primary/5">
                        <Mail className="w-5 h-5" />
                        Invia messaggio
                      </Button>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t text-sm text-center text-muted-foreground">
                      <p>Riferimento annuncio: <span className="font-mono text-foreground">{annuncio.id}</span></p>
                    </div>
                  </div>
                </div>

                {/* Safety tips */}
                <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-accent-foreground font-semibold mb-3">
                    <AlertCircle className="w-5 h-5" />
                    Consigli per la sicurezza
                  </div>
                  <ul className="text-sm text-foreground/80 space-y-2 list-disc list-inside pl-2">
                    <li>Incontra il venditore in un luogo pubblico.</li>
                    <li>Verifica l'oggetto prima di pagare.</li>
                    <li>Non inviare pagamenti in anticipo.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
