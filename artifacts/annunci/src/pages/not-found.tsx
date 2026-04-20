import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { AlertCircle, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  const tc = t.common;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 md:py-32 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-destructive/10 text-destructive rounded-3xl flex items-center justify-center mb-8 rotate-12 shadow-sm">
          <AlertCircle className="w-12 h-12" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold font-display text-foreground mb-4">
          {tc.error404}
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-10 max-w-lg">
          {tc.error404Desc}
        </p>

        <Link href="/">
          <Button size="lg" className="h-14 px-8 rounded-full text-lg font-bold shadow-xl hover:-translate-y-1 transition-transform gap-2">
            <Home className="w-5 h-5" />
            {tc.goHome}
          </Button>
        </Link>
      </div>
    </Layout>
  );
}
