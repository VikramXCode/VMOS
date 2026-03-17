import { AdminDrawerContent, AdminSidebar } from "@/components/admin/AdminSidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, CalendarDays, Home, Menu, Package2, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

const titleFromPath = (path: string) => {
  if (path.includes("/overview")) return "Overview";
  if (path.includes("/bookings")) return "Bookings";
  if (path.includes("/slots")) return "Slots";
  if (path.includes("/tournaments")) return "Tournaments";
  if (path.includes("/products")) return "Products";
  if (path.includes("/customers")) return "Customers";
  if (path.includes("/insights")) return "AI Insights";
  return "Admin";
};

const emitPrimaryAction = () => {
  window.dispatchEvent(new Event("admin-primary-action"));
};

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[280px_1fr] bg-[#0B0F1A]">
      <AdminSidebar />

      <section className="min-w-0">
        <header className="sticky top-0 z-30 h-14 border-b border-primary/20 bg-[#0B0F1A]/95 backdrop-blur-md px-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" className="rounded-xl lg:hidden" onClick={() => setDrawerOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="px-2 min-w-0">
            <p className="font-heading font-bold uppercase tracking-wide text-sm truncate">{titleFromPath(location.pathname)}</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Notifications">
            <Bell className="h-4.5 w-4.5" />
          </Button>
        </header>

        <main className="p-3 pb-36 md:p-5 md:pb-28 overflow-y-auto max-w-7xl">{children}</main>

        <button
          onClick={emitPrimaryAction}
          className="fixed right-4 bottom-24 md:bottom-20 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.45)] active:scale-95 transition-transform flex items-center justify-center"
          aria-label="Primary action"
        >
          <Plus className="h-6 w-6" />
        </button>

        <nav className="fixed bottom-0 inset-x-0 z-30 h-16 border-t border-primary/20 bg-[#0B0F1A]/95 backdrop-blur-md lg:hidden">
          <div className="h-full grid grid-cols-5 px-1">
            <button onClick={() => navigate("/admin/overview")} className={cn("flex flex-col items-center justify-center text-[10px] gap-1", isActive("/admin/overview") ? "text-primary" : "text-muted-foreground")}>
              <Home className="h-4 w-4" />
              Home
            </button>
            <button onClick={() => navigate("/admin/bookings")} className={cn("flex flex-col items-center justify-center text-[10px] gap-1", isActive("/admin/bookings") ? "text-primary" : "text-muted-foreground")}>
              <CalendarDays className="h-4 w-4" />
              Book
            </button>
            <button onClick={emitPrimaryAction} className="flex flex-col items-center justify-center text-[10px] gap-1 text-primary">
              <span className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary shadow-[0_0_20px_hsl(var(--primary)/0.5)] flex items-center justify-center -mt-5">
                <Plus className="h-5 w-5 text-primary-foreground" />
              </span>
              Add
            </button>
            <button onClick={() => navigate("/admin/products")} className={cn("flex flex-col items-center justify-center text-[10px] gap-1", isActive("/admin/products") ? "text-primary" : "text-muted-foreground")}>
              <Package2 className="h-4 w-4" />
              Shop
            </button>
            <button onClick={() => setDrawerOpen(true)} className="flex flex-col items-center justify-center text-[10px] gap-1 text-muted-foreground">
              <Settings className="h-4 w-4" />
              More
            </button>
          </div>
        </nav>
      </section>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="p-0 w-[86vw] max-w-sm bg-[#0B0F1A] border-r border-primary/20">
          <AdminDrawerContent onNavigate={() => setDrawerOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};
