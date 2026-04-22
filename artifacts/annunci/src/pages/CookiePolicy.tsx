import { Link } from "wouter";
import { ArrowLeft, Cookie, Settings, BarChart2, Shield, Trash2 } from "lucide-react";

const LAST_UPDATED = "22 aprile 2025";

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section className="border-2 border-foreground rounded-2xl overflow-hidden shadow-[4px_4px_0_0_hsl(var(--foreground))]">
      <div className="bg-foreground text-background px-6 py-4 flex items-center gap-3">
        <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
        <h2 className="font-display font-black text-lg uppercase tracking-wide">{title}</h2>
      </div>
      <div className="p-6 space-y-3 text-foreground/80 leading-relaxed text-sm font-medium bg-card">
        {children}
      </div>
    </section>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-relaxed">{children}</p>;
}

function CookieTable({ rows }: { rows: { nome: string; tipo: string; durata: string; scopo: string }[] }) {
  return (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full text-xs border-collapse min-w-[500px]">
        <thead>
          <tr className="bg-foreground/5">
            <th className="text-left px-3 py-2 font-black uppercase tracking-wider border border-foreground/10">Nome</th>
            <th className="text-left px-3 py-2 font-black uppercase tracking-wider border border-foreground/10">Tipo</th>
            <th className="text-left px-3 py-2 font-black uppercase tracking-wider border border-foreground/10">Durata</th>
            <th className="text-left px-3 py-2 font-black uppercase tracking-wider border border-foreground/10">Scopo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-foreground/5">
              <td className="px-3 py-2 font-mono border border-foreground/10">{r.nome}</td>
              <td className="px-3 py-2 border border-foreground/10">{r.tipo}</td>
              <td className="px-3 py-2 border border-foreground/10">{r.durata}</td>
              <td className="px-3 py-2 border border-foreground/10">{r.scopo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-foreground/60 hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Torna alla home
        </Link>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground border border-accent/20 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider mb-4">
            <Cookie className="w-3.5 h-3.5" />
            Cookie Policy
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl uppercase tracking-tighter text-foreground mb-4">
            Cookie <span className="text-primary">Policy</span>
          </h1>
          <p className="text-foreground/60 text-sm font-medium">
            Ultimo aggiornamento: {LAST_UPDATED} · Art. 122 D.Lgs. 196/2003 · Provvedimento Garante 8 maggio 2014
          </p>
        </div>

        <div className="space-y-6">
          <Section icon={Cookie} title="Cosa sono i Cookie">
            <Para>
              I cookie sono piccoli file di testo che i siti web salvano sul tuo dispositivo quando li visiti. 
              Servono a far funzionare correttamente il sito, ricordare le tue preferenze e migliorare la tua esperienza.
            </Para>
            <Para>
              RomaNex utilizza esclusivamente <strong>cookie tecnici necessari</strong> al funzionamento del servizio. 
              Non utilizziamo cookie di profilazione o pubblicitari.
            </Para>
          </Section>

          <Section icon={Settings} title="Cookie Tecnici (sempre attivi)">
            <Para>
              Questi cookie sono indispensabili per il funzionamento del sito e non possono essere disabilitati. 
              Non richiedono il tuo consenso ai sensi del Provvedimento Garante.
            </Para>
            <CookieTable rows={[
              { nome: "__session", tipo: "Sessione", durata: "Sessione", scopo: "Autenticazione utente (Clerk)" },
              { nome: "__client_uat", tipo: "Persistente", durata: "1 anno", scopo: "Stato autenticazione Clerk" },
              { nome: "__clerk_db_jwt", tipo: "Sessione", durata: "Sessione", scopo: "Token JWT sessione Clerk" },
              { nome: "romanex_cookie_consent", tipo: "Persistente", durata: "1 anno", scopo: "Salva la tua preferenza sul banner cookie" },
            ]} />
          </Section>

          <Section icon={BarChart2} title="Cookie di Terze Parti">
            <Para>
              Attualmente <strong>non utilizziamo</strong> cookie di analytics, advertising o social media di terze parti.
            </Para>
            <Para>
              Il servizio di autenticazione Clerk potrebbe impostare cookie tecnici propri. Per maggiori informazioni 
              consulta la <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">Privacy Policy di Clerk</a>.
            </Para>
          </Section>

          <Section icon={Trash2} title="Come Gestire i Cookie">
            <Para>
              Puoi controllare e cancellare i cookie attraverso le impostazioni del tuo browser:
            </Para>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {[
                { name: "Chrome", url: "https://support.google.com/chrome/answer/95647" },
                { name: "Firefox", url: "https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox" },
                { name: "Safari", url: "https://support.apple.com/it-it/guide/safari/sfri11471/mac" },
                { name: "Edge", url: "https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
                { name: "Opera", url: "https://help.opera.com/en/latest/web-preferences/#cookies" },
              ].map((b) => (
                <a
                  key={b.name}
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 border border-foreground/20 rounded-lg px-3 py-2 text-xs font-bold hover:bg-foreground/5 transition-colors"
                >
                  {b.name} →
                </a>
              ))}
            </div>
            <Para>
              Attenzione: disabilitare i cookie tecnici potrebbe impedire il corretto funzionamento del sito, 
              incluso l'accesso al tuo account.
            </Para>
          </Section>

          <Section icon={Shield} title="Revoca del Consenso">
            <Para>
              Puoi revocare il tuo consenso sui cookie facoltativi in qualsiasi momento cliccando sul link 
              "Gestisci cookie" presente nel footer del sito. La revoca non pregiudica la liceità del trattamento 
              basata sul consenso prima della revoca.
            </Para>
          </Section>
        </div>

        <div className="mt-10 pt-6 border-t border-foreground/10 text-xs text-foreground/40 font-medium text-center">
          RomaNex · {LAST_UPDATED} · <Link href="/privacy" className="hover:text-foreground/60 underline">Privacy Policy</Link> · <Link href="/note-legali" className="hover:text-foreground/60 underline">Note Legali</Link>
        </div>
      </div>
    </div>
  );
}
