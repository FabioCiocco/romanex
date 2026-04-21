import { useEffect, useState, useCallback } from "react";
import { getForumThreads, deleteThread, type ForumThread, type ThreadsPageResult } from "@/lib/api";
import { Trash2, Search, ChevronLeft, ChevronRight, AlertCircle, MessageSquare } from "lucide-react";

export default function Forum() {
  const [result, setResult] = useState<ThreadsPageResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [inputQ, setInputQ] = useState("");
  const [busy, setBusy] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getForumThreads({ page, q })
      .then(setResult)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page, q]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQ(inputQ.trim());
    setPage(1);
  };

  const handleDelete = async (id: number) => {
    if (confirm !== id) {
      setConfirm(id);
      return;
    }
    setBusy(id);
    try {
      await deleteThread(id);
      setConfirm(null);
      load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">Forum</h1>
        <p className="text-zinc-500 text-sm font-mono mt-1">
          {result ? `${result.total} thread totali` : "..."}
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={inputQ}
          onChange={(e) => setInputQ(e.target.value)}
          placeholder="Cerca titolo, autore..."
          className="flex-1 bg-zinc-900 border-2 border-zinc-700 focus:border-yellow-400 text-white text-sm px-3 py-2 outline-none font-mono transition-colors"
        />
        <button
          type="submit"
          className="bg-yellow-400 text-black px-4 py-2 font-black text-sm uppercase hover:bg-yellow-300 transition-colors flex items-center gap-1.5"
        >
          <Search size={14} />
          Cerca
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-3 text-red-400 border-2 border-red-400/40 bg-red-400/5 p-3 text-sm font-mono">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <div className="border-2 border-zinc-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-900 border-b-2 border-zinc-700">
              <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-400">
                ID
              </th>
              <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-400">
                Titolo
              </th>
              <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-400 hidden sm:table-cell">
                Autore
              </th>
              <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-400 hidden md:table-cell">
                Categoria
              </th>
              <th className="text-center px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-400 hidden md:table-cell">
                Risposte
              </th>
              <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-400 hidden lg:table-cell">
                Data
              </th>
              <th className="text-center px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-400">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-600 font-mono text-sm">
                  Caricamento...
                </td>
              </tr>
            )}
            {!loading && result?.threads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-600 font-mono text-sm">
                  Nessun thread trovato
                </td>
              </tr>
            )}
            {!loading &&
              result?.threads.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-zinc-500 text-xs">#{t.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-zinc-200 truncate max-w-xs">{t.titolo}</div>
                    <div className="text-xs text-zinc-500 font-mono truncate max-w-xs">
                      {t.corpo.slice(0, 60)}...
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-zinc-400 text-xs font-mono">
                    {t.autore}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 font-mono capitalize">
                      {t.categoria}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-center">
                    <span className="flex items-center justify-center gap-1 text-zinc-500 text-xs">
                      <MessageSquare size={12} />
                      {t.risposteCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-zinc-500 text-xs font-mono">
                    {formatDate(t.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={busy === t.id}
                      className={`text-sm font-mono px-2 py-1 border transition-colors disabled:opacity-50 ${
                        confirm === t.id
                          ? "text-white bg-red-500 border-red-500 hover:bg-red-600"
                          : "text-zinc-500 border-zinc-700 hover:text-red-400 hover:border-red-400"
                      }`}
                    >
                      {confirm === t.id ? "Conferma" : <Trash2 size={14} />}
                    </button>
                    {confirm === t.id && (
                      <button
                        onClick={() => setConfirm(null)}
                        className="ml-1 text-xs font-mono text-zinc-600 hover:text-zinc-400"
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {result && result.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-mono">
            Pagina {result.page} di {result.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={result.page <= 1}
              className="border-2 border-zinc-700 text-zinc-400 px-3 py-1.5 hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={result.page >= result.totalPages}
              className="border-2 border-zinc-700 text-zinc-400 px-3 py-1.5 hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
