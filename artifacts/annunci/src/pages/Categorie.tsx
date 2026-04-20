import { Layout } from "@/components/layout/Layout";
import { useListCategorie } from "@workspace/api-client-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";

export default function Categorie() {
  const { data: dbCategorie, isLoading } = useListCategorie();
  const [search, setSearch] = useState("");

  // Merge static constant info with DB counts
  const displayCategories = CATEGORIES.map(cat => {
    const dbCat = dbCategorie?.find(c => c.nome === cat.name);
    return {
      ...cat,
      count: dbCat ? dbCat.count : 0
    };
  });

  const filteredCategorie = displayCategories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) || 
    cat.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-primary/5 py-16 border-b relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold font-display text-foreground tracking-tight">
              Tutte le Bacheche
            </h1>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
              Esplora le sezioni di CampusBoard. Che tu stia cercando una stanza, vendendo un libro o cercando compagni di studio, sei nel posto giusto.
            </p>
            
            <div className="relative max-w-lg mx-auto mt-10">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Cerca una categoria..." 
                className="pl-14 h-16 text-lg rounded-2xl bg-background border-border/50 shadow-xl focus-visible:ring-primary/20 font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-48 rounded-3xl" />
            ))}
          </div>
        ) : filteredCategorie && filteredCategorie.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategorie.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.id} href={`/annunci?categoria=${encodeURIComponent(cat.name)}`} className="group outline-none">
                  <div className={`flex flex-col p-8 bg-card rounded-3xl border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 h-full group-hover:-translate-y-1 group-focus-visible:ring-2 ring-primary ${cat.colorClass}`}>
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--cat-bg))] text-[hsl(var(--cat-fg))] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="bg-muted px-3 py-1 rounded-full text-sm font-bold text-muted-foreground">
                        {cat.count.toLocaleString('it-IT')} post
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-display text-foreground group-hover:text-primary transition-colors mb-3">
                        {cat.name}
                      </h2>
                      <p className="text-base text-muted-foreground font-medium leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border max-w-2xl mx-auto shadow-sm">
            <h3 className="text-3xl font-bold font-display text-foreground mb-4">Nessuna categoria trovata</h3>
            <p className="text-muted-foreground text-lg font-medium">
              Prova a cercare con un altro termine o esplora tutta la bacheca.
            </p>
            <Link href="/annunci" className="inline-block mt-8 text-primary font-bold text-lg hover:underline underline-offset-4">
              Vedi tutti gli annunci →
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
