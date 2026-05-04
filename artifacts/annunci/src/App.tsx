import { useEffect, lazy, Suspense } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Switch, Route, useLocation } from "wouter";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";

const NotFound = lazy(() => import("@/pages/not-found"));
const Annunci = lazy(() => import("@/pages/Annunci"));
const AnnuncioDetail = lazy(() => import("@/pages/AnnuncioDetail"));
const Pubblica = lazy(() => import("@/pages/Pubblica"));
const Categorie = lazy(() => import("@/pages/Categorie"));
const Sezione = lazy(() => import("@/pages/Sezione"));
const Forum = lazy(() => import("@/pages/Forum"));
const ForumThread = lazy(() => import("@/pages/ForumThread"));
const Profilo = lazy(() => import("@/pages/Profilo"));
const CompletaProfilo = lazy(() => import("@/pages/CompletaProfilo"));
const NoteLegali = lazy(() => import("@/pages/NoteLegali"));
const DiritiEInclusione = lazy(() => import("@/pages/DiritiEInclusione"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("@/pages/CookiePolicy"));
const SignIn = lazy(() => import("@/pages/SignIn"));
const SignUp = lazy(() => import("@/pages/SignUp"));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
import { WelcomeBanner } from "@/components/layout/WelcomeBanner";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Router as WouterRouter } from "wouter";
import { useGetMyProfile, getGetMyProfileQueryKey } from "@workspace/api-client-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

const AUTH_PATHS = ["/sign-in", "/sign-up", "/forgot-password", "/reset-password", "/completa-profilo"];

function ProfileCompletionGuard() {
  const { isSignedIn, isLoaded } = useAuth();
  const [location, setLocation] = useLocation();
  const isAuthPage = AUTH_PATHS.some(p => location.startsWith(p));

  const { data: profile, isLoading, isError } = useGetMyProfile({
    query: {
      queryKey: getGetMyProfileQueryKey(),
      enabled: isSignedIn && isLoaded && !isAuthPage,
      retry: false,
    },
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn || isAuthPage || isLoading) return;
    if (isError || !profile) {
      setLocation("/completa-profilo");
    }
  }, [isLoaded, isSignedIn, isAuthPage, isLoading, isError, profile, setLocation]);

  return null;
}

function AuthCacheSync() {
  const { isSignedIn } = useAuth();
  const qc = useQueryClient();

  useEffect(() => {
    qc.invalidateQueries({ queryKey: getGetMyProfileQueryKey() });
  }, [isSignedIn, qc]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <ProfileCompletionGuard />
      <AuthCacheSync />
      <WelcomeBanner />
      <CookieBanner />
      <Suspense fallback={null}>
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
        <Route path="/note-legali" component={NoteLegali} />
        <Route path="/diritti-e-inclusione" component={DiritiEInclusione} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/cookie-policy" component={CookiePolicy} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route component={NotFound} />
      </Switch>
      </Suspense>
    </>
  );
}

function App() {
  const { lang } = useLanguage();
  void lang;

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

function AppWithProviders() {
  return (
    <LanguageProvider>
      <WouterRouter base={basePath}>
        <App />
      </WouterRouter>
    </LanguageProvider>
  );
}

export default AppWithProviders;
