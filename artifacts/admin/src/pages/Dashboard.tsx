import { useEffect, useState } from "react";
import { getStats, type AdminStats } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users, FileText, MessageSquare, TrendingUp, AlertCircle } from "lucide-react";

const COLORS = ["#facc15", "#f97316", "#84cc16", "#22d3ee", "#a78bfa", "#f43f5e"];

const CATEGORIE_LABEL: Record<string, string> = {
  appartamenti: "Appartamenti",
  libri: "Libri",
  ripetizioni: "Ripetizioni",
  consigli: "Consigli",
  "gruppi-studio": "Gruppi Studio",
};

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div
      className={`border-2 p-5 rounded-none ${
        accent ? "border-yellow-400 bg-yellow-400/5" : "border-zinc-700 bg-zinc-900"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">{label}</span>
        <Icon size={16} className={accent ? "text-yellow-400" : "text-zinc-600"} />
      </div>
      <div className={`text-3xl font-black tabular-nums ${accent ? "text-yellow-400" : "text-white"}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-zinc-500 mt-1">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-zinc-800 rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-zinc-800 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 text-red-400 border-2 border-red-400/40 bg-red-400/5 p-4 rounded">
        <AlertCircle size={18} />
        <span className="font-mono text-sm">{error}</span>
      </div>
    );
  }

  if (!stats) return null;

  const chartData = stats.annunciPerCategoria.map((item) => ({
    name: CATEGORIE_LABEL[item.categoria] || item.categoria,
    count: item.count,
  }));

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short" });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 text-sm font-mono mt-1">Panoramica della piattaforma</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Annunci totali" value={stats.totaleAnnunci} icon={FileText} accent />
        <StatCard label="Annunci oggi" value={stats.annunciOggi} sub="nuovi oggi" icon={TrendingUp} />
        <StatCard label="Utenti registrati" value={stats.totaleUtenti} icon={Users} />
        <StatCard label="Nuovi utenti oggi" value={stats.utentiOggi} icon={TrendingUp} />
        <StatCard label="Thread forum" value={stats.totaleThread} icon={MessageSquare} />
        <StatCard label="Risposte forum" value={stats.totaleRisposte} icon={MessageSquare} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border-2 border-zinc-700 bg-zinc-900 p-5">
          <h2 className="font-black text-sm uppercase tracking-wider text-zinc-300 mb-4">
            Annunci per categoria
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={28}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#71717a", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: 0,
                  color: "#fff",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" radius={0}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="border-2 border-zinc-700 bg-zinc-900 p-5">
          <h2 className="font-black text-sm uppercase tracking-wider text-zinc-300 mb-4">
            Annunci recenti
          </h2>
          <div className="space-y-2">
            {stats.annunciRecenti.length === 0 && (
              <p className="text-zinc-500 text-sm font-mono">Nessun annuncio</p>
            )}
            {stats.annunciRecenti.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-zinc-200 truncate">{a.titolo}</div>
                  <div className="text-xs text-zinc-500 font-mono capitalize">{a.categoria}</div>
                </div>
                <div className="text-xs text-zinc-600 font-mono ml-3 shrink-0">
                  {formatDate(a.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
