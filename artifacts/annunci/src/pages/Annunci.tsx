import { Layout } from "@/components/layout/Layout";
import { useListAnnunci } from "@workspace/api-client-react";
import { useLocation, useSearch } from "wouter";
import { AnnuncioCard } from "@/components/ui/AnnuncioCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, SlidersHorizontal, AlertCircle, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CATEGORIES, getCategoryConfig } from "@/lib/constants";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackBanner } from "@/components/layout/BackBanner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Annunci() {
  const [, setLocation] = useLocation();
  const { t, lang } = useLanguage();
  const locale = lang === 'it' ? 'it-IT' : lang === 'es' ? 'es-ES' : 'en-GB';
  const searchString = useSearch();
  
  const params = useMemo(() => new URLSearchParams(searchString), [searchString]);
  const initialQ = params.get("q") || "";
  const initialCategoria = params.get("categoria") || "Tutti";
  const initialPrezzoMin = params.get("prezzoMin") || "";
  const initialPrezzoMax = params.get("prezzoMax") || "";
  const page = parseInt(params.get("page") || "1", 10);
  const limit = 12;

  const [q, setQ] = useState(initialQ);
  const [prezzoMin, setPrezzoMin] = useState(initialPrezzoMin);
  const [prezzoMax, setPrezzoMax] = useState(initialPrezzoMax);

  useEffect(() => {
    setQ(initialQ);
    setPrezzoMin(initialPrezzoMin);
    setPrezzoMax(initialPrezzoMax);
  }, [initialQ, initialPrezzoMin, initialPrezzoMax]);

  const queryParams = {
    ...(initialQ ? { q: initialQ } : {}),
    ...(initialCategoria !== "Tutti" ? { categoria: initialCategoria } : {}),
    ...(initialPrezzoMin ? { prezzoMin: parseInt(initialPrezzoMin, 10) } : {}),
    ...(initialPrezzoMax ? { prezzoMax: parseInt(initialPrezzoMax, 10) } : {}),
    page,
    limit,
  };

  const { data, isLoading, error } = useListAnnunci(queryParams);

  const activeCategoryConfig = initialCategoria !== "Tutti" 
    ? getCategoryConfig(initialCategoria.toLowerCase().replace(/\s+/g, '-')) 
    : null;

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newParams = new URLSearchParams();
    if (q) newParams.set("q", q);
    if (initialCategoria !== "Tutti") newParams.set("categoria", initialCategoria);
    if (prezzoMin) newParams.set("prezzoMin", prezzoMin);
    if (prezzoMax) newParams.set("prezzoMax", prezzoMax);
    
    setLocation(`/annunci?${newParams.toString()}`);
  };

  const handleCategoryChange = (val: string) => {
    const newParams = new URLSearchParams(params.toString());
    if (val === "Tutti") {
      newParams.delete("categoria");
    } else {
      newParams.set("categoria", val);
    }
    // reset page
    newParams.set("page", "1");
    // if switching to a non-price category, clear price filters
    const catConfig = getCategoryConfig(val.toLowerCase().replace(/\s+/g, '-'));
    if (!catConfig?.hasPrice && val !== "Tutti") {
      newParams.delete("prezzoMin");
      newParams.delete("prezzoMax");
    }
    
    setLocation(`/annunci?${newParams.toString()}`);
  };

  const clearFilters = () => {
    setQ("");
    setPrezzoMin("");
    setPrezzoMax("");
    const newParams = new URLSearchParams();
    if (initialCategoria !== "Tutti") newParams.set("categoria", initialCategoria);
    setLocation(`/annunci${newParams.toString() ? '?' + newParams.toString() : ''}`);
  };

  const tc = t.common;

  const FiltersForm = () => (
    <form onSubmit={handleApplyFilters} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold">{tc.keyword}</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder={tc.searchPlaceholder}
            className="pl-9 bg-muted/50 border-border/50 focus-visible:bg-background h-10 rounded-xl"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {(!activeCategoryConfig || activeCategoryConfig.hasPrice) && (
        <div className="space-y-2">
          <label className="text-sm font-semibold">{tc.priceRange}</label>
          <div className="flex items-center gap-2">
            <Input 
              type="number" 
              placeholder="Min" 
              className="bg-muted/50 border-border/50 focus-visible:bg-background h-10 rounded-xl"
              value={prezzoMin}
              onChange={(e) => setPrezzoMin(e.target.value)}
            />
            <span className="text-muted-foreground font-medium">-</span>
            <Input 
              type="number" 
              placeholder="Max" 
              className="bg-muted/50 border-border/50 focus-visible:bg-background h-10 rounded-xl"
              value={prezzoMax}
              onChange={(e) => setPrezzoMax(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 pt-4">
        <Button type="submit" className="w-full rounded-xl h-11 font-bold">{tc.apply}</Button>
        <Button type="button" variant="ghost" onClick={clearFilters} className="w-full rounded-xl h-11 font-medium">
          {tc.clearFilters}
        </Button>
      </div>
    </form>
  );

  return (
    <Layout>
      <BackBanner crumbs={[{ label: t.common.backToAll }]} backHref="/" />
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold font-display text-foreground tracking-tight">
                {initialCategoria !== "Tutti"
                  ? ((t.categories as Record<string, {name:string}>)[initialCategoria]?.name || getCategoryConfig(initialCategoria)?.name || initialCategoria)
                  : tc.board}
              </h1>
              <p className="text-muted-foreground mt-3 text-lg font-medium">
                {data?.total ? `${data.total.toLocaleString(locale)} ${tc.adsAvailable}` : t.footer.searchBoard}
              </p>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto pb-2 scrollbar-hide">
            <Tabs value={initialCategoria} onValueChange={handleCategoryChange} className="w-full">
              <TabsList className="bg-transparent h-auto p-0 flex gap-2 w-max">
                <TabsTrigger 
                  value="Tutti" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 py-2.5 text-sm font-semibold border shadow-sm data-[state=inactive]:bg-card hover:bg-muted transition-colors"
                >
                  {tc.backToAll}
                </TabsTrigger>
                {CATEGORIES.map(cat => (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-6 py-2.5 text-sm font-semibold border shadow-sm data-[state=inactive]:bg-card hover:bg-muted transition-colors"
                  >
                    <cat.icon className="w-4 h-4 mr-2" />
                    {(t.categories as Record<string, {name:string}>)[cat.id]?.name ?? cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-72 shrink-0 sticky top-24">
            <div className="bg-card border rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-xl">{tc.postFilters}</h2>
              </div>
              <FiltersForm />
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="md:hidden w-full flex items-center justify-between bg-card border rounded-2xl p-3 px-5 mb-4 shadow-sm">
            <span className="text-sm font-bold text-foreground">
              {tc.postFilters}
            </span>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" size="sm" className="gap-2 rounded-xl font-bold">
                  <SlidersHorizontal className="w-4 h-4" />
                  {tc.postFilters}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto">
                <SheetHeader className="mb-6 text-left">
                  <SheetTitle className="font-display text-2xl">{tc.filters}</SheetTitle>
                </SheetHeader>
                <FiltersForm />
              </SheetContent>
            </Sheet>
          </div>

          {/* Results Area */}
          <div className="flex-1 w-full min-w-0">
            {/* Active Filters Display */}
            {(initialQ || initialPrezzoMin || initialPrezzoMax) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {initialQ && (
                  <Badge variant="secondary" className="px-3 py-1.5 rounded-full text-sm font-medium gap-2">
                    "{initialQ}"
                    <button onClick={() => {
                      const p = new URLSearchParams(params.toString()); p.delete("q"); p.delete("page");
                      setLocation(`/annunci${p.toString() ? '?' + p.toString() : ''}`);
                    }} className="hover:text-destructive transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                )}
                {(initialPrezzoMin || initialPrezzoMax) && (
                  <Badge variant="secondary" className="px-3 py-1.5 rounded-full text-sm font-medium gap-2">
                    {initialPrezzoMin ? `€${initialPrezzoMin}` : '€0'} - {initialPrezzoMax ? `€${initialPrezzoMax}` : 'Max'}
                    <button onClick={() => {
                      const p = new URLSearchParams(params.toString()); p.delete("prezzoMin"); p.delete("prezzoMax"); p.delete("page");
                      setLocation(`/annunci${p.toString() ? '?' + p.toString() : ''}`);
                    }} className="hover:text-destructive transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-8 text-muted-foreground rounded-full hover:bg-destructive/10 hover:text-destructive">
                  {tc.clearAll}
                </Button>
              </div>
            )}

            {error ? (
              <Alert variant="destructive" className="rounded-2xl">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{tc.loadError}</AlertTitle>
                <AlertDescription>
                  {tc.noResultsDesc}
                </AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-[400px] rounded-2xl" />)}
              </div>
            ) : data?.annunci && data.annunci.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.annunci.map(annuncio => (
                    <AnnuncioCard key={annuncio.id} annuncio={annuncio} />
                  ))}
                </div>

                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12 pt-8 border-t">
                    <Button 
                      variant="outline" 
                      disabled={page <= 1}
                      onClick={() => {
                        const newParams = new URLSearchParams(params.toString());
                        newParams.set("page", (page - 1).toString());
                        setLocation(`/annunci?${newParams.toString()}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="rounded-full font-semibold"
                    >
                      {tc.previous}
                    </Button>
                    <div className="flex items-center gap-2 text-sm font-bold bg-muted px-4 py-2 rounded-full">
                      <span>{page}</span>
                      <span className="text-muted-foreground">{tc.of}</span>
                      <span>{data.totalPages}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      disabled={page >= data.totalPages}
                      onClick={() => {
                        const newParams = new URLSearchParams(params.toString());
                        newParams.set("page", (page + 1).toString());
                        setLocation(`/annunci?${newParams.toString()}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="rounded-full font-semibold"
                    >
                      {tc.next}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border flex flex-col items-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold font-display text-foreground mb-2">{tc.noResults}</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8 font-medium">
                  {tc.noResultsDesc}
                </p>
                <Button onClick={clearFilters} size="lg" className="rounded-full">{tc.removeFilters}</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
