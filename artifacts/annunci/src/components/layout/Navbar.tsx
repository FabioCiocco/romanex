import { Link, useLocation } from "wouter";
import { PlusCircle, Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b-[3px] border-foreground bg-background/95 backdrop-blur shadow-[0_4px_0_0_hsl(var(--foreground))]">

      {/* Main bar */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="flex items-center space-x-2.5 group outline-none shrink-0">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-xl rotate-3 group-hover:rotate-0 transition-transform duration-300 border-2 border-foreground shadow-[2px_2px_0_0_hsl(var(--foreground))]">
              <GraduationCap className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <span className="font-display text-2xl font-black text-foreground tracking-tighter uppercase">
              Roma<span className="text-accent">Nex</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-3 ml-auto">
            <Link href="/pubblica">
              <Button className="h-10 gap-2 rounded-xl px-6 bg-accent hover:bg-accent/90 text-accent-foreground border-2 border-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))] hover:shadow-[1px_1px_0_0_hsl(var(--foreground))] hover:translate-y-[2px] hover:translate-x-[2px] transition-all font-black text-sm uppercase tracking-wide">
                <PlusCircle className="h-4 w-4" strokeWidth={2.5} />
                Pubblica
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-7 w-7" strokeWidth={2.5} /> : <Menu className="h-7 w-7" strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* Category strip */}
      <div className="border-t border-foreground/10 overflow-x-auto scrollbar-none">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-1 h-11 w-max md:w-auto min-w-full">
            <Link
              href="/annunci"
              className={`flex items-center gap-1.5 px-4 h-7 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${location === '/annunci' && !location.includes('categoria') ? 'bg-foreground text-background' : 'text-foreground/50 hover:text-foreground hover:bg-muted'}`}
            >
              Tutti
            </Link>
            {CATEGORIES.map(c => {
              const isActive = location.includes(`categoria=${encodeURIComponent(c.id)}`);
              const Icon = c.icon;
              return (
                <Link
                  key={c.id}
                  href={`/annunci?categoria=${encodeURIComponent(c.id)}`}
                  className={`flex items-center gap-1.5 px-3.5 h-7 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap border ${isActive ? 'text-white border-transparent' : 'text-foreground/60 hover:text-foreground border-transparent hover:bg-muted'}`}
                  style={isActive ? {backgroundColor: `hsl(var(--cat-bg))`} : {}}
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 transition-colors ${isActive ? 'bg-white/70' : ''}`}
                    style={!isActive ? {backgroundColor: `hsl(var(--cat-bg))`} : {}}
                  />
                  {c.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t-2 border-foreground p-5 space-y-4 bg-background shadow-xl absolute w-full left-0 animate-in slide-in-from-top-2">
          <Link href="/annunci" className="block text-base font-black uppercase text-foreground/60 hover:text-primary" onClick={() => setIsOpen(false)}>
            Tutta la bacheca
          </Link>
          <div className="grid grid-cols-1 gap-2">
            {CATEGORIES.map(c => {
              const Icon = c.icon;
              return (
                <Link key={c.id} href={`/annunci?categoria=${encodeURIComponent(c.id)}`}
                  className={`flex items-center gap-3 text-sm font-black uppercase text-white p-3.5 rounded-2xl border-2 border-white/20 ${c.colorClass}`}
                  style={{backgroundColor: `hsl(var(--cat-bg))`}}
                  onClick={() => setIsOpen(false)}>
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                  {c.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-2">
            <Link href="/pubblica" onClick={() => setIsOpen(false)}>
              <Button className="w-full h-13 gap-3 rounded-xl bg-accent text-accent-foreground border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all font-black text-base uppercase tracking-wide">
                <PlusCircle className="h-5 w-5" strokeWidth={3} />
                Pubblica Annuncio
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
