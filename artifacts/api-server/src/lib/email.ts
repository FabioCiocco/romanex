import { Resend } from "resend";
import { logger } from "./logger";
import { db, settingsTable } from "@workspace/db";

const RESEND_API_KEY = process.env["RESEND_API_KEY"];
const FROM_EMAIL = "noreply@romanex.it";
const FROM_NAME  = "RomaNex";

const SETTING_DEFAULTS: Record<string, string> = {
  welcome_email_subject: "Benvenuto su RomaNex! 🎓",
  welcome_email_body:
    "Il tuo account su RomaNex è attivo. Ora sei parte della bacheca digitale degli studenti universitari di Roma.",
  welcome_email_cta_text: "Vai alla Bacheca →",
};

async function getSettings(): Promise<Record<string, string>> {
  try {
    const rows = await db.select().from(settingsTable);
    const map: Record<string, string> = { ...SETTING_DEFAULTS };
    for (const row of rows) map[row.key] = row.value;
    return map;
  } catch {
    return { ...SETTING_DEFAULTS };
  }
}

function getResend(): Resend | null {
  if (!RESEND_API_KEY) return null;
  return new Resend(RESEND_API_KEY);
}

export interface WelcomeEmailData {
  to: string;
}

function buildWelcomeHtml(email: string, settings: Record<string, string>): string {
  const body    = settings.welcome_email_body;
  const ctaText = settings.welcome_email_cta_text;
  const year    = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Benvenuto su RomaNex</title>
</head>
<body style="background:#f0eff8; padding:32px 16px; font-family:Arial,sans-serif; color:#0d0f1a; margin:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto;">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0f1a; border:3px solid #0d0f1a; border-bottom:none;">
        <tr><td style="padding:24px 32px;">
          <span style="font-size:28px; font-weight:900; color:#ffffff; letter-spacing:-1px; text-transform:uppercase;">Roma<span style="color:#f59e0b;">Nex</span></span>
        </td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#6d28d9; border-left:3px solid #0d0f1a; border-right:3px solid #0d0f1a;">
        <tr><td style="padding:32px;">
          <p style="font-size:13px; font-weight:700; color:#e9d5ff; text-transform:uppercase; letter-spacing:2px; margin:0 0 10px 0;">🎉 Benvenuto nella community</p>
          <h1 style="font-size:32px; font-weight:900; color:#ffffff; letter-spacing:-1px; text-transform:uppercase; line-height:1.1; margin:0;">Ciao!</h1>
        </td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff; border:3px solid #0d0f1a; border-top:none; border-bottom:none;">
        <tr><td style="padding:32px;">
          <p style="font-size:16px; font-weight:600; line-height:1.7; color:#0d0f1a; margin:0 0 28px 0;">${body}</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            ${[
              ["🏠", "Case e Stanze", "Trova stanze in affitto vicino al tuo ateneo"],
              ["📖", "Libri di Testo", "Compra e vendi libri universitari usati"],
              ["🧑‍🏫", "Ripetizioni", "Cerca o offri ripetizioni nelle tue materie"],
              ["💡", "Consigli", "Consigli su esami, docenti e vita universitaria"],
              ["👥", "Gruppi Studio", "Trova compagni di studio nella tua facoltà"],
              ["💬", "Forum", "Partecipa alle discussioni della community"],
            ].map(([icon, title, desc]) => `
            <tr><td style="padding:8px 0; border-bottom:1px solid #f0eff8;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="font-size:18px; width:32px; vertical-align:top; padding-top:2px;">${icon}</td>
                <td style="padding-left:10px;">
                  <p style="font-size:14px; font-weight:800; color:#0d0f1a; margin:0 0 1px 0;">${title}</p>
                  <p style="font-size:12px; font-weight:500; color:#6b7280; margin:0;">${desc}</p>
                </td>
              </tr></table>
            </td></tr>`).join("")}
          </table>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="background:#6d28d9; border:3px solid #0d0f1a; box-shadow:4px 4px 0 0 #0d0f1a;">
              <a href="https://romanex.it" style="display:inline-block; padding:14px 32px; font-size:14px; font-weight:900; color:#ffffff; text-decoration:none; text-transform:uppercase; letter-spacing:1px;">${ctaText}</a>
            </td></tr>
          </table>
        </td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0f1a; border:3px solid #0d0f1a; border-top:none;">
        <tr><td style="padding:20px 32px; text-align:center;">
          <p style="font-size:11px; font-weight:600; color:#6b7280; line-height:1.6; margin:0;">
            Hai ricevuto questa email perché hai creato un account su RomaNex con ${email}.<br/>
            © ${year} RomaNex — La bacheca degli universitari romani.<br/>
            <a href="https://romanex.it/note-legali" style="color:#9ca3af; text-decoration:underline;">Note Legali</a>
            &nbsp;·&nbsp;
            <a href="https://romanex.it/diritti-e-inclusione" style="color:#9ca3af; text-decoration:underline;">Diritti &amp; Inclusione</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildWelcomePlainText(email: string, settings: Record<string, string>): string {
  return `${settings.welcome_email_body}

Su RomaNex puoi:
🏠 Case e Stanze – trova stanze in affitto vicino al tuo ateneo
📖 Libri – compra e vendi libri universitari usati
🧑‍🏫 Ripetizioni – cerca o offri ripetizioni
💡 Consigli – consigli su esami e vita universitaria
👥 Gruppi Studio – trova compagni di studio
💬 Forum – partecipa alle discussioni della community

Vai su RomaNex: https://romanex.it

Hai ricevuto questa email perché hai creato un account su RomaNex con ${email}.
© ${new Date().getFullYear()} RomaNex
`;
}

export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
  const resend = getResend();
  if (!resend) {
    logger.warn("RESEND_API_KEY non configurata — welcome email non inviata");
    return;
  }
  const settings = await getSettings();
  try {
    const { error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: data.to,
      subject: settings.welcome_email_subject,
      html: buildWelcomeHtml(data.to, settings),
      text: buildWelcomePlainText(data.to, settings),
    });
    if (error) logger.error({ error }, "Resend errore welcome email");
    else logger.info({ to: data.to }, "Welcome email inviata via Resend");
  } catch (err) {
    logger.error({ err }, "Eccezione invio welcome email");
  }
}

