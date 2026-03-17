import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Tournament {
  id: string;
  name: string;
  game: string;
  date: string;
  prize: string;
}

const defaultTournaments: Tournament[] = [
  { id: "seed-1", name: "VMOS Championship 2025", game: "FIFA 24", date: "2025-02-15", prize: "₹10,000" },
];

export const AdminTournamentsPage = () => {
  const [tournaments, setTournaments] = useLocalStorage<Tournament[]>("vmos-tournaments", defaultTournaments);
  const [form, setForm] = useState<Omit<Tournament, "id">>({ name: "", game: "", date: "", prize: "" });
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const openSheet = () => setSheetOpen(true);
    window.addEventListener("admin-primary-action", openSheet);
    return () => window.removeEventListener("admin-primary-action", openSheet);
  }, []);

  const addTournament = () => {
    setTournaments((prev) => [{ id: crypto.randomUUID(), ...form }, ...prev]);
    setForm({ name: "", game: "", date: "", prize: "" });
    setSheetOpen(false);
  };

  return (
    <AdminLayout>
      <Button onClick={() => setSheetOpen(true)} className="w-full rounded-xl h-11 mb-4 lg:w-auto">
        <Plus className="h-4 w-4 mr-1" /> Add Tournament
      </Button>

      <Card className="rounded-2xl bg-surface-2/90 border-border/60">
          <CardHeader>
            <CardTitle>Existing Tournaments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tournaments.length === 0 && <p className="text-sm text-muted-foreground">No tournaments yet.</p>}
            {tournaments.map((t) => (
              <div key={t.id} className="border border-border/60 rounded-2xl p-3 flex items-center justify-between bg-background/30">
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.game} • {t.date}</p>
                  <p className="text-xs text-primary">Prize: {t.prize || "TBD"}</p>
                </div>
                <Button variant="destructive" size="sm" className="rounded-xl" onClick={() => setTournaments((prev) => prev.filter((x) => x.id !== t.id))}>
                  Delete
                </Button>
              </div>
            ))}
          </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="h-[86vh] rounded-t-3xl bg-[#0B0F1A] border-t border-primary/20">
          <div className="w-12 h-1.5 rounded-full bg-border mx-auto mt-2 mb-3" />
          <SheetHeader className="text-left px-1">
            <SheetTitle className="font-heading text-lg">Add Tournament</SheetTitle>
          </SheetHeader>
          <div className="space-y-3 mt-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label>Game</Label>
              <Input value={form.game} onChange={(e) => setForm({ ...form, game: e.target.value })} className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label>Prize Pool</Label>
              <Input value={form.prize} onChange={(e) => setForm({ ...form, prize: e.target.value })} className="rounded-xl h-11" />
            </div>
            <Button onClick={addTournament} disabled={!form.name || !form.game || !form.date} className="w-full rounded-xl h-11">
              Save Tournament
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
};
