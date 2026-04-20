import { GraduationCap, Heart, BookOpen, Users, MapPin } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  const ft = t.footer;

  return (
    <footer className="bg-foreground text-background mt-auto overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-primary/20 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-accent/20 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 md:px-6 py-14 md:py-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div className="space-y-6 max-w-md">
            <Link href="/" className="flex items-center space-x-3 group outline-none w-max">
              <div className="bg-primary text-primary-foreground p-2.5 rounded-xl rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <GraduationCap className="h-8 w-8" strokeWidth={2.5} />
              </div>
              <span className="font-display text-3xl font-black text-background tracking-tighter uppercase">
                Roma<span className="text-accent">Nex</span>
              </span>
            </Link>
            <p className="text-background/70 text-base font-medium leading-relaxed">
              {ft.desc}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-background px-3 py-1.5 rounded-lg border border-background/20 bg-background/5">
                <BookOpen className="h-3.5 w-3.5" strokeWidth={2.5} /> {ft.study}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-background px-3 py-1.5 rounded-lg border border-background/20 bg-background/5">
                <Users className="h-3.5 w-3.5" strokeWidth={2.5} /> {ft.community}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-background px-3 py-1.5 rounded-lg border border-background/20 bg-background/5">
                <MapPin className="h-3.5 w-3.5" strokeWidth={2.5} /> {ft.campus}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-background/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-background/50 font-bold uppercase tracking-wider">
          <p>© {new Date().getFullYear()} RomaNex. {ft.rights}</p>
          <p className="flex items-center gap-2">
            {ft.madeWith} <Heart className="h-4 w-4 text-accent fill-accent animate-pulse" /> {ft.inItaly}
          </p>
        </div>
      </div>
    </footer>
  );
}