export interface PasswordResetEmailData {
  to: string;
  token: string;
}

function buildResetHtml(data: PasswordResetEmailData): string {
  const baseUrl = process.env.APP_BASE_URL || "https://romanex.it";
  const link = `${baseUrl}/reset-password?token=${data.token}`;
  return `<!DOCTYPE html>
<html lang="it">
<head><meta charset="UTF-8" /><title>Reset Password RomaNex</title></head>
<body style="background:#f0eff8; padding:32px 16px; font-family:Arial,sans-serif; color:#0d0f1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto;">
    <tr><td style="background:#0d0f1a; padding:24px 32px; border:3px solid #0d0f1a;">
      <span style="color:#ffffff; font-size:24px; font-weight:900; letter-spacing:-1px;">Roma<span style="color:#f59e0b;">Nex</span></span>
    </td></tr>
    <tr><td style="background:#fff; border:3px solid #0d0f1a; border-top:none; padding:32px;">
      <h1 style="font-size:22px; font-weight:700; margin-bottom:16px;">Reset della tua password</h1>
      <p style="margin-bottom:24px; line-height:1.6;">Hai richiesto il reset della password. Clicca il bottone qui sotto per impostarne una nuova. Il link scade tra 1 ora.</p>
      <a href="${link}" style="display:inline-block; background:#6d28d9; color:#fff; padding:14px 28px; text-decoration:none; font-weight:700; font-size:16px; border:2px solid #0d0f1a;">REIMPOSTA PASSWORD</a>
      <p style="margin-top:24px; font-size:13px; color:#666;">Se non hai richiesto il reset, ignora questa email.</p>
      <p style="margin-top:8px; font-size:12px; color:#999; word-break:break-all;">Link: ${link}</p>
    </td></tr>
  </table>
</body>
</html>`;
}

export interface ContactNotificationData {
  ownerEmail: string;
  richiedenteName: string;
  richiedenteEmail: string;
  annuncioTitolo: string;
  annuncioId: number;
  categoria: string;
}

