import { useState, useEffect } from "react";
import { useUser } from "@clerk/react";
import { useLocation } from "wouter";
import { useGetMyProfile, useUpsertMyProfile, getGetMyProfileQueryKey } from "@workspace/api-client-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { User, GraduationCap, Phone, Mail, BookOpen, CheckCircle2, AtSign, AlertCircle } from "lucide-react";

const ANNI_OPTIONS_FALLBACK = [
  "1° Anno", "2° Anno", "3° Anno", "4° Anno", "5° Anno",
  "Magistrale 1°", "Magistrale 2°", "Dottorato", "Fuori corso",
];

const USERNAME_REGEX = /^[a-z0-9_]{3,30}$/;

export default function Profilo() {
  const { t } = useLanguage();
  const tp = t.profilo;
  const { user, isLoaded } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [email, setEmail] = useState("");
  const [universita, setUniversita] = useState("");
  const [annoCorso, setAnnoCorso] = useState("");
  const [corsoDiLaurea, setCorsoDiLaurea] = useState("");
  const [telefono, setTelefono] = useState("");

  const { data: profile } = useGetMyProfile({
    query: { queryKey: getGetMyProfileQueryKey(), enabled: !!user && isLoaded, retry: false },
  });

  const mutation = useUpsertMyProfile({
    mutation: {
      onSuccess: () => {
        toast({ title: tp.savedOk, description: tp.savedOkDesc });
      },
      onError: (err: unknown) => {
        const body = (err as { response?: { data?: { error?: string } } })?.response?.data;
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
      setNome(user.firstName || "");
      setCognome(user.lastName || "");
      setEmail(user.primaryEmailAddress?.emailAddress || "");
    }
  }, [profile, user, isLoaded]);

  if (!isLoaded || !user) {
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

  const anni: string[] = Array.isArray(tp.anni) ? [...tp.anni] : ANNI_OPTIONS_FALLBACK;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && !USERNAME_REGEX.test(username)) {
      setUsernameError(tp.usernameInvalid);
      return;
    }
    mutation.mutate({
      data: {
        username: username || null,
        nome, cognome, email, universita, annoCorso, corsoDiLaurea,
        telefono: telefono || null,
      },
    });
  };

  const isComplete = !!(profile?.universita && profile?.annoCorso && profile?.corsoDiLaurea);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-foreground bg-primary flex items-center justify-center shadow-[4px_4px_0_0_hsl(var(--foreground))]">
              {user.imageUrl ? (
                <img src={user.imageUrl} alt={nome} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight leading-tight">
                {tp.pageTitle}
              </h1>
              {username && (
                <p className="text-sm font-bold text-primary mt-0.5">@{username}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                {isComplete ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase bg-green-100 text-green-700 border-2 border-green-600 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> {tp.profileComplete}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase bg-yellow-100 text-yellow-700 border-2 border-yellow-500 px-2 py-0.5 rounded-full">
                    {tp.profileIncomplete}
                  </span>
                )}
                {profile?.createdAt && (
                  <span className="text-xs text-muted-foreground font-medium">
                    {tp.memberSince} {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-4 border-foreground shadow-[6px_6px_0_0_hsl(var(--foreground))] p-6 bg-card space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5" />
                <h2 className="text-lg font-black uppercase tracking-tight">{tp.editTitle}</h2>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                  <AtSign className="w-3 h-3" /> {tp.username}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-sm select-none">@</span>
                  <input
                    className={cn(
                      "w-full border-2 rounded-xl pl-7 pr-3 py-2 text-sm font-medium bg-background focus:outline-none focus:ring-2 focus:ring-primary",
                      usernameError ? "border-destructive" : "border-foreground",
                    )}
                    placeholder={tp.usernamePh}
                    value={username}
                    onChange={e => handleUsernameChange(e.target.value)}
                    autoComplete="username"
                    maxLength={30}
                  />
                </div>
                {usernameError ? (
                  <p className="text-xs text-destructive font-bold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {usernameError}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">{tp.usernameHint}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">
                    {tp.nome} <span className="text-destructive">*</span>
                  </label>
                  <input
                    className="w-full border-2 border-foreground rounded-xl px-3 py-2 text-sm font-medium bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">
                    {tp.cognome} <span className="text-destructive">*</span>
                  </label>
                  <input
                    className="w-full border-2 border-foreground rounded-xl px-3 py-2 text-sm font-medium bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={cognome}
                    onChange={e => setCognome(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {tp.email}
                </label>
                <input
                  className="w-full border-2 border-foreground rounded-xl px-3 py-2 text-sm font-medium bg-muted text-muted-foreground cursor-not-allowed"
                  value={email}
                  readOnly
                  tabIndex={-1}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> {tp.universita} <span className="text-destructive">*</span>
                </label>
                <input
                  className="w-full border-2 border-foreground rounded-xl px-3 py-2 text-sm font-medium bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={tp.universitaPlaceholder}
                  value={universita}
                  onChange={e => setUniversita(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1">
                    {tp.annoCorso} <span className="text-destructive">*</span>
                  </label>
                  <select
                    className="w-full border-2 border-foreground rounded-xl px-3 py-2 text-sm font-medium bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={annoCorso}
                    onChange={e => setAnnoCorso(e.target.value)}
                    required
                  >
                    <option value="">—</option>
                    {anni.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {tp.corsoDiLaurea} <span className="text-destructive">*</span>
                  </label>
                  <input
                    className="w-full border-2 border-foreground rounded-xl px-3 py-2 text-sm font-medium bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={tp.corsoDiLaureaPh}
                    value={corsoDiLaurea}
                    onChange={e => setCorsoDiLaurea(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {tp.telefono}
                </label>
                <input
                  className="w-full border-2 border-foreground rounded-xl px-3 py-2 text-sm font-medium bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={tp.telefonoPh}
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">{tp.telefonoHint}</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending || !!usernameError}
              className={cn(
                "w-full border-4 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] font-black uppercase tracking-wider py-3 text-base transition-all",
                "hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px]",
                "bg-primary text-primary-foreground",
                (mutation.isPending || !!usernameError) && "opacity-70 cursor-not-allowed",
              )}
            >
              {mutation.isPending ? tp.saving : tp.saveBtn}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
