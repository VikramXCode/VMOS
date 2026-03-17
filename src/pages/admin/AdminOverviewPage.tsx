import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useBooking } from "@/contexts/BookingContext";
import { format } from "date-fns";
import { CalendarDays, Coins, Gamepad2, ListChecks, Plus, ShieldBan } from "lucide-react";
import type { ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const AdminOverviewPage = () => {
  const { bookings, consoles } = useBooking();
  const navigate = useNavigate();
  const today = format(new Date(), "yyyy-MM-dd");
  const todaysBookings = bookings.filter((b) => b.date === today);
  const revenueToday = todaysBookings.reduce((sum, b) => sum + b.amount, 0);
  const uniqueCustomers = new Set(bookings.map((b) => b.phone)).size;
  const activeSlots = todaysBookings.reduce((sum, b) => sum + b.slots.length, 0);
  const popularConsole = consoles
    .map((c) => ({
      console: c,
      count: bookings.filter((b) => b.consoleId === c.id).length,
    }))
    .sort((a, b) => b.count - a.count)[0]?.console.name;

  return (
    <AdminLayout>
      <Card className="rounded-2xl bg-surface-2/90 border-border/60 shadow-soft mb-4">
        <CardContent className="pt-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Dashboard</p>
          <h1 className="font-heading text-xl font-semibold mt-1">Good Evening, Admin</h1>
          <p className="text-sm text-muted-foreground">Everything important is within 2 taps.</p>
        </CardContent>
      </Card>

      <div className="grid gap-3 grid-cols-2 mb-5">
        <StatCard title="Today's Bookings" value={todaysBookings.length.toString()} icon={CalendarDays} />
        <StatCard title="Revenue" value={`₹${revenueToday}`} icon={Coins} />
        <StatCard title="Customers" value={uniqueCustomers.toString()} icon={ListChecks} />
        <StatCard title="Active Slots" value={activeSlots.toString()} icon={Gamepad2} />
      </div>

      <div className="mb-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Quick Actions</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Button className="rounded-xl shrink-0" onClick={() => navigate("/admin/bookings")}>
            <Plus className="h-4 w-4 mr-1" /> Add Booking
          </Button>
          <Button className="rounded-xl shrink-0" variant="secondary" onClick={() => navigate("/admin/products")}>
            <Plus className="h-4 w-4 mr-1" /> Add Product
          </Button>
          <Button className="rounded-xl shrink-0" variant="outline" onClick={() => navigate("/admin/slots")}>
            <ShieldBan className="h-4 w-4 mr-1" /> Block Slots
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl bg-surface-2/90 border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {bookings.slice(0, 5).map((b) => (
            <button key={b.id} onClick={() => navigate("/admin/bookings")} className="w-full text-left rounded-2xl border border-border/60 p-3 active:scale-[0.99] transition-transform bg-background/30">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium truncate">{b.name}</p>
                <span className="text-primary font-semibold whitespace-nowrap">₹{b.amount}</span>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">
                  {b.consoleName} • {b.date} • {b.slots.map((s) => s.start).join(", ")}
                </p>
              </div>
            </button>
          ))}
          {bookings.length === 0 && <p className="text-sm text-muted-foreground">No bookings yet.</p>}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground mt-3">Top Console: {popularConsole || "-"}</p>
    </AdminLayout>
  );
};

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) => (
  <Card className="rounded-2xl bg-surface-2/90 border-border/60">
    <CardHeader className="pb-1">
      <CardTitle className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0 pb-4">
      <p className="text-lg sm:text-2xl font-heading break-words">{value}</p>
    </CardContent>
  </Card>
);
