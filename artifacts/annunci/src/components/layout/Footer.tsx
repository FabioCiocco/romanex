import { Store, Heart, Shield, Zap } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <Store className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-bold text-primary">MercatoLocale</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Il marketplace italiano per le persone vere. Compra, vendi e scopri occasioni uniche nella tua città. Un luogo vivace dove le storie incontrano nuovi proprietari.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="h-4 w-4" /> Sicuro
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Zap className="h-4 w-4" /> Veloce
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Heart className="h-4 w-4" /> Locale
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Esplora</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/annunci" className="hover:text-primary transition-colors">Tutti gli annunci</Link></li>
              <li><Link href="/categorie" className="hover:text-primary transition-colors">Categorie</Link></li>
              <li><Link href="/annunci?q=auto" className="hover:text-primary transition-colors">Motori</Link></li>
              <li><Link href="/annunci?q=casa" className="hover:text-primary transition-colors">Immobili</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Inizia</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/pubblica" className="hover:text-primary transition-colors">Vendi un oggetto</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Centro assistenza</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Regole del sito</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy & Termini</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} MercatoLocale. Tutti i diritti riservati.</p>
          <p className="flex items-center gap-1">Fatto con <Heart className="h-3 w-3 text-red-500" /> in Italia</p>
        </div>
      </div>
    </footer>
  );
}
