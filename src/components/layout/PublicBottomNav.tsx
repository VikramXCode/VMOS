import { Home, CalendarDays, Plus, ShoppingBag, Menu, Images, Medal, Trophy, MessageCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", path: "/", icon: Home },
  { label: "Book", path: "/booking", icon: CalendarDays },
  { label: "Shop", path: "/shop", icon: ShoppingBag },
];

const openWhatsApp = () => {
  window.open("https://wa.me/917010905241?text=Hi! I want to book a gaming slot.", "_blank");
};

export const PublicBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <button
        onClick={openWhatsApp}
        className="fixed right-4 bottom-24 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.45)] active:scale-95 transition-transform flex items-center justify-center md:hidden"
        aria-label="Quick booking"
      >
        <Plus className="h-6 w-6" />
      </button>

      <nav className="fixed inset-x-0 bottom-0 z-30 h-16 border-t border-primary/20 bg-[#0B0F1A]/95 backdrop-blur-md md:hidden">
        <div className="h-full grid grid-cols-5 px-1">
          <button onClick={() => navigate(navLinks[0].path)} className={cn("flex flex-col items-center justify-center text-[10px] gap-1", isActive(navLinks[0].path) ? "text-primary" : "text-muted-foreground")}>
            <Home className="h-4 w-4" />
            Home
          </button>

          <button onClick={() => navigate(navLinks[1].path)} className={cn("flex flex-col items-center justify-center text-[10px] gap-1", isActive(navLinks[1].path) ? "text-primary" : "text-muted-foreground")}>
            <CalendarDays className="h-4 w-4" />
            Book
          </button>

          <button onClick={openWhatsApp} className="flex flex-col items-center justify-center text-[10px] gap-1 text-primary">
            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary shadow-[0_0_20px_hsl(var(--primary)/0.5)] flex items-center justify-center -mt-5">
              <Plus className="h-5 w-5 text-primary-foreground" />
            </span>
            Add
          </button>

          <button onClick={() => navigate(navLinks[2].path)} className={cn("flex flex-col items-center justify-center text-[10px] gap-1", isActive(navLinks[2].path) ? "text-primary" : "text-muted-foreground")}>
            <ShoppingBag className="h-4 w-4" />
            Shop
          </button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center text-[10px] gap-1 text-muted-foreground">
                <Menu className="h-4 w-4" />
                More
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl bg-[#0B0F1A] border-t border-primary/20">
              <SheetHeader>
                <SheetTitle>Quick Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button variant="outline" className="rounded-xl justify-start" onClick={() => { setOpen(false); navigate("/tournaments"); }}>
                  <Trophy className="h-4 w-4 mr-2" /> Tournaments
                </Button>
                <Button variant="outline" className="rounded-xl justify-start" onClick={() => { setOpen(false); navigate("/gallery"); }}>
                  <Images className="h-4 w-4 mr-2" /> Gallery
                </Button>
                <Button variant="outline" className="rounded-xl justify-start" onClick={() => { setOpen(false); navigate("/leaderboard"); }}>
                  <Medal className="h-4 w-4 mr-2" /> Leaderboard
                </Button>
                <Button className="rounded-xl justify-start" onClick={() => { setOpen(false); openWhatsApp(); }}>
                  <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
};
