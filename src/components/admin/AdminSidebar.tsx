import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import {
  BookOpenCheck,
  CalendarRange,
  Home,
  LayoutGrid,
  ShoppingBag,
  Trophy,
  Users,
  Lightbulb,
  LogOut,
  UserCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const adminLinks = [
  { to: "/admin/overview", label: "Overview", icon: LayoutGrid },
  { to: "/admin/bookings", label: "Bookings", icon: BookOpenCheck },
  { to: "/admin/slots", label: "Slots", icon: CalendarRange },
  { to: "/admin/tournaments", label: "Tournaments", icon: Trophy },
  { to: "/admin/products", label: "Products", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/insights", label: "AI Insights", icon: Lightbulb },
];

interface AdminNavContentProps {
  onLinkClick?: () => void;
}

export const AdminNavContent = ({ onLinkClick }: AdminNavContentProps) => {
  const location = useLocation();

  return (
    <nav className="py-4 space-y-1">
      {adminLinks.map((link) => {
        const isActive = location.pathname.startsWith(link.to);
        return (
          <Link key={link.to} to={link.to} className="block px-3" onClick={onLinkClick}>
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "hover:bg-muted/40 text-muted-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{link.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAdmin();

  return (
    <aside className="hidden lg:flex lg:flex-col border-r border-border/60 bg-surface-1/95 backdrop-blur-md sticky top-0 h-screen">
      <div className="h-16 flex items-center px-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-heading text-base">VMOS Admin</p>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Control Center</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-border/60 bg-surface-2/70 p-3 flex items-center gap-3">
          <UserCircle2 className="h-8 w-8 text-primary" />
          <div>
            <p className="font-heading text-sm">Admin</p>
            <p className="text-xs text-muted-foreground">Operations</p>
          </div>
        </div>
      </div>

      <AdminNavContent />

      <div className="px-4 mt-auto pb-6 border-t border-border/60 pt-4">
        <Button variant="ghost" className="w-full justify-start gap-2 rounded-xl" onClick={() => {
          logout();
          navigate("/admin/login");
        }}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

interface AdminDrawerContentProps {
  onNavigate?: () => void;
}

export const AdminDrawerContent = ({ onNavigate }: AdminDrawerContentProps) => {
  const navigate = useNavigate();
  const { logout } = useAdmin();

  return (
    <div className="h-full flex flex-col">
      <div className="h-16 px-4 border-b border-border/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Home className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <p className="font-heading">VMOS Admin</p>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Control Center</p>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-border/60 bg-surface-2/70 p-3 flex items-center gap-3">
          <UserCircle2 className="h-8 w-8 text-primary" />
          <div>
            <p className="font-heading text-sm">Admin</p>
            <p className="text-xs text-muted-foreground">Operations</p>
          </div>
        </div>
      </div>

      <div className="px-1">
        <AdminNavContent onLinkClick={onNavigate} />
      </div>

      <div className="px-4 pb-6 mt-auto border-t border-border/60 pt-4">
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => {
          onNavigate?.();
          logout();
          navigate("/admin/login");
        }}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};
