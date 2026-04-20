import { Layout } from "@/components/layout/Layout";
import { useListAnnunci, useListCategorie } from "@workspace/api-client-react";
import { useLocation, useSearch } from "wouter";
import { AnnuncioCard } from "@/components/ui/AnnuncioCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, SlidersHorizontal, AlertCircle, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Annunci() {
  const [location, setLocation] = useLocation();
  const searchString = useSearch();
  
  // Parse query params
  const params = useMemo(() => new URLSearchParams(searchString), [searchString]);
  const initialQ = params.get("q") || "";
  const initialCategoria = params.get("categoria") || "";
  const initialCitta = params.get("citta") || "";
  const initialPrezzoMin = params.get("prezzoMin") || "";
  const initialPrezzoMax = params.get("prezzoMax") || "";
  const page = parseInt(params.get("page") || "1", 10);
  const limit = 12;

  // Local state for the form
  const [q, setQ] = useState(initialQ);
  const [categoria, setCategoria] = useState(initialCategoria);
  const [citta, setCitta] = useState(initialCitta);
  const [prezzoMin, setPrezzoMin] = useState(initialPrezzoMin);
  const [prezzoMax, setPrezzoMax] = useState(initialPrezzoMax);

  // Sync state when URL changes
  useEffect(() => {
    setQ(initialQ);
    setCategoria(initialCategoria);
    setCitta(initialCitta);
    setPrezzoMin(initialPrezzoMin);
    setPrezzoMax(initialPrezzoMax);
  }, [initialQ, initialCategoria, initialCitta, initialPrezzoMin, initialPrezzoMax]);

  const { data: categorieData } = useListCategorie();
  
  const queryParams = {
    q: initialQ || null,
    categoria: initialCategoria || null,
    citta: initialCitta || null,
    prezzoMin: initialPrezzoMin ? parseInt(initialPrezzoMin, 10) : null,
    prezzoMax: initialPrezzoMax ? parseInt(initialPrezzoMax, 10) : null,
    page,
    limit
  };

  const { data, isLoading, error } = useListAnnunci(queryParams);

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newParams = new URLSearchParams();
    if (q) newParams.set("q", q);
    if (categoria && categoria !== "all") newParams.set("categoria", categoria);
    if (citta) newParams.set("citta", citta);
    if (prezzoMin) newParams.set("prezzoMin", prezzoMin);
    if (prezzoMax) newParams.set("prezzoMax", prezzoMax);
    
    setLocation(`/annunci?${newParams.toString()}`);
  };

  const clearFilters = () => {
    setQ("");
    setCategoria("");
    setCitta("");
    setPrezzoMin("");
    setPrezzoMax("");
    setLocation("/annunci");
  };

  const FiltersForm = () => (
    <form onSubmit={handleApplyFilters} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Cerca</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Cosa cerchi?" 
            className="pl-9"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Categoria</label>
        <Select value={categoria || "all"} onValueChange={setCategoria}>
          <SelectTrigger>
            <SelectValue placeholder="Tutte le categorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutte le categorie</SelectItem>
            {categorieData?.map((cat) => (
              <SelectItem key={cat.id} value={cat.nome}>
                {cat.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Città</label>
        <Input 
          placeholder="Es. Milano, Roma..." 
          value={citta}
          onChange={(e) => setCitta(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Prezzo (€)</label>
        <div className="flex items-center gap-2">
          <Input 
            type="number" 
            placeholder="Min" 
            value={prezzoMin}
            onChange={(e) => setPrezzoMin(e.target.value)}
          />
          <span className="text-muted-foreground">-</span>
          <Input 
            type="number" 
            placeholder="Max" 
            value={prezzoMax}
            onChange={(e) => setPrezzoMax(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Button type="submit" className="w-full">Applica Filtri</Button>
        <Button type="button" variant="outline" onClick={clearFilters} className="w-full">
          Reimposta
        </Button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {initialCategoria ? `Annunci in ${initialCategoria}` : "Tutti gli annunci"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {data?.total ? `${data.total.toLocaleString('it-IT')} risultati trovati` : "Esplora il marketplace"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-72 shrink-0 sticky top-24">
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg">Filtra risultati</h2>
              </div>
              <FiltersForm />
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="md:hidden w-full flex items-center justify-between bg-card border rounded-xl p-2 px-4 mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              {data?.total || 0} risultati
            </span>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtri
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto">
                <SheetHeader className="mb-6">
                  <SheetTitle>Filtra risultati</SheetTitle>
                </SheetHeader>
                <FiltersForm />
              </SheetContent>
            </Sheet>
          </div>

          {/* Results Area */}
          <div className="flex-1 w-full min-w-0">
            {/* Active Filters Display */}
            {(initialQ || initialCategoria || initialCitta || initialPrezzoMin || initialPrezzoMax) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {initialQ && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <span>"{initialQ}"</span>
                    <button onClick={() => { setQ(""); handleApplyFilters(); }} className="hover:bg-primary/20 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {initialCategoria && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <span>{initialCategoria}</span>
                    <button onClick={() => { setCategoria(""); handleApplyFilters(); }} className="hover:bg-primary/20 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {initialCitta && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <MapPin className="w-3 h-3" />
                    <span>{initialCitta}</span>
                    <button onClick={() => { setCitta(""); handleApplyFilters(); }} className="hover:bg-primary/20 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {(initialPrezzoMin || initialPrezzoMax) && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <span>
                      {initialPrezzoMin ? `€${initialPrezzoMin}` : '€0'} - {initialPrezzoMax ? `€${initialPrezzoMax}` : 'Max'}
                    </span>
                    <button onClick={() => { setPrezzoMin(""); setPrezzoMax(""); handleApplyFilters(); }} className="hover:bg-primary/20 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-8 text-muted-foreground">
                  Cancella tutti
                </Button>
              </div>
            )}

            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Errore</AlertTitle>
                <AlertDescription>
                  Si è verificato un errore nel caricamento degli annunci.
                </AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-[360px] rounded-xl" />)}
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
                        window.scrollTo(0, 0);
                      }}
                    >
                      Precedente
                    </Button>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <span className="w-10 text-center">{page}</span>
                      <span className="text-muted-foreground">di</span>
                      <span className="w-10 text-center">{data.totalPages}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      disabled={page >= data.totalPages}
                      onClick={() => {
                        const newParams = new URLSearchParams(params.toString());
                        newParams.set("page", (page + 1).toString());
                        setLocation(`/annunci?${newParams.toString()}`);
                        window.scrollTo(0, 0);
                      }}
                    >
                      Successiva
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-24 bg-card rounded-2xl border border-dashed border-border flex flex-col items-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Nessun risultato</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Non abbiamo trovato annunci corrispondenti ai tuoi criteri di ricerca. Prova ad ampliare la ricerca o a rimuovere qualche filtro.
                </p>
                <Button onClick={clearFilters}>Mostra tutti gli annunci</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
