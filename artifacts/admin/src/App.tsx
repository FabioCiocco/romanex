import { ClerkProvider, SignIn, useUser } from "@clerk/react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Annunci from "@/pages/Annunci";
import Utenti from "@/pages/Utenti";
import Forum from "@/pages/Forum";
import { useEffect, useState } from "react";
import { checkAdmin } from "@/lib/api";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

function AdminGate() {
  const { isLoaded, isSignedIn } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setChecking(false);
      setIsAdmin(false);
      return;
    }
    checkAdmin()
      .then(() => setIsAdmin(true))
      .catch(() => setIsAdmin(false))
      .finally(() => setChecking(false));
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || checking) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-yellow-400 font-mono text-sm animate-pulse">Caricamento...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="text-yellow-400 font-black text-3xl uppercase tracking-tight">RomaNex</div>
            <div className="text-zinc-500 font-mono text-sm mt-1">Pannello di amministrazione</div>
          </div>
          <SignIn routing="hash" fallbackRedirectUrl={basePath + "/"} />
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="text-center border-2 border-red-500 p-8 max-w-sm">
          <div className="text-red-400 font-black text-xl uppercase mb-2">Accesso negato</div>
          <div className="text-zinc-500 font-mono text-sm">
            Il tuo account non ha i permessi di amministratore.
          </div>
          <a
            href="/"
            className="mt-6 inline-block bg-yellow-400 text-black px-4 py-2 font-black text-sm uppercase hover:bg-yellow-300 transition-colors"
          >
            Torna al sito
          </a>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/annunci" component={Annunci} />
        <Route path="/utenti" component={Utenti} />
        <Route path="/forum" component={Forum} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      {...(clerkProxyUrl ? { proxyUrl: clerkProxyUrl } : {})}
    >
      <QueryClientProvider client={queryClient}>
        <WouterRouter base={basePath}>
          <AdminGate />
        </WouterRouter>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
