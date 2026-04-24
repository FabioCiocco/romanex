import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Annunci from "@/pages/Annunci";
import Utenti from "@/pages/Utenti";
import Forum from "@/pages/Forum";
import Impostazioni from "@/pages/Impostazioni";
import { useEffect, useState } from "react";
import { checkAdmin } from "@/lib/api";

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

interface SessionUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

async function fetchMe(): Promise<SessionUser | null> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function doLogin(email: string, password: string): Promise<SessionUser> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

async function doLogout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
}

function LoginForm({ onLogin }: { onLogin: (user: SessionUser) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await doLogin(email, password);
      if (!user.isAdmin) {
        setError("Il tuo account non ha permessi di amministratore.");
        return;
      }
      onLogin(user);
    } catch (err: unknown) {
      const e = err as Error;
      if (e.message === "INVALID_CREDENTIALS") {
        setError("Email o password errati.");
      } else {
        setError("Errore di accesso. Riprova.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="text-yellow-400 font-black text-3xl uppercase tracking-tight">RomaNex</div>
          <div className="text-zinc-500 font-mono text-sm mt-1">Pannello di amministrazione</div>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 border-2 border-red-500 bg-red-900/20 text-red-400 text-sm font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 border-2 border-zinc-700 p-6 bg-zinc-900">
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 text-white font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-yellow-400"
              placeholder="admin@example.it"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-600 text-white font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-yellow-400"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-black uppercase tracking-wider py-3 text-sm hover:bg-yellow-300 transition-colors disabled:opacity-50"
          >
            {loading ? "Accesso..." : "Accedi"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminGate() {
  const [status, setStatus] = useState<"loading" | "login" | "denied" | "ok">("loading");
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    fetchMe().then(user => {
      if (!user) {
        setStatus("login");
        return;
      }
      if (!user.isAdmin) {
        setStatus("denied");
        return;
      }
      setSessionUser(user);
      checkAdmin()
        .then(() => setStatus("ok"))
        .catch(() => setStatus("denied"));
    });
  }, []);

  const handleLogin = (user: SessionUser) => {
    setSessionUser(user);
    checkAdmin()
      .then(() => setStatus("ok"))
      .catch(() => setStatus("denied"));
  };

  const handleLogout = async () => {
    await doLogout();
    setSessionUser(null);
    setStatus("login");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-yellow-400 font-mono text-sm animate-pulse">Caricamento...</div>
      </div>
    );
  }

  if (status === "login") {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (status === "denied") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-center border-2 border-red-500 p-8 max-w-sm">
          <div className="text-red-400 font-black text-xl uppercase mb-2">Accesso negato</div>
          <div className="text-zinc-500 font-mono text-sm mb-4">
            Il tuo account non ha i permessi di amministratore.
          </div>
          <div className="text-zinc-600 font-mono text-xs mb-6">
            {sessionUser?.email}
          </div>
          <button
            onClick={handleLogout}
            className="bg-yellow-400 text-black px-4 py-2 font-black text-sm uppercase hover:bg-yellow-300 transition-colors"
          >
            Disconnetti
          </button>
        </div>
      </div>
    );
  }

  return (
    <Layout onLogout={handleLogout} userEmail={sessionUser?.email}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/annunci" component={Annunci} />
        <Route path="/utenti" component={Utenti} />
        <Route path="/forum" component={Forum} />
        <Route path="/impostazioni" component={Impostazioni} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={basePath}>
        <AdminGate />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
