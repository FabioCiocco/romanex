import { useEffect, useState, useCallback } from "react";
import { getUtenti, deleteUtente, type UserProfile, type UtentiPageResult } from "@/lib/api";
import { Trash2, Search, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

export default function Utenti() {
  const [result, setResult] = useState<UtentiPageResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [inputQ, setInputQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getUtenti({ page, q })
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

  const handleDelete = async (userId: string) => {
    if (confirmId !== userId) {
      setConfirmId(userId);
      return;
    }
    setBusy(userId);
    try {
      await deleteUtente(userId);
      setConfirmId(null);
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
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">Utenti</h1>
        <p className="text-zinc-500 text-sm font-mono mt-1">
          {result ? `${result.total} utenti registrati` : "..."}
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={inputQ}
          onChange={(e) => setInputQ(e.target.value)}
          placeholder="Cerca per username, email, nome..."
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
                Username
              </th>
              <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-400 hidden sm:table-cell">
                Nome
              </th>
              <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-400 hidden md:table-cell">
                Email
              </th>
              <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-400 hidden lg:table-cell">
                Università
              </th>
              <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-400 hidden lg:table-cell">
                Registrazione
              </th>
              <th className="text-center px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-400">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-600 font-mono text-sm">
                  Caricamento...
                </td>
              </tr>
            )}
            {!loading && result?.utenti.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-zinc-600 font-mono text-sm">
                  Nessun utente trovato
                </td>
              </tr>
            )}
            {!loading &&
              result?.utenti.map((u) => (
                <tr
                  key={u.userId}
                  className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    {u.username ? (
                      <div className="font-semibold text-zinc-200 font-mono">@{u.username}</div>
                    ) : (
                      <div className="text-zinc-600 font-mono text-xs italic">profilo incompleto</div>
                    )}
                    <div className="text-xs text-zinc-600 font-mono truncate max-w-[120px]">
                      {u.userId.slice(0, 16)}...
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-zinc-300">
                    {u.nome || u.cognome ? `${u.nome ?? ""} ${u.cognome ?? ""}`.trim() : <span className="text-zinc-600 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-zinc-400 text-xs font-mono">
                    {u.email}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-zinc-400 text-xs">
                    {u.universita ?? <span className="text-zinc-600">—</span>}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-zinc-500 text-xs font-mono">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDelete(u.userId)}
                      disabled={busy === u.userId}
                      className={`text-sm font-mono px-2 py-1 border transition-colors disabled:opacity-50 ${
                        confirmId === u.userId
                          ? "text-white bg-red-500 border-red-500 hover:bg-red-600"
                          : "text-zinc-500 border-zinc-700 hover:text-red-400 hover:border-red-400"
                      }`}
                    >
                      {confirmId === u.userId ? "Conferma" : <Trash2 size={14} />}
                    </button>
                    {confirmId === u.userId && (
                      <button
                        onClick={() => setConfirmId(null)}
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
