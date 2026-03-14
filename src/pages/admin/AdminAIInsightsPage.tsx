import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/contexts/BookingContext";
import { geminiClient, isGeminiConfigured } from "@/lib/gemini";
import { Input } from "@/components/ui/input";

export const AdminAIInsightsPage = () => {
  const { bookings } = useBooking();
  const [report, setReport] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);

  const buildSummary = () => {
    const byConsole = bookings.reduce<Record<string, number>>((acc, b) => {
      acc[b.consoleName] = (acc[b.consoleName] || 0) + b.amount;
      return acc;
    }, {});

    return {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((sum, b) => sum + b.amount, 0),
      byConsole,
      recent: bookings.slice(0, 30).map((b) => ({
        date: b.date,
        console: b.consoleName,
        amount: b.amount,
        status: b.status,
        slots: b.slots.map((s) => s.start),
      })),
    };
  };

  const generate = async () => {
    if (!isGeminiConfigured) {
      setReport("Set VITE_GEMINI_API_KEY to enable AI insights.");
      return;
    }
    setLoading(true);
    try {
      const model = geminiClient?.getGenerativeModel({ model: "gemini-1.5-pro" });
      const summary = buildSummary();
      const prompt = `Analyze this VMOS dashboard data and produce concise actionable report with sections: Peak Hours, Revenue Outlook, Underperforming Categories, Marketing Actions. Data: ${JSON.stringify(summary)}`;
      const result = await model?.generateContent(prompt);
      setReport(result?.response.text() || "No report generated.");
    } catch (error) {
      console.error(error);
      setReport("Failed to generate report right now.");
    } finally {
      setLoading(false);
    }
  };

  const askFollowUp = async () => {
    if (!question.trim()) return;
    if (!isGeminiConfigured) {
      setFollowUpAnswer("Set VITE_GEMINI_API_KEY to enable follow-up Q&A.");
      return;
    }
    setFollowUpLoading(true);
    try {
      const model = geminiClient?.getGenerativeModel({ model: "gemini-1.5-flash" });
      const summary = buildSummary();
      const prompt = `You are VMOS admin analyst. Data: ${JSON.stringify(summary)}. Question: ${question}. Give a concise answer with numbers where possible.`;
      const result = await model?.generateContent(prompt);
      setFollowUpAnswer(result?.response.text() || "No answer generated.");
    } catch (error) {
      console.error(error);
      setFollowUpAnswer("Failed to get AI answer.");
    } finally {
      setFollowUpLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Generate automated insights from the last 30 days of booking and sales data.
          </p>
          <Button onClick={generate} disabled={loading}>
            {loading ? "Generating..." : "Generate Report"}
          </Button>
          {report && <div className="mt-4 text-sm whitespace-pre-line">{report}</div>}

          <div className="mt-6 space-y-2">
            <p className="text-sm font-medium">Ask follow-up question</p>
            <div className="flex gap-2">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Example: which console should we promote next week?"
              />
              <Button variant="outline" onClick={askFollowUp} disabled={followUpLoading}>
                {followUpLoading ? "Asking..." : "Ask AI"}
              </Button>
            </div>
            {followUpAnswer && <div className="text-sm whitespace-pre-line rounded-md border border-border p-3">{followUpAnswer}</div>}
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Powered by Gemini.
        </CardFooter>
      </Card>
    </AdminLayout>
  );
};
