import { Link } from "wouter";
import { Store, PlusCircle, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "wouter";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <Store className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-bold text-primary">MercatoLocale</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/annunci" className={`transition-colors hover:text-primary ${location === '/annunci' ? 'text-primary' : 'text-foreground/80'}`}>
                Tutti gli annunci
              </Link>
              <Link href="/categorie" className={`transition-colors hover:text-primary ${location === '/categorie' ? 'text-primary' : 'text-foreground/80'}`}>
                Categorie
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/annunci">
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pubblica">
              <Button className="gap-2 rounded-full px-6 shadow-md hover:shadow-lg transition-all duration-300">
                <PlusCircle className="h-4 w-4" />
                Pubblica Annuncio
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-foreground/70 hover:text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background animate-in slide-in-from-top-2">
          <Link href="/annunci" className="block text-lg font-medium text-foreground/80 hover:text-primary" onClick={() => setIsOpen(false)}>
            Tutti gli annunci
          </Link>
          <Link href="/categorie" className="block text-lg font-medium text-foreground/80 hover:text-primary" onClick={() => setIsOpen(false)}>
            Categorie
          </Link>
          <div className="pt-4 border-t">
            <Link href="/pubblica" onClick={() => setIsOpen(false)}>
              <Button className="w-full gap-2 rounded-full">
                <PlusCircle className="h-4 w-4" />
                Pubblica Annuncio
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
