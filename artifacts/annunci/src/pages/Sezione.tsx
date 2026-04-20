import { useState, useMemo, useEffect } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { useListAnnunci, useListCategorie } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { AnnuncioCard } from "@/components/ui/AnnuncioCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search, MapPin, PlusCircle, ArrowRight, Filter,
  AlertCircle, X, SlidersHorizontal, ChevronLeft,
  CheckCircle, Tag
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getCategoryConfig } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";
import { BackBanner } from "@/components/layout/BackBanner";

type SectionKey = "appartamenti" | "libri" | "ripetizioni" | "consigli" | "gruppi-studio";

interface SezioneProps {
  catId: SectionKey;
}

const HAS_PRICE: Record<SectionKey, boolean> = {
  appartamenti: true,
  libri: true,
  ripetizioni: true,
  consigli: false,
  "gruppi-studio": false,
};

export default function Sezione({ catId }: SezioneProps) {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = useMemo(() => new URLSearchParams(searchString), [searchString]);
  const { t } = useLanguage();

  const [q, setQ] = useState(params.get("q") || "");
  const [citta, setCitta] = useState(params.get("citta") || "");
  const [prezzoMin, setPrezzoMin] = useState(params.get("prezzoMin") || "");
  const [prezzoMax, setPrezzoMax] = useState(params.get("prezzoMax") || "");
  const page = parseInt(params.get("page") || "1", 10);
  const limit = 12;

  useEffect(() => {
    setQ(params.get("q") || "");
    setCitta(params.get("citta") || "");
    setPrezzoMin(params.get("prezzoMin") || "");
    setPrezzoMax(params.get("prezzoMax") || "");
  }, [searchString]);

  const catConfig = getCategoryConfig(catId);
  const sectionCfg = (t.sections as unknown as Record<string, typeof t.sections.appartamenti>)[catId] ?? t.sections.appartamenti;
  const catT = (t.categories as Record<string, { name: string; description: string }>)[catId];
  const hasPrice = HAS_PRICE[catId];

  const queryParams = {
    q: params.get("q") || null,
    categoria: catId,
    citta: params.get("citta") || null,
    prezzoMin: params.get("prezzoMin") ? parseInt(params.get("prezzoMin")!, 10) : null,
    prezzoMax: params.get("prezzoMax") ? parseInt(params.get("prezzoMax")!, 10) : null,
    page,
    limit,
  };

  const { data, isLoading, error } = useListAnnunci(queryParams);
  const { data: categorie } = useListCategorie();
  const count = categorie?.find(c => c.id === catId)?.count ?? data?.total ?? 0;

  const buildUrl = (overrides: Record<string, string>) => {
    const next = new URLSearchParams();
    const cur = { q, citta, prezzoMin, prezzoMax, ...overrides };
    if (cur.q) next.set("q", cur.q);
    if (cur.citta) next.set("citta", cur.citta);
    if (cur.prezzoMin) next.set("prezzoMin", cur.prezzoMin);
    if (cur.prezzoMax) next.set("prezzoMax", cur.prezzoMax);
    return `/${catId}${next.toString() ? "?" + next.toString() : ""}`;
  };

  const applyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLocation(buildUrl({}));
  };

  const clearAll = () => {
    setQ(""); setCitta(""); setPrezzoMin(""); setPrezzoMax("");
    setLocation(`/${catId}`);
  };

  const addQuickTag = (tag: string) => {
    const next = params.get("q") === tag ? "" : tag;
    setQ(next);
    setLocation(buildUrl({ q: next }));
  };

  const hasActiveFilters = !!(params.get("q") || params.get("citta") || params.get("prezzoMin") || params.get("prezzoMax"));

  const Icon = catConfig.icon;
  const tc = t.common;

  const FiltersForm = () => (
    <form onSubmit={applyFilters} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-black uppercase tracking-wider">{tc.keyword}</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder={tc.searchPlaceholder} className="pl-9 h-10 rounded-xl bg-muted/50" value={q} onChange={e => setQ(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-black uppercase tracking-wider">{tc.city}</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder={tc.citySearchPlaceholder} className="pl-9 h-10 rounded-xl bg-muted/50" value={citta} onChange={e => setCitta(e.target.value)} />
        </div>
      </div>
      {hasPrice && (
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-wider">{sectionCfg.priceLabel || tc.priceRange}</label>
          <div className="flex gap-2 items-center">
            <Input type="number" placeholder="Min" className="h-10 rounded-xl bg-muted/50" value={prezzoMin} onChange={e => setPrezzoMin(e.target.value)} />
            <span className="text-muted-foreground">–</span>
            <Input type="number" placeholder="Max" className="h-10 rounded-xl bg-muted/50" value={prezzoMax} onChange={e => setPrezzoMax(e.target.value)} />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2 pt-3">
        <Button type="submit" className="w-full rounded-xl h-11 font-black uppercase tracking-wide">{tc.apply}</Button>
        <Button type="button" variant="ghost" onClick={clearAll} className="w-full rounded-xl h-10 font-bold text-sm">{tc.clearFilters}</Button>
      </div>
    </form>
  );

  return (
    <Layout>
      <BackBanner crumbs={[{ label: catT?.name ?? catConfig.name }]} backHref="/" />
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className={`${catConfig.colorClass}`}>
        <section className="relative overflow-hidden border-b-4 border-white/20 py-16 md:py-24" style={{ backgroundColor: `hsl(var(--cat-bg))` }}>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -translate-x-1/4 translate-y-1/2 pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <Link href="/annunci" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white font-bold text-sm uppercase tracking-wider mb-8 transition-colors">
              <ChevronLeft className="w-4 h-4" strokeWidth={3} />
              {tc.backToAll}
            </Link>

            <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-16">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2.5 bg-white/20 border border-white/30 rounded-2xl px-4 py-2 backdrop-blur-sm">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="font-black text-white text-sm uppercase tracking-widest">{catT?.name ?? catConfig.name}</span>
                  {count > 0 && (
                    <span className="bg-white/20 text-white font-black text-xs px-2 py-0.5 rounded-full">{count}</span>
                  )}
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-[84px] font-black font-display uppercase tracking-tighter leading-[0.88] text-white whitespace-pre-line drop-shadow-sm">
                  {sectionCfg.heroTitle}
                </h1>

                <p className="text-white/80 text-lg md:text-xl font-medium leading-relaxed max-w-lg border-l-4 border-white/30 pl-5">
                  {sectionCfg.heroSub}
                </p>

                <div className="flex flex-wrap gap-2">
                  {sectionCfg.quickTags.map(tag => {
                    const active = params.get("q") === tag;
                    return (
                      <button key={tag} onClick={() => addQuickTag(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-black uppercase tracking-wider border-2 transition-all ${
                          active
                            ? "bg-white text-foreground border-white shadow-[3px_3px_0_0_rgba(0,0,0,0.3)]"
                            : "bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
                        }`}>
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search bar */}
              <div className="w-full md:w-80 shrink-0">
                <form onSubmit={applyFilters} className="bg-background rounded-2xl border-4 border-white/30 p-4 shadow-xl space-y-3">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground w-5 h-5" strokeWidth={2.5} />
                    <Input placeholder={tc.searchPlaceholder} className="pl-12 h-12 rounded-xl border-2 focus-visible:border-foreground text-base font-bold" value={q} onChange={e => setQ(e.target.value)} />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" strokeWidth={2.5} />
                    <Input placeholder={tc.citySearchPlaceholder} className="pl-12 h-12 rounded-xl border-2 text-base" value={citta} onChange={e => setCitta(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl font-black uppercase tracking-wider text-base" style={{ backgroundColor: `hsl(var(--cat-bg))`, color: `hsl(var(--cat-fg))` }}>
                    {tc.search} <ArrowRight className="ml-2 w-5 h-5" strokeWidth={3} />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="container mx-auto px-4 md:px-6 py-10">

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {params.get("q") && (
              <Badge variant="secondary" className="px-3 py-1.5 rounded-full font-bold gap-2">
                "{params.get("q")}"
                <button onClick={() => { setQ(""); setLocation(buildUrl({ q: "" })); }}><X className="w-3 h-3" /></button>
              </Badge>
            )}
            {params.get("citta") && (
              <Badge variant="secondary" className="px-3 py-1.5 rounded-full font-bold gap-2">
                <MapPin className="w-3.5 h-3.5" /> {params.get("citta")}
                <button onClick={() => { setCitta(""); setLocation(buildUrl({ citta: "" })); }}><X className="w-3 h-3" /></button>
              </Badge>
            )}
            {(params.get("prezzoMin") || params.get("prezzoMax")) && (
              <Badge variant="secondary" className="px-3 py-1.5 rounded-full font-bold gap-2">
                <Tag className="w-3.5 h-3.5" />
                {params.get("prezzoMin") ? `€${params.get("prezzoMin")}` : "0"} – {params.get("prezzoMax") ? `€${params.get("prezzoMax")}` : "∞"}
                <button onClick={() => { setPrezzoMin(""); setPrezzoMax(""); setLocation(buildUrl({ prezzoMin: "", prezzoMax: "" })); }}><X className="w-3 h-3" /></button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearAll} className="rounded-full text-xs text-destructive hover:bg-destructive/10 font-bold h-8">
              {tc.clearAll}
            </Button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* Sidebar — desktop */}
          <aside className="hidden md:flex flex-col gap-4 w-72 shrink-0 sticky top-28">

            <div className="bg-card border-2 border-foreground rounded-3xl p-6 shadow-[4px_4px_0_0_hsl(var(--foreground))]">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b">
                <Filter className="w-5 h-5 text-primary" strokeWidth={2.5} />
                <h2 className="font-display font-black text-xl uppercase tracking-tight">{tc.filters}</h2>
              </div>
              <FiltersForm />
            </div>

            {/* Tips card */}
            <div className={`${catConfig.colorClass} rounded-3xl border-4 border-white/20 overflow-hidden`} style={{ backgroundColor: `hsl(var(--cat-bg))` }}>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2 text-white font-black uppercase tracking-wider text-sm">
                  <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
                  {tc.usefulTips}
                </div>
                <ul className="space-y-2.5">
                  {sectionCfg.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-white/80 text-xs font-medium leading-relaxed">
                      <CheckCircle className="w-3.5 h-3.5 text-white/60 mt-0.5 shrink-0" strokeWidth={2.5} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Publish CTA */}
            <Link href={`/pubblica?categoria=${catId}`}>
              <div className="bg-accent/10 border-2 border-accent/30 rounded-3xl p-5 hover:border-accent hover:bg-accent/15 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                    <PlusCircle className="w-5 h-5 text-accent" strokeWidth={2.5} />
                  </div>
                  <span className="font-black text-sm uppercase tracking-wider text-accent">{sectionCfg.publishLabel}</span>
                </div>
                <p className="text-xs text-foreground/60 font-medium">Gratis, in meno di 2 minuti.</p>
              </div>
            </Link>
          </aside>

          {/* Results */}
          <div className="flex-1 w-full min-w-0 space-y-6">

            {/* Mobile filters */}
            <div className="md:hidden flex items-center justify-between bg-card border-2 border-foreground rounded-2xl p-3 px-4">
              <span className="text-sm font-black uppercase tracking-wide">
                {data?.total !== undefined ? `${data.total} annunci` : tc.search}
              </span>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary" size="sm" className="gap-2 rounded-xl font-black">
                    <SlidersHorizontal className="w-4 h-4" />
                    {tc.postFilters}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto">
                  <SheetHeader className="mb-6 text-left">
                    <SheetTitle className="font-display text-2xl font-black uppercase">{tc.filters}</SheetTitle>
                  </SheetHeader>
                  <FiltersForm />
                </SheetContent>
              </Sheet>
            </div>

            {/* Results count — desktop */}
            <div className="hidden md:flex items-center justify-between">
              <p className="text-foreground/60 font-bold text-sm">
                {isLoading ? tc.loading : data?.total !== undefined ? `${data.total.toLocaleString("it-IT")} ${tc.announceAds}` : ""}
              </p>
            </div>

            {/* Grid */}
            {error ? (
              <div className="text-center py-16 bg-destructive/5 rounded-3xl border-2 border-destructive/20">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <p className="font-black text-lg uppercase">{tc.loadError}</p>
                <p className="text-muted-foreground font-medium">{tc.noResultsDesc}</p>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-[400px] rounded-3xl" />)}
              </div>
            ) : data?.annunci && data.annunci.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data.annunci.map(annuncio => (
                    <AnnuncioCard key={annuncio.id} annuncio={annuncio} />
                  ))}
                </div>

                {data.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-12 pt-8 border-t">
                    <Button variant="outline" disabled={page <= 1}
                      onClick={() => { const p = new URLSearchParams(params.toString()); p.set("page", (page - 1).toString()); setLocation(`/${catId}?${p}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className="rounded-full font-black border-2 border-foreground">{tc.previous}</Button>
                    <div className="flex items-center gap-2 text-sm font-black bg-muted px-4 py-2 rounded-full border-2 border-foreground">
                      <span>{page}</span><span className="text-muted-foreground">{tc.of}</span><span>{data.totalPages}</span>
                    </div>
                    <Button variant="outline" disabled={page >= data.totalPages}
                      onClick={() => { const p = new URLSearchParams(params.toString()); p.set("page", (page + 1).toString()); setLocation(`/${catId}?${p}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className="rounded-full font-black border-2 border-foreground">{tc.next}</Button>
                  </div>
                )}
              </>
            ) : (
              <div className={`${catConfig.colorClass} text-center py-24 rounded-3xl border-4 border-white/20 overflow-hidden relative`} style={{ backgroundColor: `hsl(var(--cat-bg))` }}>
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                <div className="relative z-10 space-y-6">
                  <div className="w-24 h-24 rounded-3xl bg-white/20 border-4 border-white/30 flex items-center justify-center mx-auto shadow-xl rotate-3">
                    <Icon className="w-12 h-12 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black font-display uppercase tracking-tighter text-white mb-3">{sectionCfg.emptyTitle}</h3>
                    <p className="text-white/70 max-w-sm mx-auto font-medium leading-relaxed">{sectionCfg.emptyDesc}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {hasActiveFilters && (
                      <Button onClick={clearAll} variant="secondary" className="rounded-full font-black border-2 border-foreground">
                        {tc.removeFilters}
                      </Button>
                    )}
                    <Link href={`/pubblica?categoria=${catId}`}>
                      <Button className="rounded-full font-black bg-white text-foreground border-2 border-white/50 hover:bg-white/90 px-8 shadow-lg">
                        <PlusCircle className="w-4 h-4 mr-2" strokeWidth={2.5} />
                        {sectionCfg.publishLabel}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
