import { useState, useEffect } from "react";
import { useUser } from "@clerk/react";
import { useLocation } from "wouter";
import { useUpsertMyProfile } from "@workspace/api-client-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { GraduationCap, Phone, BookOpen, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const ANNI_OPTIONS_FALLBACK = [
  "1° Anno", "2° Anno", "3° Anno", "4° Anno", "5° Anno",
  "Magistrale 1°", "Magistrale 2°", "Dottorato", "Fuori corso",
];

export default function CompletaProfilo() {
  const { t } = useLanguage();
  const tp = t.profilo;
  const { user, isLoaded } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [universita, setUniversita] = useState("");
  const [annoCorso, setAnnoCorso] = useState("");
  const [corsoDiLaurea, setCorsoDiLaurea] = useState("");
  const [telefono, setTelefono] = useState("");

  useEffect(() => {
    if (user && isLoaded) {
      setNome(user.firstName || "");
      setCognome(user.lastName || "");
      setEmail(user.primaryEmailAddress?.emailAddress || "");
    }
  }, [user, isLoaded]);

  const mutation = useUpsertMyProfile({
    mutation: {
      onSuccess: () => {
        toast({ title: tp.savedOk, description: tp.savedOkDesc });
        setLocation("/");
      },
      onError: () => {
        toast({ title: tp.saveError, variant: "destructive" });
      },
    },
  });

  if (!isLoaded || !user) {
    return null;
  }

  const anni: string[] = Array.isArray(tp.anni) ? [...tp.anni] : ANNI_OPTIONS_FALLBACK;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      data: { nome, cognome, email, universita, annoCorso, corsoDiLaurea, telefono: telefono || undefined },
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border-2 border-primary text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            RomaNex
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-3">
            {tp.completeTitle}
          </h1>
          <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto">
            {tp.completeSub}
          </p>
        </div>

        <div className="border-4 border-foreground shadow-[8px_8px_0_0_hsl(var(--foreground))] bg-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  {tp.nome} <span className="text-destructive">*</span>
                </label>
                <input
                  className="w-full border-2 border-foreground rounded-xl px-3 py-2.5 text-sm font-medium bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  {tp.cognome} <span className="text-destructive">*</span>
                </label>
                <input
                  className="w-full border-2 border-foreground rounded-xl px-3 py-2.5 text-sm font-medium bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={cognome}
                  onChange={e => setCognome(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                <GraduationCap className="w-3 h-3" /> {tp.universita} <span className="text-destructive">*</span>
              </label>
              <input
                className="w-full border-2 border-foreground rounded-xl px-3 py-2.5 text-sm font-medium bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={tp.universitaPlaceholder}
                value={universita}
                onChange={e => setUniversita(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1">
                  {tp.annoCorso} <span className="text-destructive">*</span>
                </label>
                <select
                  className="w-full border-2 border-foreground rounded-xl px-3 py-2.5 text-sm font-medium bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  value={annoCorso}
                  onChange={e => setAnnoCorso(e.target.value)}
                  required
                >
                  <option value="">—</option>
                  {anni.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> {tp.corsoDiLaurea} <span className="text-destructive">*</span>
                </label>
                <input
                  className="w-full border-2 border-foreground rounded-xl px-3 py-2.5 text-sm font-medium bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={tp.corsoDiLaureaPh}
                  value={corsoDiLaurea}
                  onChange={e => setCorsoDiLaurea(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" /> {tp.telefono}
              </label>
              <input
                className="w-full border-2 border-foreground rounded-xl px-3 py-2.5 text-sm font-medium bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={tp.telefonoPh}
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">{tp.telefonoHint}</p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={mutation.isPending}
                className={cn(
                  "w-full border-4 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] font-black uppercase tracking-wider py-3 text-base transition-all flex items-center justify-center gap-2",
                  "hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px]",
                  "bg-primary text-primary-foreground",
                  mutation.isPending && "opacity-70 cursor-not-allowed",
                )}
              >
                {mutation.isPending ? (
                  tp.saving
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    {tp.saveBtn}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setLocation("/")}
                className="w-full text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1 py-2"
              >
                {tp.skipForNow} <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
