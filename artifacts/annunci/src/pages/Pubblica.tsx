import { Layout } from "@/components/layout/Layout";
import { useCreateAnnuncio, useListCategorie, getListAnnunciQueryKey } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, MapPin, Tag, Type, Loader2 } from "lucide-react";

const formSchema = z.object({
  titolo: z.string().min(5, "Il titolo deve avere almeno 5 caratteri").max(100, "Il titolo non può superare i 100 caratteri"),
  descrizione: z.string().min(20, "La descrizione deve avere almeno 20 caratteri").max(2000, "La descrizione è troppo lunga"),
  prezzo: z.coerce.number().min(0, "Il prezzo non può essere negativo").nullable().optional(),
  categoria: z.string().min(1, "Seleziona una categoria"),
  citta: z.string().min(2, "Inserisci una città valida"),
  contatto: z.string().min(5, "Inserisci un contatto valido (es. numero di telefono o email)"),
  immagineUrl: z.string().url("Inserisci un URL immagine valido").nullable().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export default function Pubblica() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: categorie } = useListCategorie();
  const createAnnuncio = useCreateAnnuncio();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titolo: "",
      descrizione: "",
      prezzo: null,
      categoria: "",
      citta: "",
      contatto: "",
      immagineUrl: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    // Convert empty string to null for immagineUrl
    const payload = {
      ...data,
      immagineUrl: data.immagineUrl === "" ? null : data.immagineUrl
    };

    createAnnuncio.mutate({ data: payload }, {
      onSuccess: (newAnnuncio) => {
        queryClient.invalidateQueries({ queryKey: getListAnnunciQueryKey() });
        toast({
          title: "Annuncio pubblicato!",
          description: "Il tuo annuncio è ora visibile a tutti.",
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Pubblica un annuncio</h1>
          <p className="text-xl text-muted-foreground">
            Compila il modulo per mettere in vendita il tuo oggetto. È facile, veloce e gratuito.
          </p>
        </div>

        <Card className="border-border shadow-xl">
          <CardHeader className="bg-muted/30 border-b pb-6">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Type className="w-5 h-5 text-primary" />
              Dettagli dell'annuncio
            </CardTitle>
            <CardDescription className="text-base">
              Fornisci informazioni chiare e dettagliate per attrarre più acquirenti.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="titolo"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-base">Titolo dell'annuncio *</FormLabel>
                        <FormControl>
                          <Input placeholder="Es. Bicicletta da corsa usata pochissimo" className="h-12 text-lg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Categoria *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Seleziona categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categorie?.map((cat) => (
                              <SelectItem key={cat.id} value={cat.nome}>
                                {cat.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="prezzo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Prezzo (€)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              className="pl-10 h-12 text-lg" 
                              {...field} 
                              value={field.value === null ? '' : field.value}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>Lascia vuoto per "Su richiesta"</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="descrizione"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Descrizione *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descrivi l'oggetto in dettaglio: condizioni, anno di acquisto, motivi della vendita..." 
                          className="min-h-[150px] resize-y text-base p-4" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                  <FormField
                    control={form.control}
                    name="citta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Città *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input placeholder="Es. Roma" className="pl-10 h-12 text-lg" {...field} />
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
                        <FormLabel className="text-base">Recapito telefonico o Email *</FormLabel>
                        <FormControl>
                          <Input placeholder="Es. 333 1234567 oppure mario@email.it" className="h-12 text-lg" {...field} />
                        </FormControl>
                        <FormDescription>Come vuoi essere contattato?</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-6 border-t">
                  <FormField
                    control={form.control}
                    name="immagineUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Immagine (URL opzionale)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <ImagePlus className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                            <Input 
                              placeholder="https://..." 
                              className="pl-10 h-12 text-lg" 
                              {...field} 
                              value={field.value || ''}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>Aggiungi un'immagine per attirare più visite. Inserisci l'URL diretto all'immagine.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-8 flex justify-end">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full md:w-auto h-14 px-10 text-lg rounded-xl"
                    disabled={createAnnuncio.isPending}
                  >
                    {createAnnuncio.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Pubblicazione in corso...
                      </>
                    ) : (
                      "Pubblica Annuncio"
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
