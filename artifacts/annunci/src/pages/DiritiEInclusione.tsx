import { Link } from "wouter";
import {
  ArrowLeft, Heart, ShieldCheck, Phone, ExternalLink,
  Users, Megaphone, BookOpen, AlertTriangle, Rainbow
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

function Section({
  icon: Icon,
  title,
  accent = false,
  children,
}: {
  icon: React.ElementType;
  title: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="border-2 border-foreground rounded-2xl overflow-hidden shadow-[4px_4px_0_0_hsl(var(--foreground))]">
      <div
        className={`px-6 py-4 flex items-center gap-3 ${accent ? "bg-accent text-accent-foreground" : "bg-foreground text-background"}`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
        <h2 className="font-display font-black text-lg uppercase tracking-wide">{title}</h2>
      </div>
      <div className="p-6 space-y-4 bg-card">{children}</div>
    </section>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-relaxed text-foreground/80 font-medium">{children}</p>;
}

function ResourceCard({
  name,
  desc,
  tel,
  url,
  tag,
  tagColor = "bg-primary/10 text-primary border-primary/20",
}: {
  name: string;
  desc: string;
  tel?: string;
  url?: string;
  tag: string;
  tagColor?: string;
}) {
  const { t } = useLanguage();
  return (
    <div className="border-2 border-foreground/10 rounded-xl p-4 space-y-2 hover:border-foreground/30 transition-colors bg-background/50">
      <div className="flex items-start justify-between gap-3">
        <p className="font-display font-black text-base text-foreground leading-tight">{name}</p>
        <span className={`flex-shrink-0 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tagColor}`}>
          {tag}
        </span>
      </div>
      <p className="text-xs text-foreground/60 font-medium leading-relaxed">{desc}</p>
      <div className="flex flex-wrap gap-3 pt-1">
        {tel && (
          <a
            href={`tel:${tel.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <Phone className="w-3 h-3" strokeWidth={2.5} />
            {tel}
          </a>
        )}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground/50 hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            {t.footer.website}
          </a>
        )}
      </div>
    </div>
  );
}

export default function DiritiEInclusione() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 border border-accent/30 rounded-full text-xs font-bold uppercase tracking-wider text-accent-foreground">
            <Heart className="w-3.5 h-3.5 fill-current" strokeWidth={2} />
            {ft.inclusion}
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl uppercase tracking-tight text-foreground leading-none">
            Diritti &<br />
            <span className="text-primary">Inclusione</span>
          </h1>
          <p className="text-base text-foreground/60 font-medium max-w-xl leading-relaxed">
            RomaNex è uno spazio sicuro. Qui trovi risorse, numeri utili e le nostre politiche di
            tutela per studentesse, studenti LGBTQ+ e chiunque abbia bisogno di supporto.
          </p>
        </div>

        <div className="space-y-5">
          <Section icon={ShieldCheck} title="La nostra posizione">
            <Para>
              RomaNex condanna ogni forma di discriminazione, molestia e violenza basata su genere,
              orientamento sessuale, identità di genere, provenienza, religione o qualsiasi altra
              caratteristica personale.
            </Para>
            <Para>
              La piattaforma è uno spazio universitario inclusivo: ogni studente ha il diritto di
              parteciparvi liberamente e in sicurezza. Annunci, messaggi o post che veicolino
              contenuti discriminatori, omofobi, misogini o di incitamento all'odio vengono rimossi
              immediatamente e possono comportare la sospensione dell'account.
            </Para>
          </Section>

          <Section icon={Users} title="Diritti delle donne" accent>
            <Para>
              Ogni persona ha diritto a uno spazio universitario libero da molestie, sessismo e
              discriminazioni di genere. Ecco le principali risorse attive a Roma e a livello nazionale.
            </Para>

            <div className="space-y-3 pt-1">
              <ResourceCard
                tag="Emergenza"
                tagColor="bg-red-500/10 text-red-600 border-red-200"
                name="1522 — Antiviolenza e Stalking"
                desc="Numero gratuito attivo 24h/24, 7 giorni su 7. Supporto psicologico e legale per donne vittime di violenza o stalking. Risponde in italiano, inglese, francese, spagnolo e arabo."
                tel="1522"
                url="https://www.1522.eu"
              />
              <ResourceCard
                tag="Roma"
                name="D.i.Re — Donne in Rete contro la violenza"
                desc="Rete nazionale di centri antiviolenza. A Roma sono presenti numerosi centri affiliati con sportelli di ascolto, supporto legale e alloggi sicuri."
                url="https://www.direcontrolaviolenza.it"
              />
              <ResourceCard
                tag="Roma"
                name="UDI Roma — Unione Donne in Italia"
                desc="Associazione femminista che offre sportelli legali gratuiti, gruppi di mutuo aiuto e iniziative culturali per studentesse."
                url="https://udiroma.it"
              />
              <ResourceCard
                tag="Università"
                name="CUG — Comitato Unico di Garanzia"
                desc="Ogni ateneo romano è dotato di un CUG che si occupa di benessere, pari opportunità e contrasto alle discriminazioni di genere nei confronti di studentesse e personale."
              />
              <ResourceCard
                tag="Online"
                name="Telefono Rosa"
                desc="Sportello telefonico e online per vittime di violenza di genere, stalking e molestie. Offre consulenza legale e psicologica gratuita."
                tel="06 37 51 82 01"
                url="https://www.telefonorosa.it"
              />
            </div>
          </Section>

          <Section icon={Rainbow} title="Diritti LGBTQ+">
            <Para>
              RomaNex riconosce e sostiene il diritto di ogni persona a vivere liberamente la propria
              identità di genere e il proprio orientamento sessuale, senza timore di discriminazioni
              o violenze.
            </Para>

            <div className="space-y-3 pt-1">
              <ResourceCard
                tag="Emergenza"
                tagColor="bg-violet-500/10 text-violet-600 border-violet-200"
                name="Sportello Discriminazioni — Arcigay Roma"
                desc="Supporto psicologico e legale gratuito per persone LGBTQ+ vittime di discriminazioni, violenza o difficoltà familiari. Sede a Roma con appuntamenti in presenza e online."
                tel="06 64 15 03 11"
                url="https://www.arcigayroma.it"
              />
              <ResourceCard
                tag="Nazionale"
                name="Arcigay Nazionale"
                desc="La principale organizzazione LGBTQ+ italiana con sportelli in oltre 60 città. Offre supporto legale, psicologico e attività culturali."
                url="https://www.arcigay.it"
              />
              <ResourceCard
                tag="Roma"
                name="Circolo Mario Mieli"
                desc="Centro culturale LGBTQ+ romano attivo dal 1983. Offre sportelli di ascolto, supporto psicologico, gruppi di auto-aiuto e iniziative culturali."
                tel="06 54 13 985"
                url="https://www.mariomieli.net"
              />
              <ResourceCard
                tag="Roma"
                name="Associazione Rete Lenford"
                desc="Avvocatura per i diritti LGBTQ+. Consulenza legale gratuita per discriminazioni sul lavoro, in famiglia, nella scuola e nei servizi pubblici."
                url="https://www.retelenford.it"
              />
              <ResourceCard
                tag="Università"
                name="Sportello Trans* e LGBTQ+ negli Atenei"
                desc="Molte università romane dispongono di sportelli dedicati. Rivolgiti alla Segreteria Studenti o al CUG del tuo ateneo per conoscere i servizi disponibili."
              />
            </div>
          </Section>

          <Section icon={Megaphone} title="Segnala sulla piattaforma">
            <Para>
              Se su RomaNex hai ricevuto messaggi molesti, visto annunci discriminatori o sei stato
              vittima di comportamenti inappropriati da parte di altri utenti:
            </Para>
            <ul className="space-y-2 pl-4">
              {[
                "Usa il tasto «Segnala» presente su ogni annuncio e messaggio.",
                "Scrivi a info@romanex.it descrivendo l'accaduto — risponderemo entro 24 ore.",
                "In caso di emergenza, contatta le forze dell'ordine al 112.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80 font-medium">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={BookOpen} title="Risorse informative">
            <div className="space-y-3">
              <ResourceCard
                tag="UNAR"
                name="Ufficio Nazionale Antidiscriminazioni Razziali"
                desc="Ente governativo per la tutela contro le discriminazioni. Sportello gratuito di assistenza legale per chi subisce discriminazioni."
                tel="800 90 10 10"
                url="https://www.unar.it"
              />
              <ResourceCard
                tag="Normativa"
                name="Legge Mancino (L. 205/1993)"
                desc="Punisce atti di discriminazione, violenza e incitamento all'odio fondati su razza, etnia, nazionalità o religione. Estesa in alcuni ambiti alle discriminazioni per orientamento sessuale."
              />
              <ResourceCard
                tag="Normativa"
                name="D.Lgs. 198/2006 — Codice Pari Opportunità"
                desc="Tutela la parità tra uomini e donne nell'accesso all'istruzione, al lavoro e ai servizi. Prevede sanzioni per discriminazioni dirette e indirette."
              />
            </div>
          </Section>

          <div className="border-2 border-accent rounded-2xl p-6 flex items-start gap-4 shadow-[4px_4px_0_0_hsl(var(--foreground))]">
            <AlertTriangle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" strokeWidth={2.5} />
            <div className="space-y-1">
              <p className="font-display font-black text-base uppercase tracking-wide text-foreground">
                Hai bisogno di aiuto ora?
              </p>
              <p className="text-sm text-foreground/70 font-medium leading-relaxed">
                Emergenza: <strong className="text-foreground">112</strong> — Violenza di genere:{" "}
                <strong className="text-foreground">1522</strong> (gratuito, 24h) — LGBTQ+ Roma:{" "}
                <strong className="text-foreground">06 64 15 03 11</strong>
              </p>
            </div>
          </div>
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
