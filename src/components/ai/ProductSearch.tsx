import { useState } from "react";
import { geminiClient, isGeminiConfigured } from "@/lib/gemini";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductLike {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface ProductSearchProps {
  products: ProductLike[];
  onApply: (ids: string[] | null) => void;
}

export const ProductSearch = ({ products, onApply }: ProductSearchProps) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchWithAI = async () => {
    if (!query.trim()) {
      onApply(null);
      return;
    }
    if (!isGeminiConfigured) {
      setError("Set VITE_GEMINI_API_KEY to enable AI product search.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const model = geminiClient?.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `User query: ${query}. Catalog: ${JSON.stringify(products)}. Return JSON array of matching product IDs sorted by relevance.`;
      const result = await model?.generateContent(prompt);
      const text = result?.response.text() ?? "[]";
      const ids = JSON.parse(text) as string[];
      onApply(Array.isArray(ids) ? ids : null);
    } catch (e) {
      console.error(e);
      setError("AI search failed. Try another phrasing.");
      onApply(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="AI Search: e.g. best setup for competitive FPS under 5000"
        />
        <Button onClick={searchWithAI} disabled={loading}>{loading ? "Searching..." : "AI Search"}</Button>
        <Button variant="ghost" onClick={() => { setQuery(""); onApply(null); }}>Reset</Button>
      </div>
      {error && <p className="text-xs text-destructive mt-2">{error}</p>}
    </div>
  );
};
