import { Layout } from "@/components/layout/Layout";
import { useListCategorie } from "@workspace/api-client-react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Categorie() {
  const { data: categorie, isLoading } = useListCategorie();
  const [search, setSearch] = useState("");

  const filteredCategorie = categorie?.filter(cat => 
    cat.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="bg-primary/5 py-12 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Tutte le Categorie
            </h1>
            <p className="text-xl text-muted-foreground">
              Sfoglia il nostro catalogo completo e trova esattamente quello che stai cercando tra migliaia di annunci.
            </p>
            
            <div className="relative max-w-md mx-auto mt-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Filtra categorie..." 
                className="pl-12 h-14 text-lg rounded-full bg-background border-border/50 shadow-sm focus-visible:ring-primary/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : filteredCategorie && filteredCategorie.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategorie.map((cat) => (
              <Link key={cat.id} href={`/annunci?categoria=${encodeURIComponent(cat.nome)}`} className="group">
                <div className="flex items-center p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 h-full group-hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mr-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shrink-0">
                    <CategoryIcon name={cat.nome} className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{cat.nome}</h2>
                    <p className="text-sm text-muted-foreground mt-1 font-medium">{cat.count.toLocaleString('it-IT')} annunci</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-2">Nessuna categoria trovata</h3>
            <p className="text-muted-foreground text-lg">
              Prova a cercare con un altro termine o esplora tutti gli annunci.
            </p>
            <Link href="/annunci" className="inline-block mt-6 text-primary font-semibold hover:underline">
              Vedi tutti gli annunci →
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
