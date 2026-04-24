import nodemailer from "nodemailer";
import { logger } from "./logger";

const BREVO_SMTP_LOGIN = process.env["BREVO_SMTP_LOGIN"];
const BREVO_SMTP_KEY   = process.env["BREVO_SMTP_KEY"];
const FROM_EMAIL = "noreply@romanex.it";
const FROM_NAME  = "RomaNex";

function createTransporter() {
  if (!BREVO_SMTP_LOGIN || !BREVO_SMTP_KEY) return null;
  return nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: { user: BREVO_SMTP_LOGIN, pass: BREVO_SMTP_KEY },
  });
}

export interface WelcomeEmailData {
  to: string;
  nome: string;
  universita: string;
  corsoDiLaurea: string;
}

function buildWelcomeHtml(data: WelcomeEmailData): string {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Benvenuto su RomaNex</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #f0eff8; font-family: 'Space Grotesk', Arial, sans-serif; color: #0d0f1a; }
  </style>
</head>
<body style="background:#f0eff8; padding: 32px 16px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto;">
    <tr>
      <td>

        <!-- Header brand -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0f1a; border:3px solid #0d0f1a; border-bottom:none;">
          <tr>
            <td style="padding:24px 32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#6d28d9; padding:10px; border-radius:12px; transform:rotate(3deg);">
                    <img src="https://api.iconify.design/lucide:graduation-cap.svg?color=white&width=28&height=28" width="28" height="28" alt="cap" style="display:block;" />
                  </td>
                  <td style="padding-left:12px;">
                    <span style="font-family:'Space Grotesk',Arial,sans-serif; font-size:28px; font-weight:900; color:#ffffff; letter-spacing:-1px; text-transform:uppercase;">
                      Roma<span style="color:#f59e0b;">Nex</span>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Hero accent bar -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#6d28d9; border-left:3px solid #0d0f1a; border-right:3px solid #0d0f1a;">
          <tr>
            <td style="padding:32px 32px 28px;">
              <p style="font-family:'Space Grotesk',Arial,sans-serif; font-size:13px; font-weight:700; color:#e9d5ff; text-transform:uppercase; letter-spacing:2px; margin-bottom:10px;">
                🎉 Benvenuto nella community
              </p>
              <h1 style="font-family:'Space Grotesk',Arial,sans-serif; font-size:34px; font-weight:900; color:#ffffff; letter-spacing:-1px; text-transform:uppercase; line-height:1.1; margin-bottom:0;">
                Ciao, ${data.nome}!
              </h1>
            </td>
          </tr>
        </table>

        <!-- Main card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff; border:3px solid #0d0f1a; border-top:none; border-bottom:none;">
          <tr>
            <td style="padding:32px;">
              <p style="font-size:16px; font-weight:600; line-height:1.6; color:#0d0f1a; margin-bottom:20px;">
                Il tuo profilo su <strong>RomaNex</strong> è attivo. Ora sei parte della bacheca digitale degli studenti universitari di Roma.
              </p>

              <!-- Profile recap box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ff; border:2px solid #6d28d9; border-radius:12px; margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:#6d28d9; margin-bottom:12px;">Il tuo profilo</p>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;">
                          <span style="font-size:13px; color:#6b7280; font-weight:600; min-width:120px; display:inline-block;">🎓 Università</span>
                          <span style="font-size:13px; font-weight:700; color:#0d0f1a;">${data.universita}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;">
                          <span style="font-size:13px; color:#6b7280; font-weight:600; min-width:120px; display:inline-block;">📚 Corso</span>
                          <span style="font-size:13px; font-weight:700; color:#0d0f1a;">${data.corsoDiLaurea}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- What you can do -->
              <p style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:1.5px; color:#0d0f1a; margin-bottom:14px;">Cosa puoi fare su RomaNex</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                ${[
                  ["🏠", "Case e Stanze", "Trova stanze in affitto vicino al tuo ateneo"],
                  ["📖", "Libri di Testo", "Compra e vendi libri universitari usati"],
                  ["🧑‍🏫", "Ripetizioni", "Cerca o offri ripetizioni nelle tue materie"],
                  ["💡", "Consigli", "Consigli su esami, docenti e vita universitaria"],
                  ["👥", "Gruppi Studio", "Trova compagni di studio nella tua facoltà"],
                  ["💬", "Forum", "Partecipa alle discussioni della community"],
                ].map(([icon, title, desc]) => `
                <tr>
                  <td style="padding:8px 0; border-bottom:1px solid #f0eff8;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:18px; width:32px; vertical-align:top; padding-top:2px;">${icon}</td>
                        <td style="padding-left:10px;">
                          <p style="font-size:14px; font-weight:800; color:#0d0f1a; margin-bottom:1px;">${title}</p>
                          <p style="font-size:12px; font-weight:500; color:#6b7280;">${desc}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>`).join("")}
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                <tr>
                  <td style="background:#6d28d9; border:3px solid #0d0f1a; box-shadow:4px 4px 0 0 #0d0f1a; border-radius:0;">
                    <a href="https://romanex.it" style="display:inline-block; padding:14px 32px; font-family:'Space Grotesk',Arial,sans-serif; font-size:14px; font-weight:900; color:#ffffff; text-decoration:none; text-transform:uppercase; letter-spacing:1px;">
                      Vai alla Bacheca →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0f1a; border:3px solid #0d0f1a; border-top:none;">
          <tr>
            <td style="padding:20px 32px; text-align:center;">
              <p style="font-size:11px; font-weight:600; color:#6b7280; line-height:1.6;">
                Hai ricevuto questa email perché hai creato un account su RomaNex.<br/>
                © ${new Date().getFullYear()} RomaNex — La bacheca degli universitari romani.<br/>
                <a href="https://romanex.it/note-legali" style="color:#9ca3af; text-decoration:underline;">Note Legali</a>
                &nbsp;·&nbsp;
                <a href="https://romanex.it/diritti-e-inclusione" style="color:#9ca3af; text-decoration:underline;">Diritti & Inclusione</a>
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildWelcomePlainText(data: WelcomeEmailData): string {
  return `Ciao ${data.nome},

Benvenuto su RomaNex! Il tuo profilo è attivo.

Il tuo profilo:
- Università: ${data.universita}
- Corso: ${data.corsoDiLaurea}

Su RomaNex puoi:
🏠 Case e Stanze – trova stanze in affitto vicino al tuo ateneo
📖 Libri – compra e vendi libri universitari usati
🧑‍🏫 Ripetizioni – cerca o offri ripetizioni
💡 Consigli – consigli su esami e vita universitaria
👥 Gruppi Studio – trova compagni di studio
💬 Forum – partecipa alle discussioni della community

Vai alla bacheca: https://romanex.it

© ${new Date().getFullYear()} RomaNex
`;
}

