import { useRef, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/contexts/BookingContext";
import { Input } from "@/components/ui/input";
import { CalendarDays, Gamepad2 } from "lucide-react";

export const AdminSlotsPage = () => {
  const { consoles, getAdminSlotStates, toggleSlotBlocked, blockAllSlots, unblockAllSlots } = useBooking();
  const [consoleId, setConsoleId] = useState(consoles[0]?.id ?? "");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const holdTimerRef = useRef<number | null>(null);

  const slots = consoleId ? getAdminSlotStates(date, consoleId) : [];

  const applyBulk = (nextState: "block" | "unblock") => {
    bulkSelected.forEach((id) => {
      const slot = slots.find((s) => s.id === id);
      if (!slot || slot.state === "booked") return;
      if (nextState === "block" && slot.state === "available") toggleSlotBlocked(date, consoleId, id);
      if (nextState === "unblock" && slot.state === "blocked") toggleSlotBlocked(date, consoleId, id);
    });
    setBulkSelected([]);
    setBulkMode(false);
  };

  return (
    <AdminLayout>
      <Card className="bg-surface-2/90 border-border/60 rounded-2xl shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-xl flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            Slot Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col xl:flex-row gap-3 xl:items-center">
            <div className="w-full xl:w-72">
              <Select value={consoleId} onValueChange={setConsoleId}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Select console" />
                </SelectTrigger>
                <SelectContent>
                  {consoles.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full xl:w-52 h-10 rounded-xl"
            />
            <Button variant="outline" className="rounded-xl h-10" onClick={() => blockAllSlots(date, consoleId)}>
              Block full day
            </Button>
            <Button variant="secondary" className="rounded-xl h-10" onClick={() => unblockAllSlots(date, consoleId)}>
              Unblock full day
            </Button>
          </div>

          {bulkMode && (
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 flex flex-wrap items-center gap-2">
              <p className="text-xs text-primary font-semibold">Bulk mode ({bulkSelected.length} selected)</p>
              <Button size="sm" className="rounded-lg" onClick={() => applyBulk("block")}>Block Selected</Button>
              <Button size="sm" variant="secondary" className="rounded-lg" onClick={() => applyBulk("unblock")}>Unblock Selected</Button>
              <Button size="sm" variant="ghost" className="rounded-lg" onClick={() => { setBulkMode(false); setBulkSelected([]); }}>Exit</Button>
            </div>
          )}

          {slots.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 py-8 text-center text-muted-foreground flex items-center justify-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Select a console to manage slots.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => {
                    if (bulkMode) {
                      setBulkSelected((prev) => prev.includes(slot.id) ? prev.filter((id) => id !== slot.id) : [...prev, slot.id]);
                      return;
                    }
                    if (slot.state !== "booked") {
                      toggleSlotBlocked(date, consoleId, slot.id);
                    }
                  }}
                  onMouseDown={() => {
                    holdTimerRef.current = window.setTimeout(() => {
                      if (slot.state === "booked") return;
                      setBulkMode(true);
                      setBulkSelected((prev) => prev.includes(slot.id) ? prev : [...prev, slot.id]);
                    }, 500);
                  }}
                  onMouseUp={() => {
                    if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);
                  }}
                  onTouchStart={() => {
                    holdTimerRef.current = window.setTimeout(() => {
                      if (slot.state === "booked") return;
                      setBulkMode(true);
                      setBulkSelected((prev) => prev.includes(slot.id) ? prev : [...prev, slot.id]);
                    }, 500);
                  }}
                  onTouchEnd={() => {
                    if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);
                  }}
                  disabled={slot.state === "booked"}
                  className={`p-3.5 rounded-xl border text-sm text-left transition-colors ${
                    slot.state === "available"
                      ? "border-green-500/50 bg-green-500/10 hover:bg-green-500/15"
                      : slot.state === "blocked"
                      ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/15"
                      : "border-muted bg-muted/40 cursor-not-allowed"
                  } ${
                    bulkSelected.includes(slot.id) ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <p className="font-semibold">{slot.start} - {slot.end}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {slot.state === "available" ? "Available" : slot.state === "blocked" ? "Blocked by admin" : "Booked by customer"}
                  </p>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};
