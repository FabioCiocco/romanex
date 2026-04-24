import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Mail, Save, RotateCcw } from "lucide-react";

const BASE = "/api/settings";

async function getSettings(): Promise<Record<string, string>> {
  const res = await fetch(BASE, { credentials: "include" });
  if (!res.ok) throw new Error("Errore nel caricamento impostazioni");
  return res.json();
}

async function saveSettings(data: Record<string, string>): Promise<void> {
  const res = await fetch(BASE, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Errore nel salvataggio");
}

const DEFAULTS = {
  welcome_email_subject: "Benvenuto su RomaNex! 🎓",
  welcome_email_body:
    "Il tuo account su RomaNex è attivo. Ora sei parte della bacheca digitale degli studenti universitari di Roma.",
  welcome_email_cta_text: "Vai alla Bacheca →",
};

export default function Impostazioni() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["settings"], queryFn: getSettings });

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [cta, setCta] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) {
      setSubject(data.welcome_email_subject ?? DEFAULTS.welcome_email_subject);
      setBody(data.welcome_email_body ?? DEFAULTS.welcome_email_body);
      setCta(data.welcome_email_cta_text ?? DEFAULTS.welcome_email_cta_text);
    }
  }, [data]);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: saveSettings,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      welcome_email_subject: subject,
      welcome_email_body: body,
      welcome_email_cta_text: cta,
    });
  };

  const handleReset = () => {
    setSubject(DEFAULTS.welcome_email_subject);
    setBody(DEFAULTS.welcome_email_body);
    setCta(DEFAULTS.welcome_email_cta_text);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-yellow-400 font-mono text-sm animate-pulse">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tight text-white">Impostazioni</h1>
        <p className="text-zinc-500 font-mono text-sm mt-1">Personalizza i testi delle email automatiche</p>
      </div>

      <div className="border-2 border-zinc-700 bg-zinc-900">
        <div className="flex items-center gap-3 px-5 py-4 border-b-2 border-zinc-700 bg-zinc-800">
          <Mail size={16} className="text-yellow-400" />
          <span className="font-black text-sm uppercase tracking-wider text-white">Email di Benvenuto</span>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-5">
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
              Oggetto email
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 text-white font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-yellow-400"
              placeholder={DEFAULTS.welcome_email_subject}
            />
            <p className="text-zinc-600 font-mono text-xs mt-1">
              La riga dell'oggetto che appare nella casella di posta dell'utente.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
              Testo principale
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className="w-full bg-zinc-800 border border-zinc-600 text-white font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-yellow-400 resize-y"
              placeholder={DEFAULTS.welcome_email_body}
            />
            <p className="text-zinc-600 font-mono text-xs mt-1">
              Il paragrafo principale del corpo dell'email.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
              Testo pulsante CTA
            </label>
            <input
              type="text"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 text-white font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-yellow-400"
              placeholder={DEFAULTS.welcome_email_cta_text}
            />
            <p className="text-zinc-600 font-mono text-xs mt-1">
              Il testo del bottone viola che porta gli utenti al sito.
            </p>
          </div>

          {isError && (
            <div className="px-4 py-3 border border-red-500 bg-red-900/20 text-red-400 font-mono text-sm">
              Errore nel salvataggio. Riprova.
            </div>
          )}

          {saved && (
            <div className="px-4 py-3 border border-green-500 bg-green-900/20 text-green-400 font-mono text-sm">
              ✓ Impostazioni salvate con successo.
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-2.5 font-black text-sm uppercase tracking-wider hover:bg-yellow-300 transition-colors disabled:opacity-50"
            >
              <Save size={14} />
              {isPending ? "Salvataggio..." : "Salva"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 border border-zinc-600 text-zinc-400 px-4 py-2.5 font-bold text-sm uppercase hover:text-white hover:border-zinc-400 transition-colors"
            >
              <RotateCcw size={14} />
              Ripristina predefiniti
            </button>
          </div>
        </form>
      </div>

      {/* Preview */}
      <div className="mt-6 border-2 border-zinc-700 bg-zinc-900">
        <div className="px-5 py-3 border-b-2 border-zinc-700 bg-zinc-800">
          <span className="font-black text-xs uppercase tracking-wider text-zinc-400">Anteprima email</span>
        </div>
        <div className="p-5">
          <div className="bg-[#f0eff8] p-4 text-sm" style={{ fontFamily: "Arial, sans-serif" }}>
            <div style={{ background: "#0d0f1a", padding: "16px 20px", marginBottom: 0 }}>
              <span style={{ color: "#ffffff", fontWeight: 900, fontSize: 18 }}>
                Roma<span style={{ color: "#f59e0b" }}>Nex</span>
              </span>
            </div>
            <div style={{ background: "#6d28d9", padding: "20px" }}>
              <p style={{ color: "#e9d5ff", fontSize: 11, textTransform: "uppercase", letterSpacing: 2, margin: "0 0 6px 0" }}>🎉 Benvenuto nella community</p>
              <p style={{ color: "#fff", fontWeight: 900, fontSize: 22, margin: 0 }}>Ciao!</p>
            </div>
            <div style={{ background: "#fff", padding: "20px", border: "1px solid #e5e7eb" }}>
              <p style={{ color: "#0d0f1a", fontWeight: 600, lineHeight: 1.7, marginBottom: 16 }}>{body || DEFAULTS.welcome_email_body}</p>
              <div style={{ display: "inline-block", background: "#6d28d9", padding: "10px 20px" }}>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: 13, textTransform: "uppercase" }}>
                  {cta || DEFAULTS.welcome_email_cta_text}
                </span>
              </div>
            </div>
            <div style={{ background: "#0d0f1a", padding: "12px 20px", textAlign: "center" }}>
              <p style={{ color: "#6b7280", fontSize: 10, margin: 0 }}>© {new Date().getFullYear()} RomaNex</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