function buildContactNotificationHtml(data: ContactNotificationData): string {
  const baseUrl = process.env.APP_BASE_URL || "https://romanex.it";
  const link = `${baseUrl}/annunci/${data.annuncioId}`;
  const categoriaIcon: Record<string, string> = {
    appartamenti: "🏠", libri: "📖", ripetizioni: "🧑‍🏫",
    consigli: "💡", "gruppi-studio": "👥",
  };
  const icon = categoriaIcon[data.categoria] ?? "📣";
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Richiesta per il tuo annuncio — RomaNex</title>
</head>
<body style="background:#f0eff8; padding:32px 16px; font-family:Arial,sans-serif; color:#0d0f1a; margin:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto;">
    <tr><td>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0f1a; border:3px solid #0d0f1a; border-bottom:none;">
        <tr><td style="padding:24px 32px;">
          <span style="font-size:28px; font-weight:900; color:#ffffff; letter-spacing:-1px; text-transform:uppercase;">Roma<span style="color:#f59e0b;">Nex</span></span>
        </td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#6d28d9; border-left:3px solid #0d0f1a; border-right:3px solid #0d0f1a;">
        <tr><td style="padding:32px;">
          <p style="font-size:13px; font-weight:700; color:#e9d5ff; text-transform:uppercase; letter-spacing:2px; margin:0 0 10px 0;">${icon} Nuovo interesse al tuo annuncio</p>
          <h1 style="font-size:28px; font-weight:900; color:#ffffff; letter-spacing:-1px; text-transform:uppercase; line-height:1.15; margin:0;">Qualcuno è interessato!</h1>
        </td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff; border:3px solid #0d0f1a; border-top:none; border-bottom:none;">
        <tr><td style="padding:32px;">
          <p style="font-size:16px; font-weight:600; line-height:1.7; color:#0d0f1a; margin:0 0 24px 0;">
            Un utente ha visualizzato il contatto del tuo annuncio su <strong>RomaNex</strong> e potrebbe contattarti presto.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f7ff; border:2px solid #0d0f1a; margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <p style="font-size:11px; font-weight:800; color:#6d28d9; text-transform:uppercase; letter-spacing:2px; margin:0 0 6px 0;">Il tuo annuncio</p>
              <p style="font-size:16px; font-weight:800; color:#0d0f1a; margin:0 0 4px 0;">${data.annuncioTitolo}</p>
              <p style="font-size:12px; color:#6b7280; margin:0;">${icon} ${data.categoria}</p>
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f7ff; border:2px solid #0d0f1a; margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <p style="font-size:11px; font-weight:800; color:#6d28d9; text-transform:uppercase; letter-spacing:2px; margin:0 0 12px 0;">Chi è interessato</p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:13px; font-weight:700; color:#374151; width:90px;">Nome:</td>
                  <td style="font-size:13px; font-weight:600; color:#0d0f1a;">${data.richiedenteName}</td>
                </tr>
                <tr>
                  <td style="font-size:13px; font-weight:700; color:#374151; padding-top:6px;">Email:</td>
                  <td style="font-size:13px; font-weight:600; color:#0d0f1a; padding-top:6px;">
                    <a href="mailto:${data.richiedenteEmail}" style="color:#6d28d9; text-decoration:underline;">${data.richiedenteEmail}</a>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
          <table cellpadding="0" cellspacing="0">
            <tr><td style="background:#6d28d9; border:3px solid #0d0f1a; box-shadow:4px 4px 0 0 #0d0f1a;">
              <a href="${link}" style="display:inline-block; padding:14px 32px; font-size:14px; font-weight:900; color:#ffffff; text-decoration:none; text-transform:uppercase; letter-spacing:1px;">Vedi il tuo annuncio →</a>
            </td></tr>
          </table>
        </td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0f1a; border:3px solid #0d0f1a; border-top:none;">
        <tr><td style="padding:20px 32px; text-align:center;">
          <p style="font-size:11px; font-weight:600; color:#6b7280; line-height:1.6; margin:0;">
            Hai ricevuto questa email perché hai pubblicato un annuncio su RomaNex.<br/>
            © ${year} RomaNex — La bacheca degli universitari romani.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendContactNotificationEmail(data: ContactNotificationData): Promise<void> {
  const resend = getResend();
  if (!resend) {
    logger.warn("RESEND_API_KEY non configurata — notifica contatto non inviata");
    return;
  }
  try {
    const { error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: data.ownerEmail,
      replyTo: data.richiedenteEmail,
      subject: `Qualcuno è interessato al tuo annuncio: "${data.annuncioTitolo}"`,
      html: buildContactNotificationHtml(data),
      text: `Qualcuno ha visualizzato il contatto del tuo annuncio "${data.annuncioTitolo}" su RomaNex.\n\nNome: ${data.richiedenteName}\nEmail: ${data.richiedenteEmail}\n\nVedi l'annuncio: ${process.env.APP_BASE_URL || "https://romanex.it"}/annunci/${data.annuncioId}`,
    });
    if (error) logger.error({ error }, "Resend errore notifica contatto");
    else logger.info({ to: data.ownerEmail, annuncioId: data.annuncioId }, "Notifica contatto inviata via Resend");
  } catch (err) {
    logger.error({ err }, "Eccezione invio notifica contatto");
  }
}

export async function sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void> {
  const resend = getResend();
  if (!resend) {
    logger.warn("RESEND_API_KEY non configurata — email reset non inviata");
    return;
  }
  try {
    const { error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: data.to,
      subject: "Reset password RomaNex",
      html: buildResetHtml(data),
      text: `Reimposta la tua password: ${process.env.APP_BASE_URL || "https://romanex.it"}/reset-password?token=${data.token}`,
    });
    if (error) logger.error({ error }, "Resend errore email reset");
    else logger.info({ to: data.to }, "Email reset password inviata via Resend");
  } catch (err) {
    logger.error({ err }, "Eccezione invio email reset password");
  }
}
