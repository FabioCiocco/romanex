import { useGetAnnunciRecenti, useGetAnnunciInEvidenza, useGetStats } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { AnnuncioCard } from "@/components/ui/AnnuncioCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, TrendingUp, Users, Tag, AlertCircle, ArrowRight, GraduationCap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CATEGORIES } from "@/lib/constants";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCity, setSearchCity] = useState("");

  const { data: recenti, isLoading: isLoadingRecenti, error: errorRecenti } = useGetAnnunciRecenti();
  const { data: inEvidenza, isLoading: isLoadingEvidenza } = useGetAnnunciInEvidenza();
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
      <section className="relative bg-background overflow-hidden border-b">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="absolute -top-[20%] -right-[10%] w-[60%] aspect-square rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] aspect-square rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
              <GraduationCap className="w-4 h-4" />
              <span>La bacheca della tua università</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight font-display leading-[1.1]">
              Tutto quello che ti serve per la tua <span className="text-primary relative inline-block">
                vita da studente
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-secondary" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="transparent" />
                </svg>
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
              Trova un coinquilino, vendi il libro di Diritto Privato, offri ripetizioni o unisciti a un gruppo di studio. CampusBoard è la tua community.
            </p>
            
            <form onSubmit={handleSearch} className="bg-card rounded-2xl p-2 shadow-xl border max-w-3xl mx-auto flex flex-col md:flex-row gap-2 mt-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input 
                  placeholder="Cerco libro Analisi 1, Stanza singola..." 
                  className="pl-12 h-14 border-none shadow-none text-base focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="hidden md:block w-px bg-border my-2"></div>
              <div className="flex-1 relative md:max-w-[200px]">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input 
                  placeholder="Città / Polo" 
                  className="pl-12 h-14 border-none shadow-none text-base focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent font-medium"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 rounded-xl text-base font-bold shadow-lg">
                Cerca
              </Button>
            </form>
            
            <div className="flex flex-wrap justify-center gap-2 pt-4 text-sm font-medium text-muted-foreground">
              <span>I più cercati:</span>
              <Link href="/annunci?q=stanza+singola" className="hover:text-primary transition-colors">Stanza singola</Link>
              <span className="opacity-30">•</span>
              <Link href="/annunci?q=economia" className="hover:text-primary transition-colors">Economia</Link>
              <span className="opacity-30">•</span>
              <Link href="/annunci?q=ripetizioni+matematica" className="hover:text-primary transition-colors">Analisi</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Categories */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-display">Cosa puoi fare su CampusBoard?</h2>
            <p className="text-muted-foreground text-lg">Esplora le sezioni principali della nostra bacheca digitale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.id} href={`/annunci?categoria=${encodeURIComponent(cat.name)}`} className="group outline-none">
                  <div className={`h-full flex flex-col items-center justify-center p-8 bg-card rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 group-focus-visible:ring-2 ring-primary ${cat.colorClass}`}>
                    <div className="w-20 h-20 rounded-2xl bg-[hsl(var(--cat-bg))] text-[hsl(var(--cat-fg))] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-10 h-10" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-foreground mb-2 text-center group-hover:text-primary transition-colors">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground text-center font-medium leading-relaxed">{cat.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* In Evidenza */}
      {(!inEvidenza || inEvidenza.length > 0 || isLoadingEvidenza) && (
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-end justify-between mb-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground font-semibold text-sm">
                  <TrendingUp className="w-4 h-4" /> Sponsorizzati
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-display">In Evidenza</h2>
              </div>
            </div>

            {isLoadingEvidenza ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[400px] rounded-2xl" />)}
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

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6">
          {isLoadingStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-2xl bg-white/20" />)}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
              <div className="space-y-2 px-4">
                <h3 className="text-5xl font-display font-bold">{stats.totaleAnnunci.toLocaleString('it-IT')}</h3>
                <p className="font-medium text-primary-foreground/80">Annunci Attivi</p>
              </div>
              <div className="space-y-2 px-4">
                <h3 className="text-5xl font-display font-bold">+{stats.annunciOggi.toLocaleString('it-IT')}</h3>
                <p className="font-medium text-primary-foreground/80">Oggi</p>
              </div>
              <div className="space-y-2 px-4">
                <h3 className="text-5xl font-display font-bold capitalize truncate">{stats.cittaPiuAttive[0]?.citta || 'Milano'}</h3>
                <p className="font-medium text-primary-foreground/80">Città Più Attiva</p>
              </div>
              <div className="space-y-2 px-4">
                <h3 className="text-5xl font-display font-bold">100%</h3>
                <p className="font-medium text-primary-foreground/80">Per Studenti</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Recenti */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold font-display">Ultimi Annunci</h2>
              <p className="text-muted-foreground text-lg">Appena pubblicati dai tuoi colleghi.</p>
            </div>
            <Link href="/annunci" className="hidden md:inline-flex items-center text-primary font-bold hover:text-primary/80 group">
              Vedi tutta la bacheca
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-[400px] rounded-2xl" />)}
            </div>
          ) : recenti && recenti.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recenti.map((annuncio) => (
                <AnnuncioCard key={annuncio.id} annuncio={annuncio} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-3xl border shadow-sm">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Bacheca vuota</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">Nessun annuncio recente. Sii il primo a pubblicare qualcosa sulla bacheca della tua università!</p>
              <Link href="/pubblica">
                <Button size="lg" className="rounded-full">Pubblica il primo annuncio</Button>
              </Link>
            </div>
          )}
          
          <div className="mt-10 text-center md:hidden">
            <Link href="/annunci">
              <Button variant="outline" size="lg" className="w-full rounded-xl">Vedi tutta la bacheca</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground to-transparent"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Hai libri da vendere o cerchi coinquilini?
          </h2>
          <p className="text-xl text-background/80 mb-10 font-medium leading-relaxed">
            Mettiti in contatto con migliaia di studenti nella tua città. Pubblicare sulla bacheca è 100% gratis e richiede solo un minuto.
          </p>
          <Link href="/pubblica">
            <Button size="lg" className="h-16 px-10 rounded-full text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl hover:scale-105 transition-transform">
              Pubblica un Annuncio Ora
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
