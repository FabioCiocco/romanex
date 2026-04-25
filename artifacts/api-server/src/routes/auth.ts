import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { sendPasswordResetEmail, sendWelcomeEmail } from "../lib/email";
import crypto from "crypto";

const router = Router();

const ADMIN_EMAILS = () =>
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email e password obbligatorie" });
    if (password.length < 8)
      return res.status(400).json({ error: "PASSWORD_TOO_SHORT" });

    const existing = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1);
    if (existing.length > 0)
      return res.status(409).json({ error: "EMAIL_TAKEN" });

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db
      .insert(usersTable)
      .values({ email: email.toLowerCase(), passwordHash })
      .returning({ id: usersTable.id, email: usersTable.email });

    const isAdmin = ADMIN_EMAILS().includes(user.email.toLowerCase());
    req.session.userId = user.id;
    req.session.isAdmin = isAdmin;

    sendWelcomeEmail({ to: user.email }).catch(() => {});

    return res.status(201).json({ id: user.id, email: user.email, isAdmin });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email e password obbligatorie" });

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1);

    if (!user || !(await bcrypt.compare(password, user.passwordHash)))
      return res.status(401).json({ error: "INVALID_CREDENTIALS" });

    const isAdmin = ADMIN_EMAILS().includes(user.email.toLowerCase());
    req.session.userId = user.id;
    req.session.isAdmin = isAdmin;

    return res.json({ id: user.id, email: user.email, isAdmin });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    return res.json({ ok: true });
  });
});

router.get("/me", async (req, res) => {
  if (!req.session?.userId)
    return res.status(401).json({ error: "Non autenticato" });

  const [user] = await db
    .select({ id: usersTable.id, email: usersTable.email })
    .from(usersTable)
    .where(eq(usersTable.id, req.session.userId))
    .limit(1);

  if (!user) {
    req.session.destroy(() => {});
    return res.status(401).json({ error: "Non autenticato" });
  }

  const isAdmin = ADMIN_EMAILS().includes(user.email.toLowerCase());
  return res.json({ id: user.id, email: user.email, isAdmin });
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email obbligatoria" });

    const [user] = await db
      .select({ id: usersTable.id, email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.email, email.toLowerCase()))
      .limit(1);

    if (!user) return res.json({ ok: true });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000);

    await db
      .update(usersTable)
      .set({ resetToken: token, resetTokenExpires: expires })
      .where(eq(usersTable.id, user.id));

    await sendPasswordResetEmail({ to: user.email, token });

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res.status(400).json({ error: "Token e password obbligatori" });
    if (password.length < 8)
      return res.status(400).json({ error: "PASSWORD_TOO_SHORT" });

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.resetToken, token))
      .limit(1);

    if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date())
      return res.status(400).json({ error: "TOKEN_INVALID" });

    const passwordHash = await bcrypt.hash(password, 12);
    await db
      .update(usersTable)
      .set({ passwordHash, resetToken: null, resetTokenExpires: null })
      .where(eq(usersTable.id, user.id));

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server" });
  }
});

router.get("/bootstrap", async (req, res) => {
  const setupToken = process.env.ADMIN_SETUP_TOKEN;
  if (!setupToken || req.query.token !== setupToken) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.length === 0) {
    return res.status(400).json({ error: "ADMIN_EMAILS non configurato" });
  }

  const defaultPassword = "RomaNex2025!";
  const passwordHash = await bcrypt.hash(defaultPassword, 12);
  const results: { email: string; action: string }[] = [];

  for (const email of adminEmails) {
    const [existing] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (existing) {
      await db
        .update(usersTable)
        .set({ passwordHash })
        .where(eq(usersTable.id, existing.id));
      results.push({ email, action: "password_reset" });
    } else {
      await db.insert(usersTable).values({
        id: crypto.randomUUID(),
        email,
        passwordHash,
      });
      results.push({ email, action: "created" });
    }
  }

  return res.json({ ok: true, results, password: defaultPassword });
});

export { router as authRouter };
