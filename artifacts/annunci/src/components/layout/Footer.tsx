import { GraduationCap, Heart, BookOpen, Users, MapPin, Search, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { CATEGORIES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-auto overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-primary/20 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-accent/20 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          <div className="md:col-span-5 space-y-8">
            <Link href="/" className="flex items-center space-x-3 group outline-none w-max">
              <div className="bg-primary text-primary-foreground p-2.5 rounded-xl rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <GraduationCap className="h-8 w-8" strokeWidth={2.5} />
              </div>
              <span className="font-display text-3xl font-black text-background tracking-tighter uppercase">
                Roma<span className="text-accent">Nex</span>
              </span>
            </Link>
            <p className="text-background/70 text-lg font-medium max-w-md leading-relaxed">
              La bacheca digitale per gli studenti universitari italiani. 
              Molla i vecchi foglietti di carta, trova tutto qui.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-background px-4 py-2 rounded-lg border-2 border-background/20 bg-background/5">
                <BookOpen className="h-4 w-4" strokeWidth={2.5} /> Studio
              </div>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-background px-4 py-2 rounded-lg border-2 border-background/20 bg-background/5">
                <Users className="h-4 w-4" strokeWidth={2.5} /> Comunità
              </div>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-background px-4 py-2 rounded-lg border-2 border-background/20 bg-background/5">
                <MapPin className="h-4 w-4" strokeWidth={2.5} /> Ateneo
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3 space-y-6">
            <h3 className="font-black text-xl text-background uppercase tracking-wider">Esplora</h3>
            <ul className="space-y-4 text-base font-medium text-background/70">
              {CATEGORIES.map(c => (
                <li key={c.id}>
                  <Link href={`/${c.id}`} className="hover:text-primary transition-colors flex items-center group w-max">
                    <span className="group-hover:translate-x-2 transition-transform">{c.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/categorie" className="text-background font-bold hover:text-accent transition-colors flex items-center gap-1 group w-max mt-6">
                  Tutte le categorie <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={3} />
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-4 space-y-6">
            <h3 className="font-black text-xl text-background uppercase tracking-wider">Azioni</h3>
            <ul className="space-y-4 text-base font-medium text-background/70">
              <li>
                <Link href="/pubblica" className="text-accent hover:text-accent/80 font-bold transition-colors flex items-center gap-2 group w-max">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="w-4 h-4 text-accent" strokeWidth={3} />
                  </div>
                  Pubblica Annuncio
                </Link>
              </li>
              <li>
                <Link href="/annunci" className="hover:text-primary transition-colors flex items-center gap-2 group w-max">
                  <div className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Search className="w-4 h-4 text-background" strokeWidth={2.5} />
                  </div>
                  Cerca nella bacheca
                </Link>
              </li>
            </ul>
            
            <div className="pt-8 space-y-4">
              <h3 className="font-black text-sm text-background/50 uppercase tracking-wider">Note Legali</h3>
              <div className="flex gap-4 text-sm text-background/40 font-bold uppercase">
                <span className="cursor-not-allowed hover:text-background/60 transition-colors">Linee Guida</span>
                <span className="cursor-not-allowed hover:text-background/60 transition-colors">Privacy</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t-2 border-background/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-background/50 font-bold uppercase tracking-wider">
          <p>© {new Date().getFullYear()} RomaNex. Tutti i diritti riservati.</p>
          <p className="flex items-center gap-2">
            Fatto con <Heart className="h-5 w-5 text-accent fill-accent animate-pulse" /> in Italia
          </p>
        </div>
      </div>
    </footer>
  );
}
