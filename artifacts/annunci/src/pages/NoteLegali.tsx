import { Link } from "wouter";
import { ArrowLeft, Scale, ShieldCheck, FileText, AlertTriangle, Mail, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LAST_UPDATED = "20 aprile 2025";
const CONTACT_EMAIL = "info@romanex.it";

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

export default function NoteLegali() {
  const { t } = useLanguage();
  const ft = t.footer;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b-2 border-foreground bg-card">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground/60 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            RomaNex
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10 max-w-3xl">
        <div className="mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold uppercase tracking-wider text-primary">
            <Scale className="w-3.5 h-3.5" strokeWidth={2.5} />
            {ft.legal}
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl uppercase tracking-tight text-foreground leading-none">
            Note<br /><span className="text-primary">Legali</span>
          </h1>
          <p className="text-sm text-foreground/50 font-medium">
            Ultimo aggiornamento: {LAST_UPDATED}
          </p>
        </div>

        <div className="space-y-5">
          <Section icon={FileText} title="1. Informazioni sul servizio">
            <Para>
              RomaNex è una piattaforma digitale di bacheca virtuale riservata agli studenti universitari
              con sede nelle università di Roma. Il servizio consente la pubblicazione e la consultazione
              di annunci nelle categorie: Case e Stanze, Libri di Testo, Ripetizioni, Consigli, Gruppi
              di Studio e Forum.
            </Para>
            <Para>
              Il servizio è gestito in modo indipendente e non è affiliato ad alcun ateneo romano.
              RomaNex non agisce da intermediario commerciale né da parte venditrice o acquirente in
              alcuna transazione tra utenti.
            </Para>
          </Section>

          <Section icon={FileText} title="2. Termini di utilizzo">
            <Para>Accedendo e utilizzando RomaNex, l'utente accetta integralmente i presenti Termini.</Para>
            <Para>È consentito:</Para>
            <List items={[
              "Pubblicare annunci relativi a stanze/appartamenti, libri, ripetizioni, consigli e gruppi studio.",
              "Contattare altri utenti attraverso le funzioni di messaggistica interna alla piattaforma.",
              "Partecipare al forum rispettando le linee guida della community.",
            ]} />
            <Para>È vietato:</Para>
            <List items={[
              "Pubblicare contenuti falsi, fuorvianti, offensivi, diffamatori o illegali.",
              "Inserire annunci per servizi sessuali, materiale illegale o prodotti contraffatti.",
              "Effettuare spam, phishing o qualsiasi attività di raccolta dati non autorizzata.",
              "Creare account multipli o impersonare altre persone.",
              "Utilizzare il servizio per scopi commerciali non attinenti alla comunità studentesca.",
            ]} />
            <Para>
              RomaNex si riserva il diritto di rimuovere contenuti e sospendere account che violino i
              presenti termini, a propria insindacabile discrezione.
            </Para>
          </Section>

          <Section icon={ShieldCheck} title="3. Privacy e dati personali">
            <Para>
              RomaNex tratta i dati personali degli utenti nel rispetto del Regolamento (UE) 2016/679
              (GDPR) e della normativa italiana in materia di protezione dei dati personali.
            </Para>
            <Para>Dati raccolti:</Para>
            <List items={[
              "Dati di registrazione: nome, cognome, indirizzo e-mail, forniti tramite Clerk (provider di autenticazione).",
              "Dati del profilo studente: ateneo, corso di laurea, anno accademico — inseriti volontariamente dall'utente.",
              "Dati degli annunci: titolo, descrizione, categoria, prezzo, immagini caricate.",
              "Dati di utilizzo: log di accesso, preferenze di lingua, cookie tecnici essenziali.",
            ]} />
            <Para>
              I dati non vengono ceduti a terzi per finalità commerciali. Le immagini caricate sono
              conservate su infrastruttura cloud sicura. L'utente può richiedere la cancellazione del
              proprio account e dei dati associati scrivendo a{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary font-bold hover:underline">
                {CONTACT_EMAIL}
              </a>.
            </Para>
            <Para>
              L'autenticazione è gestita da{" "}
              <a
                href="https://clerk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-bold inline-flex items-center gap-1 hover:underline"
              >
                Clerk Inc. <ExternalLink className="w-3 h-3" />
              </a>{" "}
              — si applicano anche la{" "}
              <a href="https://clerk.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">
                Privacy Policy
              </a>{" "}
              e i{" "}
              <a href="https://clerk.com/terms" target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline">
                Termini di Servizio
              </a>{" "}
              di Clerk.
            </Para>
          </Section>

          <Section icon={AlertTriangle} title="4. Limitazione di responsabilità">
            <Para>
              RomaNex è una piattaforma di intermediazione e non è responsabile per:
            </Para>
            <List items={[
              "Il contenuto degli annunci pubblicati dagli utenti.",
              "Le trattative, i contratti o le transazioni concluse tra utenti.",
              "Eventuali danni derivanti dall'uso o dall'impossibilità di utilizzo del servizio.",
              "L'accuratezza, la completezza o l'aggiornamento delle informazioni presenti nella piattaforma.",
              "Comportamenti fraudolenti o illeciti da parte di terzi.",
            ]} />
            <Para>
              Si raccomanda agli utenti di adottare le normali precauzioni nelle transazioni online:
              verificare l'identità delle controparti, evitare pagamenti anticipati non garantiti,
              preferire incontri in luoghi pubblici per lo scambio di beni fisici.
            </Para>
          </Section>

          <Section icon={FileText} title="5. Proprietà intellettuale">
            <Para>
              Il logo, il nome "RomaNex", il design e i contenuti originali della piattaforma sono di
              proprietà esclusiva di RomaNex. È vietata la riproduzione, la distribuzione o la modifica
              senza autorizzazione scritta.
            </Para>
            <Para>
              I contenuti pubblicati dagli utenti (annunci, immagini, messaggi) restano di proprietà dei
              rispettivi autori. Pubblicandoli su RomaNex, l'utente concede alla piattaforma una licenza
              non esclusiva, gratuita e revocabile per visualizzarli e distribuirli nell'ambito del
              servizio.
            </Para>
          </Section>

          <Section icon={FileText} title="6. Legge applicabile e foro competente">
            <Para>
              I presenti Termini sono regolati dalla legge italiana. Per qualsiasi controversia
              derivante dall'utilizzo di RomaNex è competente in via esclusiva il Tribunale di Roma,
              fatti salvi i diritti dei consumatori previsti dalla normativa vigente.
            </Para>
          </Section>

          <Section icon={Mail} title="7. Contatti">
            <Para>
              Per domande, segnalazioni o richieste relative alla privacy e ai presenti Termini,
              è possibile scrivere a:
            </Para>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-xl border-2 border-foreground font-bold text-sm hover:bg-foreground/90 transition-colors"
            >
              <Mail className="w-4 h-4" strokeWidth={2.5} />
              {CONTACT_EMAIL}
            </a>
          </Section>
        </div>

        <div className="mt-8 pt-6 border-t-2 border-foreground/10 text-center">
          <p className="text-xs text-foreground/40 font-medium uppercase tracking-wider">
            © {new Date().getFullYear()} RomaNex — {t.footer.rights}
          </p>
        </div>
      </div>
    </div>
  );
}
