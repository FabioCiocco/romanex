import { Link } from "wouter";
import { ArrowLeft, Shield, Database, Cookie, UserCheck, Mail, Eye, Trash2 } from "lucide-react";

const LAST_UPDATED = "22 aprile 2025";
const CONTACT_EMAIL = "privacy@romanex.it";
const CONTROLLER = "RomaNex (progetto studentesco senza fini di lucro)";

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

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicy() {
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
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider mb-4">
            <Shield className="w-3.5 h-3.5" />
            GDPR Compliant
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl uppercase tracking-tighter text-foreground mb-4">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="text-foreground/60 text-sm font-medium">
            Ultimo aggiornamento: {LAST_UPDATED} · Regolamento UE 2016/679 (GDPR)
          </p>
        </div>

        <div className="space-y-6">
          <Section icon={UserCheck} title="Titolare del Trattamento">
            <Para>
              Il titolare del trattamento dei dati personali è <strong>{CONTROLLER}</strong>.
            </Para>
            <Para>
              Per qualsiasi richiesta relativa ai tuoi dati personali puoi contattarci all'indirizzo:
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary font-bold ml-1 hover:underline">{CONTACT_EMAIL}</a>
            </Para>
          </Section>

          <Section icon={Database} title="Dati Raccolti e Finalità">
            <Para>Raccogliamo e trattiamo i seguenti dati personali:</Para>
            <List items={[
              "Dati di registrazione: email, nome/nickname forniti al momento dell'iscrizione tramite Clerk",
              "Dati del profilo: università, facoltà, anno di corso, foto profilo (facoltativi)",
              "Contenuti pubblicati: annunci, messaggi nel forum, risposte",
              "Dati tecnici: indirizzo IP, tipo di browser, pagine visitate (log di sistema)",
              "Cookie tecnici necessari al funzionamento del servizio",
            ]} />
            <Para>
              I dati sono trattati per le seguenti finalità: erogazione del servizio (base giuridica: esecuzione del contratto), 
              sicurezza e prevenzione delle frodi (base giuridica: legittimo interesse), 
              comunicazioni di servizio via email (base giuridica: esecuzione del contratto).
            </Para>
          </Section>

          <Section icon={Eye} title="Condivisione dei Dati">
            <Para>I tuoi dati non vengono venduti né ceduti a terzi per finalità commerciali. Li condividiamo solo con:</Para>
            <List items={[
              "Clerk Inc. — fornitore del servizio di autenticazione (con sede negli USA, trasferimento dati coperto da Standard Contractual Clauses)",
              "Replit Inc. — fornitore dell'infrastruttura di hosting",
              "Brevo (Sendinblue) — fornitore del servizio email transazionale",
            ]} />
            <Para>
              Tutti i fornitori sono selezionati per conformità GDPR e operano come responsabili del trattamento ai sensi dell'art. 28 del Regolamento.
            </Para>
          </Section>

          <Section icon={Database} title="Conservazione dei Dati">
            <List items={[
              "Dati dell'account: fino alla cancellazione dell'account",
              "Annunci e contenuti: fino alla rimozione da parte dell'utente o dell'amministratore",
              "Log tecnici: massimo 90 giorni",
              "Dati di backup: massimo 30 giorni aggiuntivi",
            ]} />
          </Section>

          <Section icon={Shield} title="I Tuoi Diritti (Art. 15–22 GDPR)">
            <Para>In qualità di interessato hai diritto a:</Para>
            <List items={[
              "Accesso: ottenere una copia dei tuoi dati personali che trattiamo",
              "Rettifica: correggere i dati inesatti o incompleti",
              "Cancellazione (diritto all'oblio): richiedere la cancellazione dei tuoi dati",
              "Limitazione: richiedere la sospensione del trattamento in determinati casi",
              "Portabilità: ricevere i tuoi dati in formato strutturato e leggibile da macchina",
              "Opposizione: opporti al trattamento basato sul legittimo interesse",
              "Reclamo: presentare reclamo al Garante per la Protezione dei Dati Personali (www.gpdp.it)",
            ]} />
            <Para>
              Per esercitare i tuoi diritti scrivi a <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary font-bold hover:underline">{CONTACT_EMAIL}</a>. 
              Risponderemo entro 30 giorni come previsto dal GDPR.
            </Para>
          </Section>

          <Section icon={Cookie} title="Cookie">
            <Para>
              Utilizziamo cookie tecnici necessari al funzionamento del sito. Per informazioni dettagliate consulta la nostra{" "}
              <Link href="/cookie-policy" className="text-primary font-bold hover:underline">Cookie Policy</Link>.
            </Para>
          </Section>

          <Section icon={Trash2} title="Cancellazione Account">
            <Para>
              Puoi richiedere la cancellazione del tuo account e di tutti i dati associati in qualsiasi momento scrivendo a{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary font-bold hover:underline">{CONTACT_EMAIL}</a>.
              Provvederemo entro 30 giorni.
            </Para>
            <Para>
              Tieni presente che alcuni dati (es. messaggi nel forum) potrebbero essere anonimizzati anziché eliminati per preservare il contesto delle discussioni.
            </Para>
          </Section>

          <Section icon={Mail} title="Contatti">
            <Para>
              Per qualsiasi domanda relativa a questa Privacy Policy o al trattamento dei tuoi dati personali contattaci:
            </Para>
            <List items={[
              `Email: ${CONTACT_EMAIL}`,
              "Garante Privacy IT: www.gpdp.it",
            ]} />
          </Section>
        </div>

        <div className="mt-10 pt-6 border-t border-foreground/10 text-xs text-foreground/40 font-medium text-center">
          RomaNex · {LAST_UPDATED} · <Link href="/cookie-policy" className="hover:text-foreground/60 underline">Cookie Policy</Link> · <Link href="/note-legali" className="hover:text-foreground/60 underline">Note Legali</Link>
        </div>
      </div>
    </div>
  );
}
