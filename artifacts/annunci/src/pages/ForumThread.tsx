import { useState } from "react";
import { Link, useParams } from "wouter";
import { Layout } from "@/components/layout/Layout";
import {
  useGetForumThread,
  getGetForumThreadQueryKey,
  useCreateForumReply,
  useDeleteForumThread,
  useDeleteForumReply,
} from "@workspace/api-client-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, MessageCircle, Trash2, Clock } from "lucide-react";
import { BackBanner } from "@/components/layout/BackBanner";
import { formatDistanceToNow, format } from "date-fns";
import { it as itLocale, enUS, es as esLocale, type Locale } from "date-fns/locale";
import { useLocation } from "wouter";

const DATE_LOCALES: Record<string, Locale> = { it: itLocale, en: enUS, es: esLocale };

const CATEGORY_COLORS: Record<string, string> = {
  "Vita universitaria": "bg-blue-500",
  "Esami & Studio": "bg-purple-500",
  "Erasmus & Estero": "bg-green-500",
  "Casa & Logistica": "bg-orange-500",
  "Lavoro & Stage": "bg-rose-500",
  "Off Topic": "bg-gray-500",
};

export default function ForumThread() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { t, lang } = useLanguage();
  const tf = (t as any).forum as Record<string, string>;
  const { user, isSignedIn } = useUser();
  const dateLocale = DATE_LOCALES[lang] ?? itLocale;

  const threadId = parseInt(id ?? "0", 10);

  const { data, isLoading, error, refetch } = useGetForumThread(threadId, {
    query: {
      queryKey: getGetForumThreadQueryKey(threadId),
      enabled: !isNaN(threadId) && threadId > 0,
    },
  });

  const { mutate: createReply, isPending: isReplying } = useCreateForumReply({
    mutation: { onSuccess: () => { setReplyBody(""); refetch(); } },
  });

  const { mutate: deleteThread, isPending: isDeletingThread } = useDeleteForumThread({
    mutation: {
      onSuccess: () => setLocation("/forum"),
    },
  });

  const { mutate: deleteReply } = useDeleteForumReply({
    mutation: { onSuccess: () => refetch() },
  });

  const [replyBody, setReplyBody] = useState("");
  const [replyAuthor, setReplyAuthor] = useState(
    user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] || ""
  );

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyBody.trim()) return;
    createReply({
      id: threadId,
      data: {
        corpo: replyBody.trim(),
        autore: replyAuthor.trim() || tf.guestName,
        autoreClerkId: user?.id ?? null,
      },
    });
  };

  const handleDeleteThread = () => {
    if (!window.confirm(tf.confirmDelete)) return;
    deleteThread({ id: threadId });
  };

  const handleDeleteReply = (replyId: number) => {
    if (!window.confirm(tf.confirmDeleteReply)) return;
    deleteReply({ threadId, replyId });
  };

  const thread = data?.thread;
  const replies = data?.replies ?? [];
  const colorClass = thread ? (CATEGORY_COLORS[thread.categoria] ?? "bg-gray-500") : "";

  return (
    <Layout>
      <BackBanner
        crumbs={[
          { label: tf.title, href: '/forum' },
          ...(thread ? [{ label: thread.titolo }] : []),
        ]}
        backHref="/forum"
      />
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-3xl">

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 mb-6 rounded-2xl border-2 border-destructive bg-destructive/5 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" strokeWidth={2.5} />
            <p className="font-semibold text-sm">{tf.errorLoad}</p>
          </div>
        )}

        {/* Thread skeleton */}
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4 rounded-2xl" />
            <Skeleton className="h-6 w-1/3 rounded-xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        )}

        {/* Thread header */}
        {thread && (
          <div className="mb-8">
            <div className="p-6 rounded-2xl border-2 border-foreground bg-background shadow-[5px_5px_0_0_hsl(var(--foreground))]">
              <div className="flex items-start justify-between gap-3 mb-3">
                <Badge className={`${colorClass} text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 border-0 rounded-full`}>
                  {thread.categoria}
                </Badge>
                {isSignedIn && user?.id === thread.autoreClerkId && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
                    onClick={handleDeleteThread}
                    disabled={isDeletingThread}
                    title={tf.deleteThread}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </Button>
                )}
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground leading-tight mb-4">
                {thread.titolo}
              </h1>
              <p className="text-foreground/80 text-base leading-relaxed whitespace-pre-wrap mb-4">
                {thread.corpo}
              </p>
              <div className="flex items-center gap-3 text-xs text-foreground/50 font-medium border-t border-foreground/10 pt-3">
                <span className="font-black text-foreground/70">{thread.autore}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(thread.createdAt!), "d MMM yyyy", { locale: dateLocale })}
                </span>
                <span className="ml-auto flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5" strokeWidth={2} />
                  {replies.length} {replies.length === 1 ? tf.reply : tf.replies}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Replies */}
        {!isLoading && (
          <div className="space-y-4 mb-8">
            <h2 className="font-display text-lg font-black uppercase tracking-tight text-foreground/70 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" strokeWidth={2.5} />
              {replies.length} {replies.length === 1 ? tf.reply : tf.replies}
            </h2>

            {replies.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-foreground/20 rounded-2xl">
                <p className="font-black text-sm uppercase text-foreground/30">{tf.noReplies}</p>
              </div>
            ) : (
              replies.map((reply, idx) => {
                const isOwner = isSignedIn && user?.id === reply.autoreClerkId;
                return (
                  <div
                    key={reply.id}
                    className="p-4 rounded-2xl border-2 border-foreground/20 bg-background hover:border-foreground transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 border-2 border-foreground/20 flex items-center justify-center text-xs font-black text-primary">
                          {(reply.autore ?? tf.guestName).charAt(0).toUpperCase()}
                        </div>
                        <span className="font-black text-sm text-foreground">{reply.autore}</span>
                        <span className="text-xs text-foreground/40 font-medium">
                          #{idx + 1} · {formatDistanceToNow(new Date(reply.createdAt!), { addSuffix: true, locale: dateLocale })}
                        </span>
                      </div>
                      {isOwner && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-7 h-7 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
                          onClick={() => handleDeleteReply(reply.id!)}
                          title={tf.deleteReply}
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                        </Button>
                      )}
                    </div>
                    <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap pl-9">
                      {reply.corpo}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Reply form */}
        {thread && (
          <div className="border-t-2 border-foreground pt-8">
            {isSignedIn ? (
              <form onSubmit={handleReply} className="space-y-3">
                <h3 className="font-display text-lg font-black uppercase tracking-tight">{tf.replyBtn}</h3>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-foreground/70">{tf.authorLabel}</label>
                  <Input
                    value={replyAuthor}
                    onChange={(e) => setReplyAuthor(e.target.value)}
                    className="border-2 border-foreground rounded-xl h-10 font-semibold"
                    maxLength={80}
                  />
                </div>
                <Textarea
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  placeholder={tf.replyBody}
                  className="border-2 border-foreground rounded-xl min-h-[100px] font-medium resize-none"
                  maxLength={3000}
                  required
                />
                <Button
                  type="submit"
                  disabled={isReplying || !replyBody.trim()}
                  className="h-11 px-8 font-black uppercase tracking-wide rounded-xl border-2 border-foreground bg-primary text-primary-foreground shadow-[3px_3px_0_0_hsl(var(--foreground))] hover:shadow-[1px_1px_0_0_hsl(var(--foreground))] hover:translate-y-[2px] hover:translate-x-[2px] transition-all"
                >
                  {isReplying ? tf.submitting : tf.replyBtn}
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border-2 border-dashed border-foreground/30">
                <p className="text-sm font-semibold text-foreground/60">{tf.loginToReply}</p>
                <Link href="/sign-in">
                  <Button variant="outline" className="border-2 border-foreground rounded-xl font-black text-sm uppercase tracking-wide h-10">
                    {(t as any).nav.signIn}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
