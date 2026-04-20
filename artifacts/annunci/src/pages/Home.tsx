import { useGetAnnunciRecenti, useGetAnnunciInEvidenza, useListCategorie, useGetStats } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { AnnuncioCard } from "@/components/ui/AnnuncioCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, TrendingUp, Users, Tag, AlertCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const { data: recenti, isLoading: isLoadingRecenti, error: errorRecenti } = useGetAnnunciRecenti();
  const { data: inEvidenza, isLoading: isLoadingEvidenza } = useGetAnnunciInEvidenza();
  const { data: categorie, isLoading: isLoadingCategorie } = useListCategorie();
  const { data: stats, isLoading: isLoadingStats } = useGetStats();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (searchCity) params.set("citta", searchCity);
    setLocation(`/annunci?${params.toString()}`);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-primary overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[60%] aspect-square rounded-full bg-white blur-3xl mix-blend-overlay"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] aspect-square rounded-full bg-accent blur-3xl mix-blend-overlay"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground tracking-tight">
              Il mercato della tua <span className="text-accent inline-block rotate-[-2deg]">città</span>, a portata di clic.
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto font-medium">
              Vendi ciò che non usi, trova ciò che cerchi. Unisciti a migliaia di persone che ogni giorno scambiano valore in modo semplice e sicuro.
            </p>
            
            <form onSubmit={handleSearch} className="bg-background rounded-2xl p-2 shadow-2xl max-w-2xl mx-auto flex flex-col md:flex-row gap-2 mt-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input 
                  placeholder="Cosa stai cercando?" 
                  className="pl-10 h-14 border-none shadow-none text-base focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="hidden md:block w-px bg-border my-2"></div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input 
                  placeholder="Dove?" 
                  className="pl-10 h-14 border-none shadow-none text-base focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 rounded-xl text-base font-semibold bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
                Cerca
              </Button>
            </form>
            
            <div className="flex flex-wrap justify-center gap-3 pt-6 text-sm font-medium text-primary-foreground/80">
              <span>Ricerche frequenti:</span>
              <Link href="/annunci?q=iphone" className="hover:text-accent hover:underline underline-offset-4 decoration-accent decoration-2 transition-all">iPhone</Link>
              <Link href="/annunci?q=bici" className="hover:text-accent hover:underline underline-offset-4 decoration-accent decoration-2 transition-all">Biciclette</Link>
              <Link href="/annunci?q=divano" className="hover:text-accent hover:underline underline-offset-4 decoration-accent decoration-2 transition-all">Divani</Link>
              <Link href="/annunci?q=fiat" className="hover:text-accent hover:underline underline-offset-4 decoration-accent decoration-2 transition-all">Auto usate</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30 border-b">
        <div className="container mx-auto px-4 md:px-6">
          {isLoadingStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="flex flex-col items-center justify-center p-6 bg-background rounded-2xl shadow-sm border border-border/50 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <Tag className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">{stats.totaleAnnunci.toLocaleString('it-IT')}</h3>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Annunci attivi</p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-background rounded-2xl shadow-sm border border-border/50 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent-foreground mb-2">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">{stats.annunciOggi.toLocaleString('it-IT')}</h3>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Aggiunti oggi</p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-background rounded-2xl shadow-sm border border-border/50 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary mb-2">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">{stats.totaleCategorie}</h3>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Categorie</p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 bg-background rounded-2xl shadow-sm border border-border/50 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold text-foreground capitalize truncate max-w-[120px]">{stats.cittaPiuAttive[0]?.citta || 'Milano'}</h3>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Città più attiva</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Categorie */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Esplora per categoria</h2>
              <p className="text-muted-foreground text-lg">Trova esattamente quello che stai cercando.</p>
            </div>
            <Link href="/categorie" className="hidden md:inline-flex items-center text-primary font-semibold hover:text-primary/80 group">
              Tutte le categorie
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {isLoadingCategorie ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
            </div>
          ) : categorie && categorie.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categorie.slice(0, 6).map((cat) => (
                <Link key={cat.id} href={`/annunci?categoria=${encodeURIComponent(cat.nome)}`} className="group">
                  <div className="flex flex-col items-center justify-center p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 h-full gap-4 hover:-translate-y-1">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <CategoryIcon name={cat.nome} className="w-8 h-8" />
                    </div>
                    <div className="text-center space-y-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{cat.nome}</h3>
                      <p className="text-xs text-muted-foreground font-medium">{cat.count.toLocaleString('it-IT')} annunci</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Nessuna categoria trovata.</p>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/categorie">
              <Button variant="outline" className="w-full">Tutte le categorie</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* In Evidenza */}
      {(!inEvidenza || inEvidenza.length > 0 || isLoadingEvidenza) && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="space-y-2 mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">In Evidenza</h2>
              <p className="text-muted-foreground text-lg">Gli annunci sponsorizzati dai nostri utenti.</p>
            </div>

            {isLoadingEvidenza ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[360px] rounded-xl" />)}
              </div>
            ) : inEvidenza && inEvidenza.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {inEvidenza.map((annuncio) => (
                  <AnnuncioCard key={annuncio.id} annuncio={annuncio} />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      )}

      {/* Recenti */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Aggiunti di recente</h2>
              <p className="text-muted-foreground text-lg">Le ultime novità sul mercato.</p>
            </div>
            <Link href="/annunci" className="hidden md:inline-flex items-center text-primary font-semibold hover:text-primary/80 group">
              Vedi tutti
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {errorRecenti ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Errore</AlertTitle>
              <AlertDescription>
                Impossibile caricare gli annunci recenti. Riprova più tardi.
              </AlertDescription>
            </Alert>
          ) : isLoadingRecenti ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-[360px] rounded-xl" />)}
            </div>
          ) : recenti && recenti.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recenti.map((annuncio) => (
                <AnnuncioCard key={annuncio.id} annuncio={annuncio} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground text-lg">Ancora nessun annuncio pubblicato.</p>
              <Link href="/pubblica">
                <Button className="mt-4">Sii il primo a pubblicare</Button>
              </Link>
            </div>
          )}
          
          <div className="mt-10 text-center md:hidden">
            <Link href="/annunci">
              <Button variant="outline" size="lg" className="w-full">Vedi tutti gli annunci</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/10"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Hai qualcosa che non usi più?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Dagli una seconda vita. Pubblicare un annuncio su MercatoLocale è gratuito, veloce e ti mette in contatto con persone della tua zona in pochi minuti.
          </p>
          <Link href="/pubblica">
            <Button size="lg" className="h-16 px-10 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-transform">
              Pubblica Annuncio Gratuitamente
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
