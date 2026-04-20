import { GraduationCap, Heart, BookOpen, Users, MapPin, Search } from "lucide-react";
import { Link } from "wouter";
import { CATEGORIES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-primary text-primary-foreground p-1 rounded-md">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                Campus<span className="text-primary">Board</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
              La bacheca digitale per gli studenti universitari italiani. 
              Trova coinquilini, vendi libri, offri ripetizioni o semplicemente chiedi un consiglio. 
              Fatto da studenti, per studenti.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground px-2.5 py-1 rounded-full bg-muted">
                <BookOpen className="h-3.5 w-3.5" /> Studio
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground px-2.5 py-1 rounded-full bg-muted">
                <Users className="h-3.5 w-3.5" /> Community
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground px-2.5 py-1 rounded-full bg-muted">
                <MapPin className="h-3.5 w-3.5" /> Campus
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground font-display tracking-tight">Esplora</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {CATEGORIES.map(c => (
                <li key={c.id}>
                  <Link href={`/annunci?categoria=${encodeURIComponent(c.name)}`} className="hover:text-primary transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
              <li><Link href="/categorie" className="hover:text-primary transition-colors font-medium">Tutte le categorie</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground font-display tracking-tight">Link Utili</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/pubblica" className="hover:text-primary transition-colors text-primary font-medium">Pubblica Annuncio</Link></li>
              <li><Link href="/annunci" className="hover:text-primary transition-colors flex items-center gap-1">
                <Search className="w-3 h-3" /> Cerca
              </Link></li>
              <li><span className="cursor-not-allowed opacity-50">Linee Guida</span></li>
              <li><span className="cursor-not-allowed opacity-50">Privacy Policy</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-medium">
          <p>© {new Date().getFullYear()} CampusBoard. Tutti i diritti riservati.</p>
          <p className="flex items-center gap-1">Fatto con <Heart className="h-3.5 w-3.5 text-destructive fill-destructive" /> in Italia</p>
        </div>
      </div>
    </footer>
  );
}
