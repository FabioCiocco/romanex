import { Link, useLocation } from "wouter";
import { PlusCircle, Menu, X, LogIn, LogOut, User, MessageCircle, ChevronDown, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { CATEGORIES } from "@/lib/constants";
import { useUser, useClerk, Show } from "@clerk/react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

function CategorieDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-black uppercase tracking-wide text-foreground/70 hover:text-foreground hover:bg-muted transition-all border-2 border-transparent hover:border-foreground/20"
      >
        <LayoutGrid className="w-4 h-4" strokeWidth={2.5} />
        {t.footer.explore}
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} strokeWidth={3} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 bg-background border-2 border-foreground rounded-2xl shadow-[4px_4px_0_0_hsl(var(--foreground))] overflow-hidden z-50 min-w-[220px]">
          <div className="p-2 space-y-0.5">
            {CATEGORIES.map(c => {
              const catT = (t.categories as Record<string, { name: string }>)[c.id];
              const Icon = c.icon;
              return (
                <Link
                  key={c.id}
                  href={`/${c.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-black uppercase tracking-wide text-foreground hover:bg-muted transition-colors"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `hsl(var(--cat-bg))`, color: `hsl(var(--cat-fg))` }}
                  >
                    <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </div>
                  {catT?.name ?? c.name}
                </Link>
              );
            })}
          </div>
          <div className="border-t-2 border-foreground/10 p-2">
            <Link
              href="/annunci"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-foreground/50 hover:text-foreground hover:bg-muted transition-colors"
            >
              {t.footer.allCategories} →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b-[3px] border-foreground bg-background/95 backdrop-blur shadow-[0_4px_0_0_hsl(var(--foreground))]">

      {/* Main bar */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center outline-none shrink-0">
            <div className="bg-white rounded-xl border-2 border-foreground shadow-[2px_2px_0_0_hsl(var(--foreground))] px-2 py-1">
              <img
                src="/logo-romanex.jpg"
                alt="RomaNex"
                className="h-9 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 ml-4">
            <CategorieDropdown />
            <Link
              href="/forum"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-black uppercase tracking-wide text-foreground/70 hover:text-foreground hover:bg-muted transition-all border-2 border-transparent hover:border-foreground/20"
            >
              <MessageCircle className="w-4 h-4" strokeWidth={2.5} />
              {t.nav.forum}
            </Link>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <LanguageSwitcher />

            <Show when="signed-out">
              <Link href="/sign-in">
                <Button variant="ghost" className="h-10 gap-2 rounded-xl px-5 border-2 border-foreground hover:bg-muted font-black text-sm uppercase tracking-wide transition-all">
                  <LogIn className="h-4 w-4" strokeWidth={2.5} />
                  {t.nav.signIn}
                </Button>
              </Link>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-2">
                <Link href="/profilo">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-foreground bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
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
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-xl border-2 border-foreground hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-all"
                  onClick={() => signOut()}
                  title={t.nav.signOut}
                >
                  <LogOut className="h-4 w-4" strokeWidth={2.5} />
                </Button>
              </div>
            </Show>

          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-7 w-7" strokeWidth={2.5} /> : <Menu className="h-7 w-7" strokeWidth={2.5} />}
          </button>
        </div>
      </div>


      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t-2 border-foreground p-5 space-y-4 bg-background shadow-xl absolute w-full left-0 animate-in slide-in-from-top-2 overflow-y-auto max-h-[80dvh]">

          <Show when="signed-in">
            <Link href="/profilo" onClick={() => setIsOpen(false)}>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted border-2 border-foreground hover:bg-muted/80 transition-colors">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt={user.firstName || "User"} className="w-10 h-10 rounded-full border-2 border-foreground object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-foreground">
                    <User className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                )}
                <div>
                  <p className="font-black text-sm uppercase tracking-wide">{user?.firstName || t.nav.user}</p>
                  <p className="text-xs text-foreground/50 font-medium truncate">{user?.emailAddresses?.[0]?.emailAddress}</p>
                </div>
              </div>
            </Link>
          </Show>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/annunci" className="block text-base font-black uppercase text-foreground/60 hover:text-primary" onClick={() => setIsOpen(false)}>
                {t.nav.allBoard}
              </Link>
              <Link href="/forum" className="flex items-center gap-1.5 text-base font-black uppercase text-accent hover:text-accent/80" onClick={() => setIsOpen(false)}>
                <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
                {t.nav.forum}
              </Link>
            </div>
            <LanguageSwitcher />
          </div>

          <div className="grid grid-cols-1 gap-2">
            {CATEGORIES.map(c => {
              const catT = (t.categories as Record<string, { name: string; description: string }>)[c.id];
              const Icon = c.icon;
              return (
                <Link key={c.id} href={`/${c.id}`}
                  className={`flex items-center gap-3 text-sm font-black uppercase text-white p-3.5 rounded-2xl border-2 border-white/20 ${c.colorClass}`}
                  style={{ backgroundColor: `hsl(var(--cat-bg))` }}
                  onClick={() => setIsOpen(false)}>
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                  {catT?.name ?? c.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Link href="/pubblica" onClick={() => setIsOpen(false)}>
              <Button className="w-full h-13 gap-3 rounded-xl bg-accent text-accent-foreground border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] active:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all font-black text-base uppercase tracking-wide">
                <PlusCircle className="h-5 w-5" strokeWidth={3} />
                {t.nav.publish}
              </Button>
            </Link>
            <Show when="signed-out">
              <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full h-11 gap-2 rounded-xl border-2 border-foreground font-black text-base uppercase tracking-wide">
                  <LogIn className="h-4 w-4" strokeWidth={2.5} />
                  {t.nav.signIn}
                </Button>
              </Link>
            </Show>
            <Show when="signed-in">
              <Button variant="ghost" className="w-full h-11 gap-2 rounded-xl border-2 border-foreground font-black text-sm uppercase tracking-wide text-destructive hover:bg-destructive/10"
                onClick={() => { signOut(); setIsOpen(false); }}>
                <LogOut className="h-4 w-4" strokeWidth={2.5} />
                {t.nav.signOut}
              </Button>
            </Show>
          </div>
        </div>
      )}
    </header>
  );
}
