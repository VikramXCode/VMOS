import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/contexts/BookingContext";
import { Input } from "@/components/ui/input";
import { CalendarCheck2, Search, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export const AdminBookingsPage = () => {
  const { bookings, updateBookingStatus, deleteBooking, consoles, getAvailability, addBooking } = useBooking();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; id: string } | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consoleId, setConsoleId] = useState(consoles[0]?.id ?? "");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [slotId, setSlotId] = useState("");

  const availableSlots = useMemo(() => {
    if (!consoleId) return [];
    return getAvailability(date, consoleId).filter((slot) => slot.available);
  }, [consoleId, date, getAvailability]);

  useEffect(() => {
    setSlotId(availableSlots[0]?.id ?? "");
  }, [availableSlots]);

  useEffect(() => {
    const openSheet = () => setSheetOpen(true);
    window.addEventListener("admin-primary-action", openSheet);
    return () => window.removeEventListener("admin-primary-action", openSheet);
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        booking.name.toLowerCase().includes(q) ||
        booking.phone.toLowerCase().includes(q) ||
        booking.consoleName.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  const badgeClass = (status: "pending" | "confirmed" | "cancelled") => {
    if (status === "confirmed") return "bg-green-500/15 text-green-400 border-green-500/40";
    if (status === "cancelled") return "bg-destructive/15 text-destructive border-destructive/40";
    return "bg-yellow-500/15 text-yellow-400 border-yellow-500/40 animate-pulse";
  };

  const createBooking = () => {
    if (!name || !phone || !consoleId || !slotId) return;
    const selected = availableSlots.find((slot) => slot.id === slotId);
    if (!selected) return;
    addBooking({
      name,
      phone,
      consoleId,
      date,
      slots: [{ ...selected, available: false }],
    });
    setName("");
    setPhone("");
    setSheetOpen(false);
  };

  return (
    <AdminLayout>
      <Card className="bg-surface-2/90 border-border/60 rounded-2xl shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-xl flex items-center gap-2">
            <CalendarCheck2 className="h-5 w-5 text-primary" />
            All Bookings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="relative w-full">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by customer, phone, or console"
                className="pl-9 h-10 rounded-xl"
              />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {(["all", "confirmed", "pending", "cancelled"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-heading border transition-all ${statusFilter === status ? "bg-primary/15 text-primary border-primary/40" : "bg-background/30 text-muted-foreground border-border/50"}`}
              >
                {status[0].toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <Button onClick={() => setSheetOpen(true)} className="w-full rounded-xl lg:hidden">
            <Plus className="h-4 w-4 mr-1" /> Add Booking
          </Button>

          {filteredBookings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 py-8 text-center text-muted-foreground">
              No bookings found for this filter.
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div
                key={b.id}
                onTouchStart={(e) => setTouchStart({ x: e.changedTouches[0].clientX, id: b.id })}
                onTouchEnd={(e) => {
                  if (!touchStart || touchStart.id !== b.id) return;
                  const delta = e.changedTouches[0].clientX - touchStart.x;
                  if (delta > 70) updateBookingStatus(b.id, "confirmed");
                  if (delta < -70) deleteBooking(b.id);
                  setTouchStart(null);
                }}
                className="border border-border/60 bg-background/30 rounded-2xl p-3"
              >
                <button className="w-full text-left" onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground">{b.name}</p>
                    <span className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded-full border ${badgeClass(b.status)}`}>{b.status}</span>
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-sm break-words mt-1">
                    {b.consoleName} • {b.slots.map((s) => s.start).join(", ")}
                  </p>
                </button>

                {expandedId === b.id && (
                  <div className="pt-3 mt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">{b.phone} • {b.date}</p>
                    <div className="grid grid-cols-3 gap-2 w-full">
                      <Button size="sm" variant="outline" className="rounded-lg" onClick={() => updateBookingStatus(b.id, "confirmed")}>Confirm</Button>
                      <Button size="sm" variant="secondary" className="rounded-lg" onClick={() => updateBookingStatus(b.id, "cancelled")}>Cancel</Button>
                      <Button size="sm" variant="destructive" className="rounded-lg" onClick={() => deleteBooking(b.id)}>Delete</Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="h-[88vh] rounded-t-3xl bg-[#0B0F1A] border-t border-primary/20">
          <div className="w-12 h-1.5 rounded-full bg-border mx-auto mt-2 mb-3" />
          <SheetHeader className="text-left px-1">
            <SheetTitle className="font-heading text-lg">Add Booking</SheetTitle>
          </SheetHeader>
          <div className="space-y-3 mt-4">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer name" className="rounded-xl h-11" />
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="rounded-xl h-11" />
            <Select value={consoleId} onValueChange={setConsoleId}>
              <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select console" /></SelectTrigger>
              <SelectContent>
                {consoles.map((item) => (
                  <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl h-11" />
            <Select value={slotId} onValueChange={setSlotId}>
              <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Select slot" /></SelectTrigger>
              <SelectContent>
                {availableSlots.map((slot) => (
                  <SelectItem key={slot.id} value={slot.id}>{slot.start} - {slot.end}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={createBooking} className="w-full rounded-xl h-11">Save Booking</Button>
          </div>
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
};
