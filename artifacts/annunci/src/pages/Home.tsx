import { useGetAnnunciRecenti, useGetAnnunciInEvidenza, useListCategorie } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { AnnuncioCard } from "@/components/ui/AnnuncioCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, TrendingUp, AlertCircle, ArrowRight, GraduationCap, MessageCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CATEGORIES } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageBanner } from "@/components/layout/LanguageBanner";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const { t } = useLanguage();
  const h = t.home;

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
      {/* Language Banner */}
      <LanguageBanner />

      {/* POSTER HERO SECTION */}
      <section className="relative bg-background overflow-hidden border-b-4 border-foreground min-h-[70vh] flex items-center">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[hsl(264_67%_35%)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-[hsl(38_92%_44%)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-[hsl(163_94%_24%)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        <div className="absolute -bottom-10 right-40 w-64 h-64 bg-[hsl(335_78%_42%)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '60px 60px'}} />

        <div className="container mx-auto px-4 md:px-6 relative z-10 py-12">
          <div className="max-w-5xl mx-auto space-y-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-foreground text-background font-bold text-sm uppercase tracking-widest border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--primary))] rotate-[-2deg] mb-4">
              <GraduationCap className="w-5 h-5" strokeWidth={2.5} />
              <span>{h.badge}</span>
            </div>
            
            <h1 className="text-[2.6rem] sm:text-6xl md:text-8xl lg:text-[100px] font-black text-foreground tracking-tighter font-display leading-[0.9] uppercase">
              {h.heroTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary block mt-2 drop-shadow-sm">
                {h.heroHighlight}
              </span>
            </h1>
            
            <p className="text-base sm:text-xl md:text-2xl text-foreground/80 max-w-3xl font-medium leading-relaxed border-l-4 border-accent pl-4 md:pl-6">
              {h.heroSub}
            </p>
            
            <form onSubmit={handleSearch} className="bg-background rounded-3xl p-3 shadow-[8px_8px_0_0_hsl(var(--foreground))] border-4 border-foreground max-w-4xl flex flex-col md:flex-row gap-3 mt-8 md:mt-12 relative z-20">
              <div className="flex-1 relative">
                <Search className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-foreground w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                <Input 
                  placeholder={h.searchPlaceholder}
                  className="pl-11 md:pl-14 h-12 md:h-16 border-2 border-transparent focus-visible:border-foreground rounded-2xl shadow-none text-base md:text-xl focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted/50 font-bold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex-1 relative md:max-w-[240px]">
                <MapPin className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-foreground w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                <Input 
                  placeholder={h.cityPlaceholder}
                  className="pl-11 md:pl-14 h-12 md:h-16 border-2 border-transparent focus-visible:border-foreground rounded-2xl shadow-none text-base md:text-xl focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted/50 font-bold"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-12 md:h-16 px-6 md:px-10 rounded-2xl text-base md:text-xl font-black uppercase tracking-wider bg-primary text-primary-foreground border-4 border-transparent hover:border-foreground hover:bg-primary transition-all bouncy-active shadow-[4px_4px_0_0_hsl(var(--foreground))]">
                {h.searchBtn}
              </Button>
            </form>
            
            <div className="flex flex-wrap items-center gap-4 pt-6 text-sm font-bold uppercase tracking-wider text-foreground/60">
              <span>{h.trending}</span>
              {h.trendingTags.map((tag) => (
                <Link key={tag} href={`/annunci?q=${encodeURIComponent(tag)}`} className="px-4 py-2 rounded-lg bg-white border-2 border-foreground text-foreground hover:-translate-y-1 hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] transition-all">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENTO CATEGORIES */}
      <section className="py-24 bg-foreground border-b-4 border-foreground overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-5xl md:text-7xl font-black font-display uppercase tracking-tighter text-background leading-[0.9]">
                {h.categoriesTitle} <span className="text-accent">{h.categoriesHighlight}</span>
              </h2>
            </div>
            <Link href="/categorie" className="inline-flex items-center gap-2 text-background/50 hover:text-accent font-black uppercase tracking-wider text-sm transition-colors group w-max">
              {h.allSections}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5" style={{gridAutoRows: 'minmax(180px, 1fr)'}}>

            {/* Libri — BIG (2×2) */}
            {(() => {
              const cat = CATEGORIES[1];
              const catT = (t.categories as Record<string, { name: string; description: string }>)[cat.id];
              const count = categorie?.find(c => c.id === cat.id)?.count ?? 0;
              const Icon = cat.icon;
              return (
                <Link key={cat.id} href={`/${cat.id}`}
                  className={`col-span-2 row-span-2 group outline-none block ${cat.colorClass}`}
                  style={{gridRow: 'span 2'}}>
                  <div className="h-full flex flex-col justify-between p-8 md:p-10 rounded-3xl border-4 border-white/20 relative overflow-hidden transition-all duration-300 group-hover:scale-[0.98]" style={{backgroundColor: `hsl(var(--cat-bg))`, minHeight: '380px'}}>
                    <span className="absolute -bottom-6 -right-4 text-[180px] font-black text-white/5 leading-none select-none pointer-events-none font-display">01</span>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />

                    <div className="relative z-10 flex items-start justify-between">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                      </div>
                      {count > 0 && (
                        <span className="bg-white/20 border border-white/30 text-white font-black text-sm px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-sm">
                          {count} {t.common.listings}
                        </span>
                      )}
                    </div>

                    <div className="relative z-10 mt-auto">
                      <h3 className="font-display font-black text-4xl md:text-5xl text-white uppercase tracking-tighter mb-3">{catT?.name ?? cat.name}</h3>
                      <p className="text-white/80 font-medium text-base leading-relaxed mb-6 max-w-xs">{catT?.description ?? cat.description}</p>
                      <div className="inline-flex items-center gap-2 text-white font-black uppercase tracking-widest text-sm group-hover:gap-4 transition-all">
                        {t.common.explore} <ArrowRight className="w-5 h-5" strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })()}

            {/* Ripetizioni, Forum (piccolo), Consigli, Gruppi — small */}
            {[CATEGORIES[2], CATEGORIES[3], CATEGORIES[4]].map((cat, i) => {
              const catT = (t.categories as Record<string, { name: string; description: string }>)[cat.id];
              const count = categorie?.find(c => c.id === cat.id)?.count ?? 0;
              const Icon = cat.icon;
              const num = String(i + 2).padStart(2, '0');
              return (
                <Link key={cat.id} href={`/${cat.id}`}
                  className={`col-span-1 group outline-none block ${cat.colorClass}`}>
                  <div className="h-full flex flex-col justify-between p-5 md:p-6 rounded-3xl border-4 border-white/20 relative overflow-hidden transition-all duration-300 group-hover:scale-[0.97]" style={{backgroundColor: `hsl(var(--cat-bg))`, minHeight: '180px'}}>
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
                      <h3 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-tight mb-1">{catT?.name ?? cat.name}</h3>
                      <div className="flex items-center gap-1 text-white/70 font-bold text-xs uppercase tracking-widest group-hover:text-white group-hover:gap-2 transition-all">
                        {t.common.explore} <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Forum — small card */}
            <Link href="/forum" className="col-span-1 group outline-none block">
              <div className="h-full flex flex-col justify-between p-5 md:p-6 rounded-3xl border-4 border-accent/40 relative overflow-hidden transition-all duration-300 group-hover:scale-[0.97] bg-accent/15 hover:bg-accent/25" style={{minHeight: '180px'}}>
                <span className="absolute -bottom-4 -right-2 text-[90px] font-black text-accent/10 leading-none select-none pointer-events-none font-display">05</span>
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <MessageCircle className="w-6 h-6 text-accent" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="relative z-10 mt-auto">
                  <h3 className="font-display font-black text-xl md:text-2xl text-background uppercase tracking-tight mb-1">{(t as any).forum?.title ?? "Forum"}</h3>
                  <div className="flex items-center gap-1 text-background/50 font-bold text-xs uppercase tracking-widest group-hover:text-accent group-hover:gap-2 transition-all">
                    {t.common.explore} <ArrowRight className="w-3.5 h-3.5" strokeWidth={3} />
                  </div>
                </div>
              </div>
            </Link>

            {/* Case e Stanze — full-width banner card */}
            {(() => {
              const cat = CATEGORIES[0];
              const catT = (t.categories as Record<string, { name: string; description: string }>)[cat.id];
              const count = categorie?.find(c => c.id === cat.id)?.count ?? 0;
              return (
                <Link href={`/${cat.id}`} className={`col-span-2 md:col-span-4 group outline-none block ${cat.colorClass}`}>
                  <div className="h-full flex flex-col sm:flex-row items-center justify-between gap-6 p-7 md:p-8 rounded-3xl border-4 border-white/20 relative overflow-hidden transition-all duration-300 group-hover:border-white/40" style={{backgroundColor: `hsl(var(--cat-bg))`, minHeight: '120px'}}>
                    <div className="absolute -bottom-6 -right-4 text-[140px] font-black text-white/5 leading-none select-none pointer-events-none font-display">06</div>
                    <div className="flex items-center gap-5 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shrink-0">
                        <cat.icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight leading-none">
                          {catT?.name ?? cat.name}
                        </h3>
                        <p className="text-white/60 font-medium text-sm mt-1">
                          {catT?.description ?? cat.description}
                          {count > 0 && <span className="ml-2 text-white/80 font-black">· {count} {t.common.listings}</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-sm group-hover:gap-4 transition-all relative z-10 shrink-0">
                      {t.common.explore} <ArrowRight className="w-5 h-5" strokeWidth={3} />
                    </div>
                  </div>
                </Link>
              );
            })()}
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
                  <TrendingUp className="w-5 h-5" strokeWidth={3} /> {h.topPostBadge}
                </div>
                <h2 className="text-4xl md:text-6xl font-black font-display uppercase tracking-tighter">{h.featuredTitle}</h2>
              </div>
            </div>

            {isLoadingEvidenza ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[280px] rounded-2xl" />)}
              </div>
            ) : inEvidenza && inEvidenza.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {inEvidenza.map((annuncio) => (
                  <AnnuncioCard key={annuncio.id} annuncio={annuncio} compact />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      )}


      {/* RECENTI */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-black font-display uppercase tracking-tighter">{h.recentTitle}</h2>
              <p className="text-foreground/60 text-sm font-bold">{h.recentSub}</p>
            </div>
            <Link href="/annunci" className="hidden md:inline-flex items-center text-primary font-black uppercase tracking-wider hover:text-accent group text-sm gap-1 transition-all">
              {h.allBoardLink}
              <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </Link>
          </div>

          {errorRecenti ? (
            <Alert variant="destructive" className="border-4 border-destructive rounded-2xl">
              <AlertCircle className="h-6 w-6" strokeWidth={3} />
              <AlertTitle className="font-black text-lg uppercase tracking-wider">{h.errorTitle}</AlertTitle>
              <AlertDescription className="font-bold">{h.errorDesc}</AlertDescription>
            </Alert>
          ) : isLoadingRecenti ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-52 rounded-2xl" />)}
            </div>
          ) : recenti && recenti.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recenti.map((annuncio) => (
                <AnnuncioCard key={annuncio.id} annuncio={annuncio} compact />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl border-2 border-dashed border-foreground/20">
              <h3 className="text-xl font-black font-display uppercase tracking-wider mb-2">{h.emptyBoard}</h3>
              <p className="text-foreground/60 font-bold max-w-md mx-auto mb-6 text-sm">{h.emptyBoardDesc}</p>
              <Link href="/pubblica">
                <Button size="sm" className="rounded-xl font-black uppercase tracking-wider bg-accent text-accent-foreground border-2 border-foreground">
                  {h.emptyBoardBtn}
                </Button>
              </Link>
            </div>
          )}
          
          <div className="mt-6 text-center md:hidden">
            <Link href="/annunci">
              <Button variant="outline" size="sm" className="w-full rounded-xl font-black uppercase tracking-wider border-2 border-foreground">{h.allBoardLink}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 md:py-32 relative overflow-hidden bg-foreground text-background border-t-4 border-foreground">
        <div className="absolute inset-0 opacity-[0.05]" style={{backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black font-display mb-6 md:mb-8 uppercase tracking-tighter leading-[0.9]">
            {h.ctaTitle}
          </h2>
          <p className="text-base sm:text-xl md:text-2xl text-background/80 mb-8 md:mb-12 font-bold leading-relaxed">
            {h.ctaSub}
          </p>
          <Link href="/pubblica">
            <Button size="lg" className="h-14 md:h-20 px-8 md:px-12 rounded-2xl text-lg md:text-2xl font-black uppercase tracking-widest bg-primary text-primary-foreground border-4 border-background shadow-[6px_6px_0_0_#fff] md:shadow-[8px_8px_0_0_#fff] hover:translate-y-1 hover:translate-x-1 md:hover:translate-y-2 md:hover:translate-x-2 hover:shadow-none transition-all bouncy-active">
              {h.ctaBtn}
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
