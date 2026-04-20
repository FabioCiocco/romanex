import { Layout } from "@/components/layout/Layout";
import { useGetAnnuncio, getGetAnnuncioQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Phone, Share2, Heart, AlertCircle, ChevronLeft, Calendar, MessageCircle, LogIn, Lock } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { it } from "date-fns/locale";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getCategoryConfig } from "@/lib/constants";
import { CategoryIcon } from "@/components/CategoryIcon";
import { useUser } from "@clerk/react";

export default function AnnuncioDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const { toast } = useToast();
  const { isSignedIn } = useUser();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const { data: annuncio, isLoading, error } = useGetAnnuncio(id, {
    query: {
      enabled: !!id,
      queryKey: getGetAnnuncioQueryKey(id)
    }
  });

  const getPlaceholderImage = (category: string) => {
    const cats: Record<string, string> = {
      appartamenti: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      libri: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&w=1200&q=80",
      ripetizioni: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80",
      consigli: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80",
      "gruppi-studio": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    };
    
    const normalized = (category || "").toLowerCase().replace(/\s+/g, '-');
    for (const [key, value] of Object.entries(cats)) {
      if (normalized.includes(key)) return value;
    }
    
    return "https://images.unsplash.com/photo-1519452310189-dd9e772186df?auto=format&fit=crop&w=1200&q=80";
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
    if (!isSignedIn) {
      toast({
        title: "Accedi per salvare",
        description: "Crea un account o accedi per salvare gli annunci nei preferiti.",
      });
      return;
    }
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Rimosso dai preferiti" : "Aggiunto ai preferiti",
      description: isFavorite ? "L'annuncio è stato rimosso dai preferiti." : "Salvato per dopo. Lo troverai nella tua area personale.",
    });
  };

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <Alert variant="destructive" className="max-w-2xl mx-auto rounded-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Annuncio non trovato</AlertTitle>
            <AlertDescription>
              L'annuncio che stai cercando non esiste o è stato chiuso.
            </AlertDescription>
          </Alert>
          <div className="text-center mt-8">
            <Link href="/annunci">
              <Button size="lg" className="rounded-full">Torna alla bacheca</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const categoryConfig = annuncio ? getCategoryConfig(annuncio.categoria.toLowerCase().replace(/\s+/g, '-')) : null;
  const hasPrice = categoryConfig?.hasPrice ?? true;

  return (
    <Layout>
      <div className="bg-muted/30 border-b sticky top-[64px] z-40 backdrop-blur supports-[backdrop-filter]:bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <Link href="/annunci" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Indietro
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {isLoading || !annuncio || !categoryConfig ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="w-full aspect-[4/3] md:aspect-[16/9] rounded-3xl" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <div className="space-y-2 pt-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-[300px] w-full rounded-3xl" />
              <Skeleton className="h-[200px] w-full rounded-3xl" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="relative rounded-3xl overflow-hidden bg-muted border border-border/50 shadow-sm aspect-[4/3] md:aspect-[16/9]">
                <img 
                  src={annuncio.immagineUrl || getPlaceholderImage(annuncio.categoria)} 
                  alt={annuncio.titolo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                
                {annuncio.inEvidenza && (
                  <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground border-none px-4 py-1.5 shadow-lg text-sm font-bold tracking-wide uppercase">
                    In Evidenza
                  </Badge>
                )}
                
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button variant="secondary" size="icon" className="rounded-full shadow-xl bg-white/90 text-foreground hover:bg-white transition-transform hover:scale-105" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="secondary" size="icon" className="rounded-full shadow-xl bg-white/90 text-foreground hover:bg-white transition-transform hover:scale-105" onClick={handleFavorite}>
                    <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>
              </div>

              {/* Title Header */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className={`border-none ${categoryConfig.colorClass.replace('cat-', 'bg-')} bg-opacity-20 text-foreground px-3 py-1 font-bold flex items-center gap-1.5`}>
                    <CategoryIcon name={annuncio.categoria} className="w-3.5 h-3.5" />
                    {annuncio.categoria}
                  </Badge>
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Pubblicato {formatDistanceToNow(new Date(annuncio.createdAt), { addSuffix: true, locale: it })}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold font-display text-foreground leading-tight tracking-tight">
                  {annuncio.titolo}
                </h1>
                
                {/* Price shown here on mobile */}
                <div className="lg:hidden mt-4 bg-card border rounded-2xl p-4 shadow-sm flex justify-between items-center">
                  {hasPrice ? (
                     <div className="space-y-1">
                       <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Richiesta</p>
                       <p className="text-3xl font-display font-bold text-primary">
                         {annuncio.prezzo !== null && annuncio.prezzo !== undefined
                           ? new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(annuncio.prezzo)
                           : 'Da concordare'}
                       </p>
                     </div>
                  ) : (
                    <div className="flex items-center gap-2 text-secondary font-display font-bold text-2xl">
                      <MessageCircle className="w-6 h-6" />
                      Post Community
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4 pt-8 border-t">
                <h2 className="text-2xl font-bold font-display">Informazioni</h2>
                <div className="prose prose-slate max-w-none text-foreground/80 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                  {annuncio.descrizione}
                </div>
              </div>
              
              {/* Additional Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t">
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-muted/50 border border-border/50">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-muted-foreground">Posizione</p>
                    <p className="text-foreground font-bold text-lg">{annuncio.citta}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-muted/50 border border-border/50">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-muted-foreground">Inserito il</p>
                    <p className="text-foreground font-bold text-lg">{format(new Date(annuncio.createdAt), 'dd MMMM yyyy', { locale: it })}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="sticky top-28 space-y-6">
                
                {/* Contact Card */}
                <div className="bg-card border rounded-3xl p-6 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
                  
                  <div className="hidden lg:block mb-8 pb-6 border-b">
                    {hasPrice ? (
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Richiesta</p>
                        <p className="text-5xl font-display font-bold text-primary">
                          {annuncio.prezzo !== null && annuncio.prezzo !== undefined
                            ? new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(annuncio.prezzo)
                            : 'Info'}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-secondary font-display font-bold text-3xl">
                        <MessageCircle className="w-8 h-8" />
                        Community
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-5">
                    <h3 className="font-bold text-xl font-display">Contatta lo studente</h3>

                    {isSignedIn ? (
                      <>
                        <p className="text-sm text-muted-foreground font-medium">
                          Scrivi o chiama per maggiori informazioni. Ricorda di menzionare RomaNex!
                        </p>
                        <div className="space-y-3">
                          <Button className="w-full h-14 text-base font-bold gap-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                            <MessageCircle className="w-5 h-5" />
                            Scrivi messaggio
                          </Button>
                          {!showContact ? (
                            <Button variant="outline" className="w-full h-14 text-base font-bold gap-3 rounded-xl border-2 border-foreground hover:bg-muted transition-colors" onClick={() => setShowContact(true)}>
                              <Phone className="w-5 h-5" />
                              Mostra contatto
                            </Button>
                          ) : (
                            <div className="w-full p-4 rounded-xl border-2 border-foreground bg-muted/50 text-center">
                              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Contatto</p>
                              <p className="font-black text-lg text-foreground break-all">{annuncio.contatto}</p>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="rounded-2xl border-2 border-dashed border-foreground/20 bg-muted/30 p-6 text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-foreground/5 border-2 border-foreground/10 flex items-center justify-center mx-auto">
                          <Lock className="w-6 h-6 text-foreground/30" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="font-black text-base text-foreground mb-1">Accedi per contattare</p>
                          <p className="text-sm text-muted-foreground font-medium">Solo gli utenti registrati possono vedere i contatti e scrivere messaggi.</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Link href="/sign-up">
                            <Button className="w-full h-11 gap-2 rounded-xl bg-primary text-primary-foreground border-2 border-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))] hover:shadow-[1px_1px_0_0_hsl(var(--foreground))] hover:translate-y-[2px] hover:translate-x-[2px] transition-all font-black text-sm uppercase tracking-wide">
                              Crea account gratis
                            </Button>
                          </Link>
                          <Link href="/sign-in">
                            <Button variant="outline" className="w-full h-10 gap-2 rounded-xl border-2 border-foreground font-black text-sm uppercase tracking-wide hover:bg-muted">
                              <LogIn className="w-4 h-4" strokeWidth={2.5} />
                              Accedi
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 mt-2 border-t text-xs font-medium text-center text-muted-foreground">
                      <p>ID Post: <span className="font-mono bg-muted px-1 py-0.5 rounded text-foreground">{annuncio.id}</span></p>
                    </div>
                  </div>
                </div>

                {/* Safety tips */}
                <div className="bg-accent/5 border border-accent/20 rounded-3xl p-6">
                  <div className="flex items-center gap-2 text-accent-foreground font-bold mb-4 font-display text-lg">
                    <AlertCircle className="w-5 h-5" />
                    Consigli Campus
                  </div>
                  <ul className="text-sm text-foreground/80 font-medium space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      Incontratevi in università o in un bar del campus.
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      Verifica il libro/oggetto prima di scambiare i soldi.
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      Se è un subentro in appartamento, chiedi di vedere il contratto.
                    </li>
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
