import { useState } from "react";
import { groqClient, isGroqConfigured } from "@/lib/groq";
import { Button } from "@/components/ui/button";

interface SlotSuggesterProps {
  consoleName?: string;
  availableSlots: string[];
  onSelect: (slotText: string) => void;
}

export const SlotSuggester = ({ consoleName, availableSlots, onSelect }: SlotSuggesterProps) => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const suggest = async () => {
    if (!isGroqConfigured) {
      setError("Set VITE_GROQ_API_KEY to enable slot suggestions.");
      return;
    }
    if (availableSlots.length === 0) {
      setError("No slots available for this date.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const prompt = `Given available slots for ${consoleName ?? "console"}: ${availableSlots.join(", ")}. Return JSON array of top 3 slot strings that are usually best for comfort and lower crowd.`;
      const completion = await groqClient?.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "Return JSON array only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 120,
      });
      const text = completion?.choices?.[0]?.message?.content ?? "[]";
      const parsed = JSON.parse(text) as string[];
      const valid = parsed.filter((slot) => availableSlots.includes(slot)).slice(0, 3);
      setSuggestions(valid.length ? valid : availableSlots.slice(0, 3));
    } catch (e) {
      console.error(e);
      setSuggestions(availableSlots.slice(0, 3));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border p-3 mb-4 bg-card/40">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-sm">AI Slot Suggester</p>
        <Button size="sm" variant="outline" onClick={suggest} disabled={loading}>
          {loading ? "Suggesting..." : "Suggest best slots"}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive mb-2">{error}</p>}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((slot) => (
            <Button key={slot} size="sm" variant="secondary" onClick={() => onSelect(slot)}>
              {slot}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