export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) {
    logger.warn("BREVO_SMTP_LOGIN / BREVO_SMTP_KEY not set — skipping welcome email");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: data.to,
      subject: `Benvenuto su RomaNex, ${data.nome}! 🎓`,
      html: buildWelcomeHtml(data),
      text: buildWelcomePlainText(data),
    });
    logger.info({ to: data.to }, "Welcome email sent via Brevo");
  } catch (err) {
    logger.error({ err }, "Exception sending welcome email via Brevo");
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
<head>
  <meta charset="UTF-8" />
  <title>Reset Password RomaNex</title>
</head>
<body style="background:#f0eff8; padding:32px 16px; font-family:Arial,sans-serif; color:#0d0f1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto;">
    <tr>
      <td style="background:#0d0f1a; padding:24px 32px; border:3px solid #0d0f1a;">
        <span style="color:#6d28d9; font-size:24px; font-weight:900; letter-spacing:-1px;">Roma</span><span style="color:#c07a3a; font-size:24px; font-weight:900;">Nex</span>
      </td>
    </tr>
    <tr>
      <td style="background:#fff; border:3px solid #0d0f1a; border-top:none; padding:32px;">
        <h1 style="font-size:22px; font-weight:700; margin-bottom:16px;">Reset della tua password</h1>
        <p style="margin-bottom:24px; line-height:1.6;">Hai richiesto il reset della password. Clicca il bottone qui sotto per impostarne una nuova. Il link scade tra 1 ora.</p>
        <a href="${link}" style="display:inline-block; background:#6d28d9; color:#fff; padding:14px 28px; text-decoration:none; font-weight:700; font-size:16px; border:2px solid #0d0f1a;">REIMPOSTA PASSWORD</a>
        <p style="margin-top:24px; font-size:13px; color:#666;">Se non hai richiesto il reset, ignora questa email.</p>
        <p style="margin-top:8px; font-size:12px; color:#999; word-break:break-all;">Link: ${link}</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) {
    logger.warn("Email transporter not configured — reset email not sent");
    return;
  }
  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: data.to,
      subject: "Reset password RomaNex",
      html: buildResetHtml(data),
      text: `Reimposta la tua password: ${process.env.APP_BASE_URL || "https://romanex.it"}/reset-password?token=${data.token}`,
    });
    logger.info({ to: data.to }, "Password reset email sent");
  } catch (err) {
    logger.error({ err }, "Exception sending password reset email");
  }
}
