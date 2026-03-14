import { useState } from "react";
import { groqClient, isGroqConfigured } from "@/lib/groq";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const TeamBuilder = () => {
  const [game, setGame] = useState("Valorant");
  const [size, setSize] = useState("5");
  const [skillMix, setSkillMix] = useState("2 beginner, 2 intermediate, 1 advanced");
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!isGroqConfigured) {
      setOutput("Set VITE_GROQ_API_KEY to enable AI Team Builder.");
      return;
    }
    setLoading(true);
    try {
      const completion = await groqClient?.chat.completions.create({
        model: "llama-3.1-70b-versatile",
        messages: [
          { role: "system", content: "You are an esports coach. Provide concise tactical plans." },
          {
            role: "user",
            content: `Build a team strategy for ${game}. Team size ${size}. Skill mix: ${skillMix}. Include role assignment, communication tips, and warmup routine.`,
          },
        ],
        temperature: 0.5,
        max_tokens: 400,
      });
      setOutput(completion?.choices?.[0]?.message?.content || "No response.");
    } catch (e) {
      console.error(e);
      setOutput("Failed to generate strategy right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>AI Tournament Team Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid md:grid-cols-3 gap-3">
          <Input value={game} onChange={(e) => setGame(e.target.value)} placeholder="Game title" />
          <Input value={size} onChange={(e) => setSize(e.target.value)} placeholder="Team size" />
          <Input value={skillMix} onChange={(e) => setSkillMix(e.target.value)} placeholder="Skill mix" />
        </div>
        <Button onClick={generate} disabled={loading}>{loading ? "Building..." : "Generate Team Plan"}</Button>
        {output && <div className="rounded-lg border border-border p-3 text-sm whitespace-pre-line">{output}</div>}
      </CardContent>
    </Card>
  );
};
