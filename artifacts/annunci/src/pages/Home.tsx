import { useGetAnnunciRecenti, useGetAnnunciInEvidenza, useListCategorie } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { AnnuncioCard } from "@/components/ui/AnnuncioCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, TrendingUp, AlertCircle, ArrowRight, GraduationCap } from "lucide-react";
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
  const { data: categorie } = useListCategorie();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (searchCity) params.set("citta", searchCity);
    setLocation(`/annunci?${params.toString()}`);
  };

  return (
    <Layout>
      {/* POSTER HERO SECTION */}
      <section className="relative bg-background overflow-hidden border-b-4 border-foreground min-h-[70vh] flex items-center">
        {/* CSS Background Blobs representing category colors */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-[hsl(264_67%_35%)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-[hsl(38_92%_44%)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-[hsl(163_94%_24%)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        <div className="absolute -bottom-10 right-40 w-64 h-64 bg-[hsl(335_78%_42%)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '60px 60px'}} />

        <div className="container mx-auto px-4 md:px-6 relative z-10 py-12">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-foreground text-background font-bold text-sm uppercase tracking-widest border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--primary))] rotate-[-2deg] mb-4">
              <GraduationCap className="w-5 h-5" strokeWidth={2.5} />
              <span>La bacheca degli universitari</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black text-foreground tracking-tighter font-display leading-[0.9] uppercase">
              TUTTO QUELLO CHE TI SERVE PER LA <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary block mt-2 drop-shadow-sm">
                VITA DA STUDENTE
              </span>
            </h1>
            
            <p className="text-xl md:text-3xl text-foreground/80 max-w-3xl font-medium leading-relaxed border-l-4 border-accent pl-6">
              Trova un coinquilino, vendi i tuoi libri, offri ripetizioni o unisciti a un gruppo di studio.
            </p>
            
            <form onSubmit={handleSearch} className="bg-background rounded-3xl p-3 shadow-[8px_8px_0_0_hsl(var(--foreground))] border-4 border-foreground max-w-4xl flex flex-col md:flex-row gap-3 mt-12 relative z-20">
              <div className="flex-1 relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground w-6 h-6" strokeWidth={2.5} />
                <Input 
                  placeholder="Cosa stai cercando?" 
                  className="pl-14 h-16 border-2 border-transparent focus-visible:border-foreground rounded-2xl shadow-none text-xl focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted/50 font-bold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex-1 relative md:max-w-[240px]">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground w-6 h-6" strokeWidth={2.5} />
                <Input 
                  placeholder="Città/Polo" 
                  className="pl-14 h-16 border-2 border-transparent focus-visible:border-foreground rounded-2xl shadow-none text-xl focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted/50 font-bold"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-16 px-10 rounded-2xl text-xl font-black uppercase tracking-wider bg-primary text-primary-foreground border-4 border-transparent hover:border-foreground hover:bg-primary transition-all bouncy-active shadow-[4px_4px_0_0_hsl(var(--foreground))]">
                Cerca
              </Button>
            </form>
            
            <div className="flex flex-wrap items-center gap-4 pt-6 text-sm font-bold uppercase tracking-wider text-foreground/60">
              <span>Trending:</span>
              <Link href="/annunci?q=stanza+singola" className="px-4 py-2 rounded-lg bg-white border-2 border-foreground text-foreground hover:-translate-y-1 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] transition-all">Stanza singola</Link>
              <Link href="/annunci?q=economia" className="px-4 py-2 rounded-lg bg-white border-2 border-foreground text-foreground hover:-translate-y-1 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] transition-all">Economia</Link>
              <Link href="/annunci?q=ripetizioni" className="px-4 py-2 rounded-lg bg-white border-2 border-foreground text-foreground hover:-translate-y-1 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] transition-all">Ripetizioni</Link>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO CATEGORIES */}
      <section className="py-24 bg-foreground border-b-4 border-foreground overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-background/40 font-black text-xs uppercase tracking-[0.3em] mb-3">— 5 sezioni</p>
              <h2 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter text-background leading-[0.9]">
                Cosa stai <span className="text-accent">cercando?</span>
              </h2>
            </div>
            <Link href="/categorie" className="inline-flex items-center gap-2 text-background/50 hover:text-accent font-black uppercase tracking-wider text-sm transition-colors group w-max">
              Tutte le sezioni
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5" style={{gridAutoRows: 'minmax(180px, 1fr)'}}>

            {/* Appartamenti — BIG (2×2) */}
            {(() => {
              const cat = CATEGORIES[0];
              const count = categorie?.find(c => c.id === cat.id)?.count ?? 0;
              const Icon = cat.icon;
              return (
                <Link key={cat.id} href={`/annunci?categoria=${cat.id}`}
                  className={`col-span-2 row-span-2 group outline-none block ${cat.colorClass}`}
                  style={{gridRow: 'span 2'}}>
                  <div className="h-full flex flex-col justify-between p-8 md:p-10 rounded-3xl border-4 border-white/20 relative overflow-hidden transition-all duration-300 group-hover:scale-[0.98]" style={{backgroundColor: `hsl(var(--cat-bg))`, minHeight: '380px'}}>
                    {/* Big background number */}
                    <span className="absolute -bottom-6 -right-4 text-[180px] font-black text-white/5 leading-none select-none pointer-events-none font-display">01</span>
                    {/* Glow blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />

                    <div className="relative z-10 flex items-start justify-between">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                      </div>
                      {count > 0 && (
                        <span className="bg-white/20 border border-white/30 text-white font-black text-sm px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-sm">
                          {count} post
                        </span>
                      )}
                    </div>

                    <div className="relative z-10 mt-auto">
                      <h3 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tighter mb-3">{cat.name}</h3>
                      <p className="text-white/80 font-medium text-base leading-relaxed mb-6 max-w-xs">{cat.description}</p>
                      <div className="inline-flex items-center gap-2 text-white font-black uppercase tracking-widest text-sm group-hover:gap-4 transition-all">
                        Esplora <ArrowRight className="w-5 h-5" strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })()}

            {/* Libri, Ripetizioni, Consigli, Gruppi — small (1×1) */}
            {CATEGORIES.slice(1).map((cat, i) => {
              const count = categorie?.find(c => c.id === cat.id)?.count ?? 0;
              const Icon = cat.icon;
              const num = String(i + 2).padStart(2, '0');
              return (
                <Link key={cat.id} href={`/annunci?categoria=${cat.id}`}
                  className={`col-span-1 group outline-none block ${cat.colorClass}`}>
                  <div className="h-full flex flex-col justify-between p-5 md:p-6 rounded-3xl border-4 border-white/20 relative overflow-hidden transition-all duration-300 group-hover:scale-[0.97]" style={{backgroundColor: `hsl(var(--cat-bg))`, minHeight: '180px'}}>
                    {/* Background number */}
                    <span className="absolute -bottom-4 -right-2 text-[90px] font-black text-white/5 leading-none select-none pointer-events-none font-display">{num}</span>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                        <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                      {count > 0 && (
                        <span className="bg-white/20 text-white font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {count}
                        </span>
                      )}
                    </div>

                    <div className="relative z-10 mt-auto">
                      <h3 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-tight mb-1">{cat.name}</h3>
                      <div className="flex items-center gap-1 text-white/70 font-bold text-xs uppercase tracking-widest group-hover:text-white group-hover:gap-2 transition-all">
                        Esplora <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>


      {/* IN EVIDENZA */}
      {(!inEvidenza || inEvidenza.length > 0 || isLoadingEvidenza) && (
        <section className="py-24 border-b-4 border-foreground relative bg-muted/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-black text-sm uppercase tracking-wider border-2 border-foreground shadow-[2px_2px_0_0_hsl(var(--foreground))]">
                  <TrendingUp className="w-5 h-5" strokeWidth={3} /> Top Post
                </div>
                <h2 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter">In Evidenza</h2>
              </div>
            </div>

            {isLoadingEvidenza ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[450px] rounded-3xl border-4 border-foreground" />)}
              </div>
            ) : inEvidenza && inEvidenza.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {inEvidenza.map((annuncio) => (
                  <AnnuncioCard key={annuncio.id} annuncio={annuncio} />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      )}


      {/* RECENTI */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter">Nuovi Arrivi</h2>
              <p className="text-foreground/60 text-xl font-bold">Appena pubblicati dai tuoi colleghi.</p>
            </div>
            <Link href="/annunci" className="hidden md:inline-flex items-center text-primary font-black uppercase tracking-wider hover:text-accent group bg-primary/10 px-6 py-3 rounded-xl border-2 border-transparent hover:border-accent transition-all">
              Tutta la bacheca
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
            </Link>
          </div>

          {errorRecenti ? (
            <Alert variant="destructive" className="border-4 border-destructive rounded-2xl">
              <AlertCircle className="h-6 w-6" strokeWidth={3} />
              <AlertTitle className="font-black text-lg uppercase tracking-wider">Errore</AlertTitle>
              <AlertDescription className="font-bold">
                Impossibile caricare gli annunci recenti. Riprova più tardi.
              </AlertDescription>
            </Alert>
          ) : isLoadingRecenti ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[450px] rounded-3xl border-4 border-foreground" />)}
            </div>
          ) : recenti && recenti.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {recenti.map((annuncio) => (
                <AnnuncioCard key={annuncio.id} annuncio={annuncio} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-card rounded-3xl border-4 border-foreground shadow-[8px_8px_0_0_hsl(var(--foreground))]">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-muted-foreground" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black font-display uppercase tracking-wider mb-4">Bacheca vuota</h3>
              <p className="text-foreground/60 font-bold max-w-md mx-auto mb-8 text-lg">Nessun annuncio recente. Sii il primo a pubblicare qualcosa sulla bacheca degli universitari!</p>
              <Link href="/pubblica">
                <Button size="lg" className="h-16 px-8 rounded-2xl text-xl font-black uppercase tracking-wider bg-accent text-accent-foreground border-4 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
                  Pubblica il primo annuncio
                </Button>
              </Link>
            </div>
          )}
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/annunci">
              <Button variant="outline" size="lg" className="w-full h-16 rounded-2xl text-xl font-black uppercase tracking-wider border-4 border-foreground">Tutta la bacheca</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 relative overflow-hidden bg-foreground text-background border-t-4 border-foreground">
        <div className="absolute inset-0 opacity-[0.05]" style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-black font-display mb-8 uppercase tracking-tighter leading-[0.9]">
            Hai libri da vendere o cerchi coinquilini?
          </h2>
          <p className="text-2xl text-background/80 mb-12 font-bold leading-relaxed">
            Mettiti in contatto con migliaia di studenti nella tua città. È 100% gratis.
          </p>
          <Link href="/pubblica">
            <Button size="lg" className="h-20 px-12 rounded-2xl text-2xl font-black uppercase tracking-widest bg-primary text-primary-foreground border-4 border-background shadow-[8px_8px_0_0_#fff] hover:translate-y-2 hover:translate-x-2 hover:shadow-none transition-all bouncy-active">
              Inizia Ora
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
