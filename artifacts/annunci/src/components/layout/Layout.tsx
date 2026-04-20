import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { GuestBar } from "./GuestBar";
import { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Navbar />
      <GuestBar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
