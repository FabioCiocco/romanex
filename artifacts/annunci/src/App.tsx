import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Switch, Route, useLocation } from "wouter";
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
import NoteLegali from "@/pages/NoteLegali";
import DiritiEInclusione from "@/pages/DiritiEInclusione";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import CookiePolicy from "@/pages/CookiePolicy";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
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
