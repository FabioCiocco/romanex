import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950">
      <div className="text-center border-2 border-zinc-700 p-12">
        <AlertCircle className="h-10 w-10 text-yellow-400 mx-auto mb-4" />
        <div className="text-5xl font-black text-yellow-400 mb-3">404</div>
        <h1 className="text-xl font-black text-white uppercase tracking-tight mb-2">
          Pagina non trovata
        </h1>
        <p className="text-zinc-500 font-mono text-sm mb-6">
          La pagina che cerchi non esiste.
        </p>
        <Link href="/">
          <a className="bg-yellow-400 text-black px-4 py-2 font-black text-sm uppercase hover:bg-yellow-300 transition-colors">
            Dashboard
          </a>
        </Link>
      </div>
    </div>
  );
}
