import { Link, useLocation } from "wouter";
import { LayoutDashboard, FileText, Users, MessageSquare, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/annunci", label: "Annunci", icon: FileText },
  { href: "/utenti", label: "Utenti", icon: Users },
  { href: "/forum", label: "Forum", icon: MessageSquare },
  { href: "/impostazioni", label: "Impostazioni", icon: Settings },
];

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
  userEmail?: string;
}

export function Layout({ children, onLogout, userEmail }: LayoutProps) {
  const [loc] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-black border-r-2 border-yellow-400 flex flex-col transform transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}
      >
        <div className="p-5 border-b-2 border-yellow-400">
          <div className="text-yellow-400 font-black text-xl tracking-tight uppercase">RomaNex</div>
          <div className="text-zinc-500 text-xs font-mono mt-0.5">CMS Admin Panel</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? loc === "/" : loc.startsWith(href);
            return (
              <Link key={href} href={href}>
                <a
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded font-semibold text-sm transition-colors border
                    ${active
                      ? "bg-yellow-400 text-black border-yellow-400"
                      : "text-zinc-400 border-transparent hover:text-white hover:bg-zinc-800 hover:border-zinc-700"
                    }`}
                >
                  <Icon size={16} />
                  {label}
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t-2 border-zinc-800 space-y-3">
          {userEmail && (
            <div className="text-xs text-zinc-500 font-mono truncate px-1">{userEmail}</div>
          )}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={14} />
            Disconnetti
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-black border-b-2 border-yellow-400">
          <span className="font-black text-yellow-400 uppercase tracking-tight">RomaNex CMS</span>
          <button onClick={() => setOpen((v) => !v)} className="text-zinc-300">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
