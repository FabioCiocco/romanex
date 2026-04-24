import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useGetMyProfile, useUpsertMyProfile, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  User, GraduationCap, Phone, Mail, BookOpen, CheckCircle2,
  AtSign, AlertCircle, LogOut, Loader2, Check,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const ANNI_OPTIONS_FALLBACK = [
  "1° Anno", "2° Anno", "3° Anno", "4° Anno", "5° Anno",
  "Magistrale 1°", "Magistrale 2°", "Dottorato", "Fuori corso",
];

const USERNAME_REGEX = /^[a-z0-9_]{3,30}$/;

type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function Profilo() {
  const { t } = useLanguage();
  const tp = t.profilo;
  const { user, isLoaded, isSignedIn, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [universita, setUniversita] = useState("");
  const [annoCorso, setAnnoCorso] = useState("");
  const [corsoDiLaurea, setCorsoDiLaurea] = useState("");
  const [telefono, setTelefono] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: profile } = useGetMyProfile({
    query: { queryKey: getGetMyProfileQueryKey(), enabled: isSignedIn && isLoaded, retry: false },
  });

  const mutation = useUpsertMyProfile({
    mutation: {
      onSuccess: () => {
        setSaveStatus("saved");
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => setSaveStatus("idle"), 3000);
      },
      onError: (err: unknown) => {
        const body = (err as { response?: { data?: { error?: string } } })?.response?.data;
        setSaveStatus("error");
        if (body?.error === "USERNAME_TAKEN") {
          setUsernameError(tp.usernameTaken);
        } else if (body?.error === "USERNAME_INVALID") {
          setUsernameError(tp.usernameInvalid);
        } else {
          toast({ title: tp.saveError, variant: "destructive" });
        }
      },
    },
  });

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setNome(profile.nome || "");
      setCognome(profile.cognome || "");
      setEmail(profile.email || "");
      setUniversita(profile.universita || "");
      setAnnoCorso(profile.annoCorso || "");
      setCorsoDiLaurea(profile.corsoDiLaurea || "");
      setTelefono(profile.telefono || "");
    } else if (user && isLoaded) {
      setEmail(user.email || "");
    }
  }, [profile, user, isLoaded]);

  if (!isLoaded) return null;
  if (!isSignedIn) {
    setLocation("/sign-in");
    return null;
  }

  const handleUsernameChange = (val: string) => {
    const clean = val.toLowerCase().replace(/\s/g, "");
    setUsername(clean);
    if (clean && !USERNAME_REGEX.test(clean)) {
      setUsernameError(tp.usernameInvalid);
    } else {
      setUsernameError("");
    }
  };

  const isSaveable =
    !!username && USERNAME_REGEX.test(username) && !usernameError &&
    !!nome && !!cognome && !!universita && !!annoCorso && !!corsoDiLaurea;

  const autoSave = useCallback(() => {
    if (!isSaveable || mutation.isPending) return;
    setSaveStatus("saving");
    mutation.mutate({
      data: { username, nome, cognome, email, universita, annoCorso, corsoDiLaurea, telefono: telefono || null },
    });
  }, [isSaveable, mutation, username, nome, cognome, email, universita, annoCorso, corsoDiLaurea, telefono]);

  const anni: string[] = Array.isArray(tp.anni) ? [...tp.anni as string[]] : ANNI_OPTIONS_FALLBACK;

  const completenessFields = [username, nome, cognome, universita, annoCorso, corsoDiLaurea];
  const filled = completenessFields.filter(Boolean).length;
  const completeness = Math.round((filled / completenessFields.length) * 100);
  const isComplete = completeness === 100;

  const initials = `${nome?.[0] ?? ""}${cognome?.[0] ?? ""}`.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?";

  const inputClass = "w-full border-2 border-foreground rounded-xl px-3 py-2.5 text-sm font-medium bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-shadow";
  const labelClass = "block text-xs font-black uppercase tracking-wider mb-1.5 flex items-center gap-1";

  const handleSignOut = async () => {
    await logout();
    qc.clear();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* ── HERO ────────────────────────────────────────── */}
          <div className="border-4 border-foreground shadow-[6px_6px_0_0_hsl(var(--foreground))] bg-primary overflow-hidden rounded-2xl">
            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">

                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-full border-4 border-white/30 bg-white/20 flex items-center justify-center overflow-hidden">
                    <span className="text-2xl font-black text-white font-display">{initials}</span>
                  </div>
                  {isComplete && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-400 border-2 border-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Name + info */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight truncate">
                    {nome && cognome ? `${nome} ${cognome}` : tp.pageTitle as string}
                  </h1>
                  {username && (
                    <p className="text-white/70 font-bold text-sm mt-0.5">@{username}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {universita && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/20 text-white border border-white/30 px-2.5 py-1 rounded-full">
                        <GraduationCap className="w-3 h-3" /> {universita}
                      </span>
                    )}
                    {annoCorso && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/20 text-white border border-white/30 px-2.5 py-1 rounded-full">
                        {annoCorso}
                      </span>
                    )}
                    {corsoDiLaurea && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/20 text-white border border-white/30 px-2.5 py-1 rounded-full">
                        <BookOpen className="w-3 h-3" /> {corsoDiLaurea}
                      </span>
                    )}
                    {profile?.createdAt && (
                      <span className="text-xs text-white/50 font-medium">
                        {tp.memberSince as string} {new Date(profile.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Save status badge */}
                <div className="shrink-0">
                  {saveStatus === "saving" && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 text-white border border-white/30 px-3 py-1.5 rounded-full">
                      <Loader2 className="w-3 h-3 animate-spin" /> {tp.autoSaving}
                    </span>
                  )}
                  {saveStatus === "saved" && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-green-400/30 text-white border border-green-300/40 px-3 py-1.5 rounded-full">
                      <Check className="w-3 h-3" strokeWidth={3} /> {tp.autoSaved}
                    </span>
                  )}
                </div>
              </div>

              {/* Completeness bar */}
              <div className="mt-5">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-white/70 uppercase tracking-wider">{tp.completeness}</span>
                  <span className="text-xs font-black text-white">{completeness}%</span>
                </div>
                <div className="h-2.5 bg-white/20 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${completeness}%`,
                      backgroundColor: completeness === 100 ? "rgb(74 222 128)" : "white",
                    }}
                  />
                </div>
                {!isComplete && (
                  <p className="text-white/50 text-xs font-medium mt-1.5">
                    {tp.profileIncomplete} — {tp.profileIncompleteDesc}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── SEZIONI DATI ─────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Identità */}
            <div className="border-4 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] bg-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-foreground/10">
                <User className="w-4 h-4" />
                <h2 className="text-sm font-black uppercase tracking-wider">{tp.sectionIdentita}</h2>
              </div>

              <div>
                <label className={labelClass}>
                  <AtSign className="w-3 h-3" /> {tp.username as string} <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-sm select-none">@</span>
                  <input
                    className={cn(inputClass, "pl-7", usernameError && "border-destructive focus:ring-destructive")}
                    placeholder={tp.usernamePh as string}
                    value={username}
                    onChange={e => handleUsernameChange(e.target.value)}
                    onBlur={autoSave}
                    autoComplete="username"
                    maxLength={30}
                  />
                </div>
                {usernameError ? (
                  <p className="text-xs text-destructive font-bold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {usernameError}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">{tp.usernameHint as string}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>{tp.nome as string} <span className="text-destructive">*</span></label>
                  <input
                    className={inputClass}
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    onBlur={autoSave}
                  />
                </div>
                <div>
                  <label className={labelClass}>{tp.cognome as string} <span className="text-destructive">*</span></label>
                  <input
                    className={inputClass}
                    value={cognome}
                    onChange={e => setCognome(e.target.value)}
                    onBlur={autoSave}
                  />
                </div>
              </div>

              <div>
                <label className={cn(labelClass)}>
                  <Mail className="w-3 h-3" /> {tp.email as string}
                </label>
                <input
                  className={cn(inputClass, "bg-muted text-muted-foreground cursor-not-allowed border-foreground/30")}
                  value={email}
                  readOnly
                  tabIndex={-1}
                />
              </div>
            </div>

            {/* Università */}
            <div className="border-4 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] bg-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-foreground/10">
                <GraduationCap className="w-4 h-4" />
                <h2 className="text-sm font-black uppercase tracking-wider">{tp.sectionUniversita}</h2>
              </div>

              <div>
                <label className={labelClass}>
                  {tp.universita as string} <span className="text-destructive">*</span>
                </label>
                <input
                  className={inputClass}
                  placeholder={tp.universitaPlaceholder as string}
                  value={universita}
                  onChange={e => setUniversita(e.target.value)}
                  onBlur={autoSave}
                />
              </div>

              <div>
                <label className={labelClass}>
                  {tp.annoCorso as string} <span className="text-destructive">*</span>
                </label>
                <select
                  className={inputClass}
                  value={annoCorso}
                  onChange={e => setAnnoCorso(e.target.value)}
                  onBlur={autoSave}
                >
                  <option value="">—</option>
                  {anni.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  <BookOpen className="w-3 h-3" /> {tp.corsoDiLaurea as string} <span className="text-destructive">*</span>
                </label>
                <input
                  className={inputClass}
                  placeholder={tp.corsoDiLaureaPh as string}
                  value={corsoDiLaurea}
                  onChange={e => setCorsoDiLaurea(e.target.value)}
                  onBlur={autoSave}
                />
              </div>

              {isComplete && (
                <div className="flex items-center gap-2 pt-1">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span className="text-xs font-bold text-green-700 uppercase tracking-wide">{tp.profileComplete as string}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contatti */}
          <div className="border-4 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] bg-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-foreground/10">
              <Phone className="w-4 h-4" />
              <h2 className="text-sm font-black uppercase tracking-wider">{tp.sectionContatti}</h2>
            </div>
            <div>
              <label className={labelClass}>
                <Phone className="w-3 h-3" /> {tp.telefono as string}
              </label>
              <input
                className={inputClass}
                placeholder={tp.telefonoPh as string}
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                onBlur={autoSave}
              />
              <p className="text-xs text-muted-foreground mt-1.5">{tp.telefonoHint as string}</p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleSignOut}
            className={cn(
              "w-full flex items-center justify-center gap-2.5 border-4 border-destructive shadow-[4px_4px_0_0_hsl(var(--destructive))]",
              "font-black uppercase tracking-wider py-3.5 text-base transition-all rounded-xl",
              "hover:shadow-[2px_2px_0_0_hsl(var(--destructive))] hover:translate-x-[2px] hover:translate-y-[2px]",
              "bg-destructive text-destructive-foreground",
            )}
          >
            <LogOut className="w-5 h-5" strokeWidth={2.5} />
            {t.nav.signOut}
          </button>

        </div>
      </main>

      <Footer />
    </div>
  );
}
