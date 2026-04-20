import { Layout } from "@/components/layout/Layout";
import { useListCategorie } from "@workspace/api-client-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Categorie() {
  const { data: dbCategorie, isLoading } = useListCategorie();
  const [search, setSearch] = useState("");
  const { t } = useLanguage();

  const displayCategories = CATEGORIES.map(cat => {
    const dbCat = dbCategorie?.find(c => c.nome === cat.name);
    const catT = (t.categories as Record<string, { name: string; description: string }>)[cat.id];
    return {
      ...cat,
      name: catT?.name ?? cat.name,
      description: catT?.description ?? cat.description,
      count: dbCat ? dbCat.count : 0
    };
  });

  const filteredCategorie = displayCategories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) || 
    cat.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-foreground text-background py-24 border-b-4 border-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-6xl md:text-8xl font-black font-display uppercase tracking-tighter leading-[0.9]">
              Tutte le <span className="text-accent">Bacheche</span>
            </h1>
            <p className="text-2xl text-background/80 font-bold leading-relaxed">
              Esplora le sezioni di RomaNex.
            </p>
            
            <div className="relative max-w-2xl mx-auto mt-12">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground w-6 h-6" strokeWidth={3} />
              <Input 
                placeholder="Cerca una categoria..." 
                className="pl-16 h-20 text-2xl rounded-2xl bg-background border-4 border-background shadow-[8px_8px_0_0_hsl(var(--primary))] focus-visible:border-primary focus-visible:ring-0 text-foreground font-black uppercase tracking-wider placeholder:text-foreground/40"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-24">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-64 rounded-3xl border-4 border-foreground" />
            ))}
          </div>
        ) : filteredCategorie && filteredCategorie.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategorie.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.id} href={`/${cat.id}`} className={`group outline-none block ${cat.colorClass}`}>
                  <div className="flex flex-col p-8 rounded-3xl border-4 border-foreground shadow-[8px_8px_0_0_hsl(var(--foreground))] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] transition-all duration-300 h-full group-hover:translate-y-1 group-hover:translate-x-1 relative overflow-hidden" style={{backgroundColor: `hsl(var(--cat-bg))`}}>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="flex items-start justify-between mb-8 relative z-10">
                      <div className="w-20 h-20 rounded-2xl bg-white/20 text-white flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 border-2 border-white/30 backdrop-blur-sm">
                        <Icon className="w-10 h-10" strokeWidth={2.5} />
                      </div>
                      <div className="bg-foreground text-background px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest border-2 border-foreground shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]">
                        {cat.count.toLocaleString('it-IT')} {t.common.adsAvailable}
                      </div>
                    </div>
                    <div className="relative z-10">
                      <h2 className="text-4xl font-black font-display text-white mb-4 uppercase tracking-tighter">
                        {cat.name}
                      </h2>
                      <p className="text-lg text-white/90 font-bold leading-relaxed mb-6">
                        {cat.description}
                      </p>
                      
                      <div className="inline-flex items-center text-white font-black uppercase tracking-widest group-hover:text-foreground transition-colors">
                        {t.common.explore} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 bg-background rounded-3xl border-4 border-dashed border-foreground max-w-3xl mx-auto">
            <h3 className="text-4xl font-black font-display text-foreground mb-6 uppercase tracking-tighter">Nessuna categoria trovata</h3>
            <p className="text-foreground/60 text-xl font-bold mb-10">
              Prova a cercare con un altro termine o esplora tutta la bacheca.
            </p>
            <Link href="/annunci" className="inline-flex items-center px-8 py-4 bg-foreground text-background rounded-xl font-black text-lg uppercase tracking-wider hover:bg-primary transition-colors bouncy-active">
              Vedi tutti gli annunci <ArrowRight className="ml-3 w-6 h-6" strokeWidth={3} />
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
