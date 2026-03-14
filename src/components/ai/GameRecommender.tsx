import { useState } from "react";
import { groqClient, isGroqConfigured } from "@/lib/groq";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Recommendation {
  title: string;
  reason: string;
}

export const GameRecommender = () => {
  const [genre, setGenre] = useState("FPS, Sports");
  const [skill, setSkill] = useState("Intermediate");
  const [mode, setMode] = useState("Multiplayer");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (!isGroqConfigured) {
      setError("Set VITE_GROQ_API_KEY to enable recommendations.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const prompt = `Return JSON array only with 5 objects {title, reason}. Context: VMOS gaming station in India. User prefs: genre=${genre}, skill=${skill}, mode=${mode}. Recommend games/consoles to play or buy.`;
      const completion = await groqClient?.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a gaming recommendation assistant. Output valid JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 300,
      });
      const text = completion?.choices?.[0]?.message?.content ?? "[]";
      const parsed = JSON.parse(text) as Recommendation[];
      setResults(Array.isArray(parsed) ? parsed.slice(0, 5) : []);
    } catch (e) {
      console.error(e);
      setError("Could not generate recommendations right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>AI Game Recommender</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label>Preferred Genres</Label>
            <Input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="FPS, Racing, Sports" />
          </div>
          <div className="space-y-1">
            <Label>Skill Level</Label>
            <Input value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="Beginner / Intermediate / Pro" />
          </div>
          <div className="space-y-1">
            <Label>Play Style</Label>
            <Input value={mode} onChange={(e) => setMode(e.target.value)} placeholder="Solo / Multiplayer" />
          </div>
        </div>
        <Button onClick={run} disabled={loading}>{loading ? "Thinking..." : "Get Recommendations"}</Button>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {results.length > 0 && (
          <div className="grid md:grid-cols-2 gap-3">
            {results.map((item, idx) => (
              <div key={`${item.title}-${idx}`} className="rounded-lg border border-border p-3">
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.reason}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
