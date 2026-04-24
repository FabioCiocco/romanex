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
import { ImagePlus, Tag, Edit3, Loader2, Home, Search, LogIn, ShieldCheck } from "lucide-react";
import { CATEGORIES, getCategoryConfig } from "@/lib/constants";
import { CategoryIcon } from "@/components/CategoryIcon";
import { useState } from "react";
import { useUser } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Lang } from "@/lib/i18n";

const formSchema = z.object({
  titolo: z.string().min(5).max(100),
  descrizione: z.string().min(20).max(2000),
  prezzo: z.coerce.number().min(0).nullable().optional(),
  categoria: z.string().min(1),
  citta: z.string().min(2),
  contatto: z.string().min(5),
  immagineUrl: z.string().url().nullable().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

function getLabels(cat: string, tipo: "cerco" | "offro", lang: Lang) {
  const s = (it: string, en: string, es: string) => (lang === "en" ? en : lang === "es" ? es : it);
  if (cat === "appartamenti") {
    if (tipo === "offro") return {
      title: s("Descrivi lo spazio (es. Stanza singola a Trastevere)", "Describe the space (e.g. Single room in Trastevere)", "Describe el espacio (ej. Habitación individual en Trastevere)"),
      desc: s("Racconta la casa: dimensioni, arredamento, spese incluse, coinquilini, regole...", "Describe the home: size, furnishing, bills, flatmates, rules...", "Describe el piso: tamaño, mobiliario, gastos, compañeros, normas..."),
      pricePlaceholder: s("Affitto mensile €", "Monthly rent €", "Alquiler mensual €"),
      priceLabel: s("Affitto mensile (€)", "Monthly rent (€)", "Alquiler mensual (€)"),
    };
    return {
      title: s("Cosa cerchi? (es. Stanza singola a Prati)", "What are you looking for? (e.g. Single room in Prati, Rome)", "¿Qué buscas? (ej. Habitación individual en Prati, Roma)"),
      desc: s("Zona preferita, budget, quando ti serve, quanti coinquilini...", "Preferred area, budget, when you need it, how many flatmates...", "Zona preferida, presupuesto, cuándo lo necesitas, compañeros..."),
      pricePlaceholder: s("Budget massimo €", "Maximum budget €", "Presupuesto máximo €"),
      priceLabel: s("Budget massimo (€)", "Maximum budget (€)", "Presupuesto máximo (€)"),
    };
  }
  if (cat === "libri") return {
    title: s("Titolo del libro e autore", "Book title and author", "Título del libro y autor"),
    desc: s("Edizione, condizioni, sottolineature, anno di acquisto...", "Edition, condition, annotations, year of purchase...", "Edición, estado, anotaciones, año de compra..."),
    pricePlaceholder: s("Prezzo richiesto €", "Asking price €", "Precio pedido €"),
    priceLabel: s("Prezzo richiesto (€)", "Asking price (€)", "Precio pedido (€)"),
  };
  if (cat === "ripetizioni") return {
    title: s("Materia e livello (es. Analisi 1 — Ingegneria)", "Subject and level (e.g. Calculus 1 — Engineering)", "Asignatura y nivel (ej. Cálculo 1 — Ingeniería)"),
    desc: s("Le tue competenze, metodo, disponibilità, dove ti trovi...", "Your skills, method, availability, location...", "Tus conocimientos, método, disponibilidad, dónde estás..."),
    pricePlaceholder: s("Tariffa oraria €", "Hourly rate €", "Tarifa por hora €"),
    priceLabel: s("Tariffa oraria (€)", "Hourly rate (€)", "Tarifa por hora (€)"),
  };
  if (cat === "consigli") return {
    title: s("L'argomento del tuo consiglio", "Topic of your advice", "Tema de tu consejo"),
    desc: s("Condividi la tua esperienza, tips per gli esami, vita fuori sede...", "Share your experience, exam tips, life away from home...", "Comparte tu experiencia, consejos para exámenes, vida fuera de casa..."),
    pricePlaceholder: "", priceLabel: "",
  };
  if (cat === "gruppi-studio") return {
    title: s("Cosa studiate? (es. Gruppo Analisi — Sapienza)", "What are you studying? (e.g. Calculus group — Sapienza)", "¿Qué estudian? (ej. Grupo Cálculo — Sapienza)"),
    desc: s("Quale esame, quando vi trovate, dove, quante persone cercate...", "Which exam, when and where you meet, how many people you need...", "Qué examen, cuándo y dónde os reunís, cuántas personas buscáis..."),
    pricePlaceholder: "", priceLabel: "",
  };
  return {
    title: s("Titolo dell'annuncio", "Listing title", "Título del anuncio"),
    desc: s("Descrizione dettagliata", "Detailed description", "Descripción detallada"),
    pricePlaceholder: s("Prezzo €", "Price €", "Precio €"),
    priceLabel: s("Prezzo (€)", "Price (€)", "Precio (€)"),
  };
}

export default function Pubblica() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isSignedIn, isLoaded } = useUser();
  const { t, lang } = useLanguage();
  const tc = t.common;

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
      titolo: "", descrizione: "", prezzo: null,
      categoria: (() => { const p = new URLSearchParams(searchString); return p.get("categoria") || ""; })(),
      citta: "Roma", contatto: "", immagineUrl: "",
    },
  });

  if (isLoaded && !isSignedIn) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-16">
          <div className="max-w-md w-full text-center">
            <div className="bg-foreground text-background w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 border-4 border-foreground shadow-[6px_6px_0_0_hsl(var(--primary))]">
              <ShieldCheck className="w-10 h-10" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-black font-display uppercase tracking-tighter mb-4">{tc.loginToPublish}</h1>
            <p className="text-foreground/60 font-medium text-lg mb-10 leading-relaxed">{tc.loginToPublishDesc}</p>
            <div className="flex flex-col gap-3">
              <Link href="/sign-up">
                <Button className="w-full h-14 gap-3 rounded-2xl bg-primary text-primary-foreground border-4 border-foreground shadow-[5px_5px_0_0_hsl(var(--foreground))] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] hover:translate-y-[3px] hover:translate-x-[3px] transition-all font-black text-lg uppercase tracking-wide">
                  {tc.createAccount}
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" className="w-full h-12 gap-2 rounded-2xl border-2 border-foreground font-black text-base uppercase tracking-wide hover:bg-muted">
                  <LogIn className="w-5 h-5" strokeWidth={2.5} />
                  {tc.iHaveAccountAlready}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const catConfig = getCategoryConfig(selectedCat);
  const showPrice = catConfig ? catConfig.hasPrice : true;
  const isAppartamenti = selectedCat === "appartamenti";
  const labels = getLabels(selectedCat, tipoAppartamento, lang);

  const s = (it: string, en: string, es: string) => (lang === "en" ? en : lang === "es" ? es : it);

  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      prezzo: showPrice ? data.prezzo : null,
      immagineUrl: data.immagineUrl === "" ? null : data.immagineUrl,
    };
    createAnnuncio.mutate({ data: payload }, {
      onSuccess: (newAnnuncio) => {
        queryClient.invalidateQueries({ queryKey: getListAnnunciQueryKey() });
        toast({ title: tc.publishedSuccess, description: tc.publishedSuccessDesc });
        setLocation(`/annunci/${newAnnuncio.id}`);
      },
      onError: () => {
        toast({ variant: "destructive", title: tc.publishError, description: tc.publishErrorDesc });
      },
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-4">
            {s("Crea un Post", "Create a Post", "Crear un anuncio")}
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            {s("Scrivi sulla bacheca di RomaNex. Gratis, sempre.", "Write on the RomaNex board. Always free.", "Escribe en el tablón de RomaNex. Siempre gratis.")}
          </p>
        </div>

        <Card className="border-border shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-muted/50 border-b pb-6 px-8 pt-8">
            <CardTitle className="text-2xl font-display flex items-center gap-3">
              <Edit3 className="w-6 h-6 text-primary" />
              {s("Cosa vuoi condividere?", "What do you want to share?", "¿Qué quieres compartir?")}
            </CardTitle>
            <CardDescription className="text-base font-medium">
              {s(
                "Scegli la sezione giusta in modo che i tuoi colleghi possano trovarti facilmente.",
                "Choose the right section so your classmates can find you easily.",
                "Elige la sección correcta para que tus compañeros puedan encontrarte fácilmente."
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Category */}
                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <FormField
                    control={form.control}
                    name="categoria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold text-foreground">
                          {s("Scegli la sezione *", "Choose the section *", "Elige la sección *")}
                        </FormLabel>
                        <Select
                          onValueChange={(val) => { field.onChange(val); setSelectedCat(val); }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-14 text-lg bg-background rounded-xl font-medium">
                              <SelectValue placeholder={s("In quale bacheca vuoi pubblicare?", "Which board do you want to post in?", "¿En qué sección quieres publicar?")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            {CATEGORIES.map((cat) => {
                              const catT = (t.categories as Record<string, { name: string }>)[cat.id];
                              return (
                                <SelectItem key={cat.id} value={cat.id} className="py-3 cursor-pointer">
                                  <div className="flex items-center gap-3 font-medium text-base">
                                    <cat.icon className="w-5 h-5 text-primary" />
                                    {catT?.name ?? cat.name}
                                  </div>
                                </SelectItem>
                              );
                            })}
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

                {/* Appartamenti toggle */}
                {isAppartamenti && (
                  <div className="p-6 bg-muted/40 rounded-2xl border border-border space-y-3">
                    <p className="text-base font-bold text-foreground">
                      {s("Stai cercando o hai qualcosa da affittare? *", "Are you looking or do you have something to rent? *", "¿Buscas o tienes algo para alquilar? *")}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setTipoAppartamento("cerco")}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 font-bold transition-all ${tipoAppartamento === "cerco" ? "border-primary bg-primary/10 text-primary shadow-[2px_2px_0_0_hsl(var(--primary))]" : "border-border bg-background text-foreground/70 hover:border-foreground/30"}`}
                      >
                        <Search className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                        <div className="text-left">
                          <div className="text-base">{s("Cerco casa", "Looking for housing", "Busco piso")}</div>
                          <div className="text-xs font-medium opacity-70">{s("Stai cercando dove vivere", "You're looking for a place to live", "Estás buscando dónde vivir")}</div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipoAppartamento("offro")}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 font-bold transition-all ${tipoAppartamento === "offro" ? "border-accent bg-accent/10 text-accent shadow-[2px_2px_0_0_hsl(var(--accent))]" : "border-border bg-background text-foreground/70 hover:border-foreground/30"}`}
                      >
                        <Home className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                        <div className="text-left">
                          <div className="text-base">{s("Affitto il mio spazio", "Renting my space", "Alquilo mi espacio")}</div>
                          <div className="text-xs font-medium opacity-70">{s("Hai una stanza o casa libera", "You have a free room or flat", "Tienes una habitación o piso libre")}</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Title + Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="titolo"
                    render={({ field }) => (
                      <FormItem className={showPrice ? "md:col-span-1" : "md:col-span-2"}>
                        <FormLabel className="text-base font-bold">{labels.title} *</FormLabel>
                        <FormControl>
                          <Input placeholder="..." className="h-14 text-lg rounded-xl bg-muted/50 border-border focus-visible:bg-background" {...field} />
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
                          <FormLabel className="text-base font-bold">{labels.priceLabel || tc.priceRange}</FormLabel>
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
                          <FormDescription className="font-medium">
                            {s('Lascia vuoto = "Da concordare"', 'Leave empty = "Negotiable"', 'Deja vacío = "A convenir"')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="descrizione"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold">{labels.desc} *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={s(
                            "Più dettagli fornisci, più sarà utile agli altri studenti...",
                            "The more details you give, the more useful it'll be for other students...",
                            "Cuantos más detalles das, más útil será para los demás estudiantes..."
                          )}
                          className="min-h-[160px] resize-y text-lg p-5 rounded-xl bg-muted/50 border-border focus-visible:bg-background leading-relaxed"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact */}
                <div className="pt-8 border-t border-border">
                  <FormField
                    control={form.control}
                    name="contatto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">{s("Contatto *", "Contact *", "Contacto *")}</FormLabel>
                        <FormControl>
                          <Input placeholder={s("Email o Telefono", "Email or Phone", "Email o Teléfono")} className="h-14 text-lg rounded-xl bg-muted/50 border-border focus-visible:bg-background" {...field} />
                        </FormControl>
                        <FormDescription className="font-medium">{s("Come possono scriverti?", "How can people reach you?", "¿Cómo pueden escribirte?")}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Image URL */}
                <div className="pt-2">
                  <FormField
                    control={form.control}
                    name="immagineUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">{s("Immagine (URL opzionale)", "Image (optional URL)", "Imagen (URL opcional)")}</FormLabel>
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
                      <><Loader2 className="mr-3 h-6 w-6 animate-spin" />{tc.publishing}</>
                    ) : tc.publishBtn}
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
