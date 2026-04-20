import { Link, useLocation } from "wouter";
import { PlusCircle, Menu, X, GraduationCap, LogIn, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import { useUser, useClerk, Show } from "@clerk/react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  return (
    <header className="sticky top-0 z-50 w-full border-b-[3px] border-foreground bg-background/95 backdrop-blur shadow-[0_4px_0_0_hsl(var(--foreground))]">

      {/* Main bar */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-2.5 group outline-none shrink-0">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-xl rotate-3 group-hover:rotate-0 transition-transform duration-300 border-2 border-foreground shadow-[2px_2px_0_0_hsl(var(--foreground))]">
              <GraduationCap className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <span className="font-display text-2xl font-black text-foreground tracking-tighter uppercase">
              Roma<span className="text-accent">Nex</span>
            </span>
          </Link>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <Show when="signed-out">
              <Link href="/sign-in">
                <Button variant="ghost" className="h-10 gap-2 rounded-xl px-5 border-2 border-foreground hover:bg-muted font-black text-sm uppercase tracking-wide transition-all">
                  <LogIn className="h-4 w-4" strokeWidth={2.5} />
                  Accedi
                </Button>
              </Link>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-foreground bg-muted/50">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt={user.firstName || "User"} className="w-7 h-7 rounded-full border border-foreground object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center border border-foreground">
                      <User className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                  )}
                  <span className="font-black text-sm text-foreground max-w-[100px] truncate">
                    {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0]}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-xl border-2 border-foreground hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-all"
                  onClick={() => signOut()}
                  title="Esci"
                >
                  <LogOut className="h-4 w-4" strokeWidth={2.5} />
                </Button>
              </div>
            </Show>

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
              className={`flex items-center gap-1.5 px-4 h-7 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${location === '/annunci' ? 'bg-foreground text-background' : 'text-foreground/50 hover:text-foreground hover:bg-muted'}`}
            >
              Tutti
            </Link>
            {CATEGORIES.map(c => {
              const isActive = location === `/${c.id}` || location.startsWith(`/${c.id}?`);
              return (
                <Link
                  key={c.id}
                  href={`/${c.id}`}
                  className={`${c.colorClass} flex items-center gap-1.5 px-3.5 h-7 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap border ${isActive ? 'text-white border-transparent' : 'text-foreground/60 hover:text-foreground border-transparent hover:bg-muted'}`}
                  style={isActive ? { backgroundColor: `hsl(var(--cat-bg))` } : {}}
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 transition-colors ${isActive ? 'bg-white/70' : ''}`}
                    style={!isActive ? { backgroundColor: `hsl(var(--cat-bg))` } : {}}
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

          <Show when="signed-in">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted border-2 border-foreground">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt={user.firstName || "User"} className="w-10 h-10 rounded-full border-2 border-foreground object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-foreground">
                  <User className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              )}
              <div>
                <p className="font-black text-sm uppercase tracking-wide">{user?.firstName || "Utente"}</p>
                <p className="text-xs text-foreground/50 font-medium truncate">{user?.emailAddresses?.[0]?.emailAddress}</p>
              </div>
            </div>
          </Show>

          <Link href="/annunci" className="block text-base font-black uppercase text-foreground/60 hover:text-primary" onClick={() => setIsOpen(false)}>
            Tutta la bacheca
          </Link>
          <div className="grid grid-cols-1 gap-2">
            {CATEGORIES.map(c => {
              const Icon = c.icon;
              return (
                <Link key={c.id} href={`/${c.id}`}
                  className={`flex items-center gap-3 text-sm font-black uppercase text-white p-3.5 rounded-2xl border-2 border-white/20 ${c.colorClass}`}
                  style={{ backgroundColor: `hsl(var(--cat-bg))` }}
                  onClick={() => setIsOpen(false)}>
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                  {c.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Link href="/pubblica" onClick={() => setIsOpen(false)}>
              <Button className="w-full h-13 gap-3 rounded-xl bg-accent text-accent-foreground border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all font-black text-base uppercase tracking-wide">
                <PlusCircle className="h-5 w-5" strokeWidth={3} />
                Pubblica Annuncio
              </Button>
            </Link>
            <Show when="signed-out">
              <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full h-11 gap-2 rounded-xl border-2 border-foreground font-black text-base uppercase tracking-wide">
                  <LogIn className="h-4 w-4" strokeWidth={2.5} />
                  Accedi / Registrati
                </Button>
              </Link>
            </Show>
            <Show when="signed-in">
              <Button variant="ghost" className="w-full h-11 gap-2 rounded-xl border-2 border-foreground font-black text-sm uppercase tracking-wide text-destructive hover:bg-destructive/10"
                onClick={() => { signOut(); setIsOpen(false); }}>
                <LogOut className="h-4 w-4" strokeWidth={2.5} />
                Esci
              </Button>
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}
