import { Link, useLocation } from "wouter";
import { Home, ChevronRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface Crumb {
  label: string;
  href?: string;
}

interface BackBannerProps {
  crumbs: Crumb[];
  backHref?: string;
}

export function BackBanner({ crumbs, backHref }: BackBannerProps) {
  const { t } = useLanguage();
  const tc = t.common;
  const [, navigate] = useLocation();

  const handleBack = () => {
    if (backHref) {
      navigate(backHref);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="w-full border-b-2 border-foreground/10 bg-muted/40 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center gap-3 h-11">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-foreground/50 hover:text-foreground transition-colors group shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2.5} />
            {tc.back}
          </button>

          {/* Divider */}
          <span className="text-foreground/20 font-light">|</span>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 overflow-hidden min-w-0">
            <Link href="/" className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-foreground/50 hover:text-primary transition-colors shrink-0">
              <Home className="h-3 w-3" strokeWidth={2.5} />
              <span className="hidden sm:inline">{tc.backHome}</span>
            </Link>

            {crumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1 min-w-0">
                <ChevronRight className="h-3 w-3 text-foreground/25 shrink-0" strokeWidth={2.5} />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="text-xs font-black uppercase tracking-wider text-foreground/50 hover:text-primary transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-xs font-black uppercase tracking-wider text-foreground truncate">
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
