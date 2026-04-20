import { Link, useLocation } from "wouter";
import { PlusCircle, Search, Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b-[3px] border-foreground bg-background/95 backdrop-blur shadow-[0_4px_0_0_hsl(var(--foreground))]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-3 group outline-none">
              <div className="bg-primary text-primary-foreground p-2 rounded-xl rotate-3 group-hover:rotate-0 transition-transform duration-300 border-2 border-foreground shadow-[2px_2px_0_0_hsl(var(--foreground))]">
                <GraduationCap className="h-7 w-7" strokeWidth={2.5} />
              </div>
              <span className="font-display text-2xl font-black text-foreground tracking-tighter uppercase">
                Campus<span className="text-accent">Board</span>
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wide uppercase">
              <Link href="/annunci" className={`relative py-2 group outline-none`}>
                <span className={`transition-colors ${location === '/annunci' ? 'text-primary' : 'text-foreground/80 group-hover:text-primary'}`}>
                  Bacheca
                </span>
                <span className={`absolute bottom-0 left-0 w-full h-1 bg-primary transform origin-left transition-transform duration-300 ${location === '/annunci' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </Link>
              {CATEGORIES.slice(0, 3).map(c => {
                const isActive = location.includes(`categoria=${encodeURIComponent(c.id)}`);
                return (
                  <Link key={c.id} href={`/annunci?categoria=${encodeURIComponent(c.id)}`} className="relative py-2 group outline-none">
                    <span className={`transition-colors ${isActive ? `text-[hsl(var(--cat-bg))]` : 'text-foreground/80 group-hover:text-foreground'}`}>
                      {c.name}
                    </span>
                    <span className={`absolute bottom-0 left-0 w-full h-1 transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} ${c.colorClass.replace('cat-', 'bg-')}`} style={{backgroundColor: `hsl(var(--cat-bg))`}} />
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-5">
            <Link href="/annunci">
              <Button variant="ghost" size="icon" className="text-foreground border-2 border-transparent hover:border-foreground hover:bg-muted/50 rounded-full w-12 h-12 transition-all">
                <Search className="h-6 w-6" strokeWidth={2.5} />
              </Button>
            </Link>
            <Link href="/pubblica">
              <Button className="h-12 gap-2 rounded-xl px-8 bg-accent hover:bg-accent/90 text-accent-foreground border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] hover:translate-y-[2px] hover:translate-x-[2px] transition-all font-black text-base uppercase tracking-wide bouncy-active">
                <PlusCircle className="h-5 w-5" strokeWidth={2.5} />
                Pubblica Annuncio
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-8 w-8" strokeWidth={2.5} /> : <Menu className="h-8 w-8" strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t-2 border-foreground p-6 space-y-6 bg-background shadow-xl absolute w-full left-0 animate-in slide-in-from-top-2">
          <Link href="/annunci" className="block text-xl font-black uppercase text-foreground/80 hover:text-primary" onClick={() => setIsOpen(false)}>
            Tutta la Bacheca
          </Link>
          <div className="grid grid-cols-1 gap-3">
            {CATEGORIES.map(c => (
              <Link key={c.id} href={`/annunci?categoria=${encodeURIComponent(c.id)}`} className="text-lg font-bold uppercase text-foreground p-4 bg-muted rounded-xl border-2 border-transparent hover:border-foreground flex items-center justify-between" onClick={() => setIsOpen(false)}>
                {c.name}
                <div className="w-4 h-4 rounded-full" style={{backgroundColor: `hsl(var(--cat-bg))`}} />
              </Link>
            ))}
          </div>
          <div className="pt-6">
            <Link href="/pubblica" onClick={() => setIsOpen(false)}>
              <Button className="w-full h-16 gap-3 rounded-xl bg-accent text-accent-foreground border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] active:shadow-[0_0_0_0_hsl(var(--foreground))] active:translate-y-[4px] active:translate-x-[4px] transition-all font-black text-xl uppercase tracking-wide">
                <PlusCircle className="h-6 w-6" strokeWidth={3} />
                Pubblica Annuncio
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
