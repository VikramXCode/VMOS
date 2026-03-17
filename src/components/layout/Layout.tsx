import { Header } from "./Header";
import { Footer } from "./Footer";
import { ChatWidget } from "@/components/ai/ChatWidget";
import { PublicBottomNav } from "./PublicBottomNav";

interface LayoutProps {
  children: React.ReactNode;
  /** When true, removes the top padding (used for full-bleed hero sections) */
  hideHeaderPadding?: boolean;
}

export const Layout = ({ children, hideHeaderPadding = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-surface">
      <Header />
      <main className={`flex-1 ${hideHeaderPadding ? "" : "pt-16"} pb-20 md:pb-0`}>
        {children}
      </main>
      <Footer />
      <PublicBottomNav />
      <ChatWidget />
    </div>
  );
};
