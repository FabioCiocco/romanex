import { Layout } from "@/components/layout/Layout";
import { useCreateAnnuncio, useListCategorie, getListAnnunciQueryKey } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useSearch, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, MapPin, Tag, Edit3, Loader2, Home, BookOpen, Search, LogIn, ShieldCheck } from "lucide-react";
import { CATEGORIES, getCategoryConfig } from "@/lib/constants";
import { CategoryIcon } from "@/components/CategoryIcon";
import { useState, useMemo } from "react";
import { useUser } from "@clerk/react";

const formSchema = z.object({
  titolo: z.string().min(5, "Il titolo deve avere almeno 5 caratteri").max(100, "Il titolo non può superare i 100 caratteri"),
  descrizione: z.string().min(20, "La descrizione deve avere almeno 20 caratteri").max(2000, "La descrizione è troppo lunga"),
  prezzo: z.coerce.number().min(0, "Il prezzo non può essere negativo").nullable().optional(),
  categoria: z.string().min(1, "Seleziona una categoria"),
  citta: z.string().min(2, "Inserisci la tua città o polo universitario"),
  contatto: z.string().min(5, "Inserisci un contatto valido (email universitaria o cellulare)"),
  immagineUrl: z.string().url("Inserisci un URL immagine valido").nullable().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export default function Pubblica() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isSignedIn, isLoaded } = useUser();
  const [selectedCat, setSelectedCat] = useState<string>(() => {
    const params = new URLSearchParams(searchString);
    return params.get("categoria") || "";
  });
  const [tipoAppartamento, setTipoAppartamento] = useState<"cerco" | "offro">("cerco");

  const { data: dbCategorie } = useListCategorie();
  const createAnnuncio = useCreateAnnuncio();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titolo: "",
      descrizione: "",
      prezzo: null,
      categoria: (() => {
        const params = new URLSearchParams(searchString);
        return params.get("categoria") || "";
      })(),
      citta: "",
      contatto: "",
      immagineUrl: "",
    },
  });

  const catConfig = getCategoryConfig(selectedCat);
  const showPrice = catConfig ? catConfig.hasPrice : true;
  const isAppartamenti = selectedCat === "appartamenti";

  if (isLoaded && !isSignedIn) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-16">
          <div className="max-w-md w-full text-center">
            <div className="bg-foreground text-background w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 border-4 border-foreground shadow-[6px_6px_0_0_hsl(var(--primary))]">
              <ShieldCheck className="w-10 h-10" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-black font-display uppercase tracking-tighter mb-4">
              Accedi per <span className="text-primary">Pubblicare</span>
            </h1>
            <p className="text-foreground/60 font-medium text-lg mb-10 leading-relaxed">
              Devi avere un account per pubblicare annunci su RomaNex. È gratis e richiede meno di un minuto.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/sign-up">
                <Button className="w-full h-14 gap-3 rounded-2xl bg-primary text-primary-foreground border-4 border-foreground shadow-[5px_5px_0_0_hsl(var(--foreground))] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] hover:translate-y-[3px] hover:translate-x-[3px] transition-all font-black text-lg uppercase tracking-wide">
                  Crea account gratis
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" className="w-full h-12 gap-2 rounded-2xl border-2 border-foreground font-black text-base uppercase tracking-wide hover:bg-muted">
                  <LogIn className="w-5 h-5" strokeWidth={2.5} />
                  Ho già un account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const getCustomLabels = () => {
    if (selectedCat === "appartamenti") {
      if (tipoAppartamento === "offro") {
        return {
          title: "Descrivi lo spazio (es. Stanza singola in Bovisa, 10 min dal Politecnico)",
          desc: "Racconta la casa: dimensioni, arredamento, spese incluse, chi sono i coinquilini, regole...",
          pricePlaceholder: "Affitto mensile €",
          priceLabel: "Affitto mensile (€)"
        };
      }
      return {
        title: "Cosa cerchi? (es. Stanza singola a Milano vicino Statale)",
        desc: "Zona preferita, budget, quando ti serve, quanti coinquilini preferisci...",
        pricePlaceholder: "Budget massimo €",
        priceLabel: "Budget massimo (€)"
      };
    }
    if (selectedCat === "libri") {
      return {
        title: "Titolo del libro e autore",
        desc: "Edizione, condizioni, sottolineature presenti, anno di acquisto...",
        pricePlaceholder: "Prezzo richiesto €",
        priceLabel: "Prezzo richiesto (€)"
      };
    }
    if (selectedCat === "ripetizioni") {
      return {
        title: "Materia e livello (es. Analisi Matematica 1 — Ingegneria)",
        desc: "Le tue competenze, metodo, disponibilità oraria, dove ti trovi...",
        pricePlaceholder: "Tariffa oraria €",
        priceLabel: "Tariffa oraria (€)"
      };
    }
    if (selectedCat === "consigli") {
      return {
        title: "L'argomento del tuo consiglio",
        desc: "Condividi la tua esperienza, tips per gli esami, la vita fuori sede...",
        pricePlaceholder: "",
        priceLabel: ""
      };
    }
    if (selectedCat === "gruppi-studio") {
      return {
        title: "Cosa studiate? (es. Gruppo Analisi — Politecnico Milano)",
        desc: "Quale esame, quando vi trovate, dove, quante persone cercate...",
        pricePlaceholder: "",
        priceLabel: ""
      };
    }
    return {
      title: "Titolo dell'annuncio",
      desc: "Descrizione dettagliata",
      pricePlaceholder: "Prezzo €",
      priceLabel: "Prezzo (€)"
    };
  };

  const labels = getCustomLabels();

  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      prezzo: showPrice ? data.prezzo : null,
      immagineUrl: data.immagineUrl === "" ? null : data.immagineUrl
    };

    createAnnuncio.mutate({ data: payload }, {
      onSuccess: (newAnnuncio) => {
        queryClient.invalidateQueries({ queryKey: getListAnnunciQueryKey() });
        toast({
          title: "Post pubblicato!",
          description: "Visibile da subito in bacheca.",
        });
        setLocation(`/annunci/${newAnnuncio.id}`);
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Errore",
          description: "Si è verificato un errore durante la pubblicazione. Riprova.",
        });
      }
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-4">Crea un Post</h1>
          <p className="text-xl text-muted-foreground font-medium">
            Scrivi sulla bacheca di RomaNex. Gratis, sempre.
          </p>
        </div>

        <Card className="border-border shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-muted/50 border-b pb-6 px-8 pt-8">
            <CardTitle className="text-2xl font-display flex items-center gap-3">
              <Edit3 className="w-6 h-6 text-primary" />
              Cosa vuoi condividere?
            </CardTitle>
            <CardDescription className="text-base font-medium">
              Scegli la sezione giusta in modo che i tuoi colleghi possano trovarti facilmente.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Category Selection */}
                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <FormField
                    control={form.control}
                    name="categoria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-foreground">Scegli la sezione *</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            setSelectedCat(val);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-14 text-lg bg-background rounded-xl font-medium">
                              <SelectValue placeholder="In quale bacheca vuoi pubblicare?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id} className="py-3 cursor-pointer">
                                <div className="flex items-center gap-3 font-medium text-base">
                                  <cat.icon className="w-5 h-5 text-primary" />
                                  {cat.name}
                                </div>
                              </SelectItem>
                            ))}
                            {dbCategorie?.filter(dbCat => !CATEGORIES.find(c => c.id === dbCat.id)).map(cat => (
                              <SelectItem key={cat.id} value={cat.id} className="py-3 cursor-pointer">
                                <div className="flex items-center gap-3 font-medium text-base">
                                  <CategoryIcon name={cat.nome} className="w-5 h-5 text-muted-foreground" />
                                  {cat.nome}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Appartamenti: Cerco / Offro toggle */}
                {isAppartamenti && (
                  <div className="p-6 bg-muted/40 rounded-2xl border border-border space-y-3">
                    <p className="text-base font-bold text-foreground">Stai cercando o hai qualcosa da affittare? *</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setTipoAppartamento("cerco")}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 font-bold transition-all ${
                          tipoAppartamento === "cerco"
                            ? "border-primary bg-primary/10 text-primary shadow-[2px_2px_0_0_hsl(var(--primary))]"
                            : "border-border bg-background text-foreground/70 hover:border-foreground/30"
                        }`}
                      >
                        <Search className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                        <div className="text-left">
                          <div className="text-base">Cerco casa</div>
                          <div className="text-xs font-medium opacity-70">Stai cercando dove vivere</div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipoAppartamento("offro")}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 font-bold transition-all ${
                          tipoAppartamento === "offro"
                            ? "border-accent bg-accent/10 text-accent shadow-[2px_2px_0_0_hsl(var(--accent))]"
                            : "border-border bg-background text-foreground/70 hover:border-foreground/30"
                        }`}
                      >
                        <Home className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                        <div className="text-left">
                          <div className="text-base">Affitto il mio spazio</div>
                          <div className="text-xs font-medium opacity-70">Hai una stanza o casa libera</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="titolo"
                    render={({ field }) => (
                      <FormItem className={showPrice ? "md:col-span-1" : "md:col-span-2"}>
                        <FormLabel className="text-base font-bold">{labels.title} *</FormLabel>
                        <FormControl>
                          <Input placeholder="Scrivi qui..." className="h-14 text-lg rounded-xl bg-muted/50 border-border focus-visible:bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {showPrice && (
                    <FormField
                      control={form.control}
                      name="prezzo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-bold">{labels.priceLabel || "Prezzo (€)"}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                              <Input
                                type="number"
                                placeholder={labels.pricePlaceholder || "0.00"}
                                className="pl-12 h-14 text-lg rounded-xl bg-muted/50 border-border focus-visible:bg-background font-medium"
                                {...field}
                                value={field.value === null ? '' : field.value}
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="font-medium">Lascia vuoto = "Da concordare"</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="descrizione"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold">{labels.desc} *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Più dettagli fornisci, più sarà utile agli altri studenti..."
                          className="min-h-[160px] resize-y text-lg p-5 rounded-xl bg-muted/50 border-border focus-visible:bg-background leading-relaxed"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
                  <FormField
                    control={form.control}
                    name="citta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">Città / Polo *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input placeholder="Es. Milano Bovisa" className="pl-12 h-14 text-lg rounded-xl bg-muted/50 border-border focus-visible:bg-background" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contatto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">Contatto *</FormLabel>
                        <FormControl>
                          <Input placeholder="Email o Telefono" className="h-14 text-lg rounded-xl bg-muted/50 border-border focus-visible:bg-background" {...field} />
                        </FormControl>
                        <FormDescription className="font-medium">Come possono scriverti?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-2">
                  <FormField
                    control={form.control}
                    name="immagineUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">Immagine (URL opzionale)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <ImagePlus className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input
                              placeholder="https://..."
                              className="pl-12 h-14 text-lg rounded-xl bg-muted/50 border-border focus-visible:bg-background"
                              {...field}
                              value={field.value || ''}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-10 flex justify-end">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full md:w-auto h-16 px-12 text-lg font-bold rounded-2xl shadow-xl hover:-translate-y-1 transition-transform"
                    disabled={createAnnuncio.isPending}
                  >
                    {createAnnuncio.isPending ? (
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                        Pubblicazione...
                      </>
                    ) : (
                      "Appendi in Bacheca"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
