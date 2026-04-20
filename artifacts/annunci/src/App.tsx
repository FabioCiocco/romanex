import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { useUser } from "@clerk/react";
import { itIT, enUS, esES } from "@clerk/localizations";
import { useLanguage } from "@/contexts/LanguageContext";
import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Annunci from "@/pages/Annunci";
import AnnuncioDetail from "@/pages/AnnuncioDetail";
import Pubblica from "@/pages/Pubblica";
import Categorie from "@/pages/Categorie";
import Sezione from "@/pages/Sezione";
import Forum from "@/pages/Forum";
import ForumThread from "@/pages/ForumThread";
import Profilo from "@/pages/Profilo";
import CompletaProfilo from "@/pages/CompletaProfilo";
import { WelcomeBanner } from "@/components/layout/WelcomeBanner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { useGetMyProfile, getGetMyProfileQueryKey } from "@workspace/api-client-react";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const primaryColor = "hsl(264, 67%, 40%)";
const accentColor = "hsl(38, 92%, 44%)";
const bgColor = "hsl(240, 20%, 98%)";
const fgColor = "hsl(224, 71%, 4%)";

const clerkAppearance = {
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: primaryColor,
    colorBackground: bgColor,
    colorInputBackground: "#ffffff",
    colorText: fgColor,
    colorTextSecondary: "hsl(215, 16%, 47%)",
    colorInputText: fgColor,
    colorNeutral: "hsl(215, 16%, 47%)",
    borderRadius: "12px",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    fontFamilyButtons: "'Space Grotesk', system-ui, sans-serif",
    fontSize: "15px",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "rounded-2xl border-4 border-[hsl(224,71%,4%)] shadow-[8px_8px_0_0_hsl(224,71%,4%)] w-full overflow-hidden",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    logoBox: "flex justify-center mb-2",
    logoImage: "h-10 w-auto",
    headerTitle: { color: fgColor, fontWeight: "900", fontFamily: "'Space Grotesk', sans-serif", fontSize: "22px", textTransform: "uppercase", letterSpacing: "-0.5px" },
    headerSubtitle: { color: "hsl(215,16%,47%)", fontWeight: "600", fontFamily: "'Space Grotesk', sans-serif" },
    socialButtonsBlockButton: "border-2 border-[hsl(224,71%,4%)] shadow-[3px_3px_0_0_hsl(224,71%,4%)] hover:shadow-[1px_1px_0_0_hsl(224,71%,4%)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all font-bold rounded-xl",
    socialButtonsBlockButtonText: { color: fgColor, fontWeight: "700", fontFamily: "'Space Grotesk', sans-serif" },
    formButtonPrimary: "bg-[hsl(264,67%,40%)] hover:bg-[hsl(264,67%,35%)] border-2 border-[hsl(224,71%,4%)] shadow-[3px_3px_0_0_hsl(224,71%,4%)] hover:shadow-[1px_1px_0_0_hsl(224,71%,4%)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all font-black rounded-xl uppercase tracking-wider",
    formFieldInput: "border-2 border-[hsl(224,71%,4%)] rounded-xl focus:ring-2 focus:ring-[hsl(264,67%,40%)] font-medium",
    formFieldLabel: { color: fgColor, fontWeight: "700", fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em" },
    footerActionText: { color: "hsl(215,16%,47%)", fontWeight: "600", fontFamily: "'Space Grotesk', sans-serif" },
    footerActionLink: { color: primaryColor, fontWeight: "800", fontFamily: "'Space Grotesk', sans-serif" },
    dividerText: { color: "hsl(215,16%,60%)", fontWeight: "700", fontFamily: "'Space Grotesk', sans-serif" },
    dividerLine: "bg-[hsl(214,32%,91%)]",
    identityPreviewEditButton: { color: primaryColor },
    formFieldSuccessText: { color: "hsl(142,71%,35%)", fontWeight: "700" },
    alertText: { color: "hsl(0,84%,45%)", fontWeight: "700", fontFamily: "'Space Grotesk', sans-serif" },
    alert: "border-2 border-[hsl(0,84%,45%)] rounded-xl",
    otpCodeFieldInput: "border-2 border-[hsl(224,71%,4%)] rounded-xl font-black text-xl",
    footerAction: "bg-[hsl(240,20%,96%)]",
    main: "gap-4",
  },
};

const queryClient = new QueryClient();

function SignInPage() {
  // To update login providers, app branding, or OAuth settings use the Auth
  // pane in the workspace toolbar. More information can be found in the Replit docs.
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <SignIn
          routing="path"
          path={`${basePath}/sign-in`}
          signUpUrl={`${basePath}/sign-up`}
        />
      </div>
    </div>
  );
}

function SignUpPage() {
  // To update login providers, app branding, or OAuth settings use the Auth
  // pane in the workspace toolbar. More information can be found in the Replit docs.
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <SignUp
          routing="path"
          path={`${basePath}/sign-up`}
          signInUrl={`${basePath}/sign-in`}
        />
      </div>
    </div>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

const AUTH_PATHS = ["/sign-in", "/sign-up", "/completa-profilo"];

function ProfileCompletionGuard() {
  const { user, isLoaded } = useUser();
  const [location, setLocation] = useLocation();
  const isAuthPage = AUTH_PATHS.some(p => location.startsWith(p));

  const { data: profile, isLoading, isError } = useGetMyProfile({
    query: {
      queryKey: getGetMyProfileQueryKey(),
      enabled: !!user && isLoaded && !isAuthPage,
      retry: false,
    },
  });

  useEffect(() => {
    if (!isLoaded || !user || isAuthPage || isLoading) return;
    if (isError || !profile) {
      setLocation("/completa-profilo");
    }
  }, [isLoaded, user, isAuthPage, isLoading, isError, profile, setLocation]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <ProfileCompletionGuard />
      <WelcomeBanner />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/annunci" component={Annunci} />
        <Route path="/annunci/:id" component={AnnuncioDetail} />
        <Route path="/pubblica" component={Pubblica} />
        <Route path="/categorie" component={Categorie} />
        <Route path="/appartamenti">{() => <Sezione catId="appartamenti" />}</Route>
        <Route path="/libri">{() => <Sezione catId="libri" />}</Route>
        <Route path="/ripetizioni">{() => <Sezione catId="ripetizioni" />}</Route>
        <Route path="/consigli">{() => <Sezione catId="consigli" />}</Route>
        <Route path="/gruppi-studio">{() => <Sezione catId="gruppi-studio" />}</Route>
        <Route path="/forum/:id" component={ForumThread} />
        <Route path="/forum" component={Forum} />
        <Route path="/profilo" component={Profilo} />
        <Route path="/completa-profilo" component={CompletaProfilo} />
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

const CLERK_LOCALES = { it: itIT, en: enUS, es: esES } as const;

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  const { lang } = useLanguage();
  const localization = CLERK_LOCALES[lang] ?? itIT;

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      localization={localization}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ClerkQueryClientCacheInvalidator />
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <LanguageProvider>
      <WouterRouter base={basePath}>
        <ClerkProviderWithRoutes />
      </WouterRouter>
    </LanguageProvider>
  );
}

export default App;
