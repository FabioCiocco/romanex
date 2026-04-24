import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Layout } from "@/components/layout/Layout";
import {
  useListForumThreads,
  useGetForumCategorie,
  useCreateForumThread,
} from "@workspace/api-client-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, MessageCircle, Plus, ChevronRight, Clock } from "lucide-react";
import { BackBanner } from "@/components/layout/BackBanner";
import { formatDistanceToNow } from "date-fns";
import { it as itLocale, enUS, es as esLocale, type Locale } from "date-fns/locale";

const DATE_LOCALES: Record<string, Locale> = { it: itLocale, en: enUS, es: esLocale };

const CATEGORY_COLORS: Record<string, string> = {
  "Vita universitaria":   "bg-blue-500",
  "Esami & Studio":       "bg-purple-500",
  "Erasmus & Estero":     "bg-green-500",
  "Casa & Logistica":     "bg-orange-500",
  "Lavoro & Stage":       "bg-rose-500",
  "Off Topic":            "bg-gray-500",
};

export default function Forum() {
  const { t, lang } = useLanguage();
  const tf = t.forum;
  const { user, isSignedIn } = useUser();
  const searchString = useSearch();
  const [, setLocation] = useLocation();

  const params = new URLSearchParams(searchString);
  const activeCat = params.get("categoria") || "";
  const page = parseInt(params.get("page") || "1", 10);
  const limit = 15;

  const { data: categories } = useGetForumCategorie();
  const { data, isLoading, error, refetch } = useListForumThreads({
    categoria: activeCat || undefined,
    page,
    limit,
  });

  const { mutate: createThread, isPending: isSubmitting } = useCreateForumThread({
    mutation: { onSuccess: () => { setDialogOpen(false); refetch(); } },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCat, setNewCat] = useState(categories?.[0] ?? "");
  const [newAuthor, setNewAuthor] = useState(
    user?.email?.split("@")[0] || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = newCat || categories?.[0] || "";
    if (!newTitle.trim() || !newBody.trim() || !cat) return;
    createThread({
      data: {
        titolo: newTitle.trim(),
        corpo: newBody.trim(),
        categoria: cat,
        autore: newAuthor.trim() || tf.guestName,
        autoreClerkId: user?.id ?? null,
      },
    });
  };

  const setCategory = (cat: string) => {
    const p = new URLSearchParams();
    if (cat) p.set("categoria", cat);
    setLocation("/forum" + (p.toString() ? "?" + p.toString() : ""));
  };

  const dateLocale = DATE_LOCALES[lang] ?? itLocale;

  const threads = data?.threads ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <Layout>
      <BackBanner crumbs={[{ label: tf.title }]} backHref="/" />
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground leading-none">
                {tf.title}
              </h1>
              <p className="mt-2 text-foreground/60 font-medium">{tf.subtitle}</p>
            </div>
            {isSignedIn ? (
              <Dialog open={dialogOpen} onOpenChange={(o) => {
                setDialogOpen(o);
                if (o) {
                  setNewAuthor(user?.email?.split("@")[0] || "");
                  setNewCat(categories?.[0] ?? "");
                  setNewTitle("");
                  setNewBody("");
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="shrink-0 gap-2 rounded-xl px-5 bg-accent text-accent-foreground border-2 border-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))] hover:shadow-[1px_1px_0_0_hsl(var(--foreground))] hover:translate-y-[2px] hover:translate-x-[2px] transition-all font-black text-sm uppercase tracking-wide">
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    {tf.newThread}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg border-2 border-foreground rounded-2xl shadow-[6px_6px_0_0_hsl(var(--foreground))]">
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl font-black uppercase tracking-tight">{tf.newThread}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-foreground/70">{tf.category}</label>
                      <Select value={newCat || categories?.[0] || ""} onValueChange={setNewCat}>
                        <SelectTrigger className="border-2 border-foreground rounded-xl h-11 font-semibold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(categories ?? []).map((c) => (
                            <SelectItem key={c} value={c} className="font-semibold">{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-foreground/70">{tf.threadTitle}</label>
                      <Input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder={tf.titlePlaceholder}
                        className="border-2 border-foreground rounded-xl h-11 font-semibold"
                        maxLength={200}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-foreground/70">{tf.threadBody}</label>
                      <Textarea
                        value={newBody}
                        onChange={(e) => setNewBody(e.target.value)}
                        placeholder={tf.bodyPlaceholder}
                        className="border-2 border-foreground rounded-xl min-h-[120px] font-medium resize-none"
                        maxLength={5000}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-foreground/70">{tf.authorLabel}</label>
                      <Input
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="border-2 border-foreground rounded-xl h-11 font-semibold"
                        maxLength={80}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !newTitle.trim() || !newBody.trim()}
                      className="w-full h-12 font-black uppercase tracking-wide rounded-xl border-2 border-foreground bg-primary text-primary-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))] hover:shadow-[1px_1px_0_0_hsl(var(--foreground))] hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
                    >
                      {isSubmitting ? tf.submitting : tf.submit}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            ) : (
              <Link href="/sign-in">
                <Button variant="outline" className="shrink-0 gap-2 rounded-xl px-5 border-2 border-foreground font-black text-sm uppercase tracking-wide">
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                  {tf.loginToPost}
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCategory("")}
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 transition-all ${!activeCat ? "bg-foreground text-background border-foreground" : "border-foreground/30 text-foreground/60 hover:border-foreground hover:text-foreground"}`}
          >
            {tf.allCategories}
          </button>
          {(categories ?? []).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 transition-all ${activeCat === cat ? "bg-foreground text-background border-foreground" : "border-foreground/30 text-foreground/60 hover:border-foreground hover:text-foreground"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 mb-6 rounded-2xl border-2 border-destructive bg-destructive/5 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" strokeWidth={2.5} />
            <p className="font-semibold text-sm">{tf.errorLoad}</p>
          </div>
        )}

        {/* Threads list */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : threads.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-foreground/20 rounded-2xl">
            <MessageCircle className="h-12 w-12 mx-auto text-foreground/20 mb-4" strokeWidth={1.5} />
            <p className="font-black text-lg uppercase text-foreground/40">{tf.noThreads}</p>
            <p className="text-sm text-foreground/30 mt-1">{tf.beFirst}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {threads.map((thread) => {
              const colorClass = CATEGORY_COLORS[thread.categoria] ?? "bg-gray-500";
              const timeAgo = formatDistanceToNow(new Date(thread.createdAt!), { addSuffix: true, locale: dateLocale });
              const replyCount = thread.risposteCount ?? 0;
              return (
                <Link key={thread.id} href={`/forum/${thread.id}`}>
                  <div className="group flex items-center gap-4 p-4 rounded-2xl border-2 border-foreground bg-background hover:bg-muted shadow-[3px_3px_0_0_hsl(var(--foreground))] hover:shadow-[1px_1px_0_0_hsl(var(--foreground))] hover:translate-y-[2px] hover:translate-x-[2px] transition-all cursor-pointer">
                    <div className={`${colorClass} w-1.5 self-stretch rounded-full shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge className={`${colorClass} text-white text-[10px] font-black uppercase tracking-wider px-2 py-0 border-0 rounded-full`}>
                          {thread.categoria}
                        </Badge>
                      </div>
                      <h3 className="font-black text-base text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {thread.titolo}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-foreground/50 font-medium">
                        <span className="font-bold">{thread.autore}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-foreground/40 group-hover:text-primary transition-colors">
                      <MessageCircle className="h-4 w-4" strokeWidth={2} />
                      <span className="text-sm font-black">{replyCount}</span>
                      <ChevronRight className="h-4 w-4 ml-1" strokeWidth={2.5} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {page > 1 && (
              <Button
                variant="outline"
                className="border-2 border-foreground rounded-xl font-black"
                onClick={() => {
                  const p = new URLSearchParams(searchString);
                  p.set("page", String(page - 1));
                  setLocation("/forum?" + p.toString());
                }}
              >
                ←
              </Button>
            )}
            <span className="px-4 py-2 text-sm font-black">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Button
                variant="outline"
                className="border-2 border-foreground rounded-xl font-black"
                onClick={() => {
                  const p = new URLSearchParams(searchString);
                  p.set("page", String(page + 1));
                  setLocation("/forum?" + p.toString());
                }}
              >
                →
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
