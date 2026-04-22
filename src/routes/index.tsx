import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateStory, type StoryPage } from "@/server/generate-story";
import { getDeviceSupabase } from "@/lib/supabase-device";
import { StoryReader } from "@/components/StoryReader";
import { CosmicBackground } from "@/components/CosmicBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "סיפורי לילה טוב | יוצר סיפורים אישיים לילדים" },
      {
        name: "description",
        content:
          "אפליקציה להורים: צרו סיפורי לילה טוב מותאמים אישית בעברית, עם איורים, מוזיקה רכה והקראה.",
      },
      { property: "og:title", content: "סיפורי לילה טוב" },
      {
        property: "og:description",
        content: "סיפורים בעברית מותאמים לכל ילד, רגועים וקסומים.",
      },
    ],
  }),
});

type Length = "short" | "medium" | "long";
type Sentiment = "magical" | "inspiring" | "learning";

const lengthOptions: { value: Length; label: string; sub: string }[] = [
  { value: "short", label: "קצר", sub: "1–3 דקות" },
  { value: "medium", label: "בינוני", sub: "3–5 דקות" },
  { value: "long", label: "ארוך", sub: "5–10 דקות" },
];

const sentimentOptions: { value: Sentiment; label: string; emoji: string }[] = [
  { value: "magical", label: "קסום", emoji: "✨" },
  { value: "inspiring", label: "מעורר השראה", emoji: "🌟" },
  { value: "learning", label: "עם לקח", emoji: "🌱" },
];

function Home() {
  const generate = useServerFn(generateStory);

  const [childName, setChildName] = useState("");
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState<Length>("medium");
  const [sentiment, setSentiment] = useState<Sentiment>("magical");

  // Optional features
  const [withImages, setWithImages] = useState(true);
  const [withMusic, setWithMusic] = useState(true);
  const [withTTS, setWithTTS] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [story, setStory] = useState<{
    title: string;
    pages: StoryPage[];
  } | null>(null);
  const [reading, setReading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!childName.trim() || !topic.trim()) {
      setError("נא למלא את שם הילד ורעיון לסיפור.");
      return;
    }
    setLoading(true);
    setStory(null);
    try {
      const result = await generate({
        data: {
          childName: childName.trim(),
          topic: topic.trim(),
          length,
          sentiment,
        },
      });
      setStory(result);
      setReading(true);

      // Save to library (best-effort, no auth)
      const sb = getDeviceSupabase();
      const insertRow = {
        device_id: localStorage.getItem("bedtime.device_id") ?? "",
        child_name: childName.trim(),
        topic: topic.trim(),
        length: length as string,
        sentiment: sentiment as string,
        title: result.title,
        pages: result.pages as unknown,
      };
      await sb.from("stories").insert(insertRow as never);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "שגיאה לא ידועה";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="relative min-h-screen">
      <CosmicBackground />

      <div className="relative z-10 mx-auto max-w-xl px-5 py-10 sm:py-16">
        <header className="text-center mb-10 fade-up">
          <div className="text-5xl mb-3 float-slow inline-block">🌙</div>
          <h1 className="font-display text-4xl sm:text-5xl text-primary mb-3 leading-tight">
            סיפורי לילה טוב
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            סיפור אישי, חם ושקט — בדיוק כמו שאתם הייתם מספרים.
          </p>
          <Link
            to="/library"
            className="group relative inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full border border-accent/40 bg-accent/10 text-accent font-medium text-sm smooth hover:bg-accent/20 hover:border-accent/70 hover:scale-105 hover:shadow-[0_0_25px_oklch(0.78_0.14_250/0.4)] active:scale-95"
          >
            <span className="text-base group-hover:rotate-6 smooth inline-block">📚</span>
            <span>הספרייה שלי</span>
            <span className="text-xs opacity-70 group-hover:-translate-x-1 smooth inline-block">←</span>
          </Link>
        </header>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl border border-border bg-card backdrop-blur-md shadow-2xl p-6 sm:p-8 space-y-6 fade-up"
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base font-medium">
              שם הילד/ה
            </Label>
            <Input
              id="name"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="למשל: נעמה"
              maxLength={40}
              dir="rtl"
              className="h-12 text-base bg-input/40 border-border rounded-xl smooth text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic" className="text-base font-medium">
              על מה הסיפור?
            </Label>
            <Textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="למשל: דובי קטן שמחפש את הירח"
              maxLength={200}
              rows={3}
              dir="rtl"
              className="text-base bg-input/40 border-border resize-none rounded-xl smooth text-right"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">אורך הסיפור</Label>
            <div className="grid grid-cols-3 gap-2">
              {lengthOptions.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setLength(o.value)}
                  className={`rounded-2xl border p-3 text-center smooth ${
                    length === o.value
                      ? "border-primary bg-primary/15 text-primary scale-[1.02]"
                      : "border-border bg-input/30 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="font-semibold">{o.label}</div>
                  <div className="text-xs opacity-80 mt-0.5">{o.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">סגנון</Label>
            <div className="grid grid-cols-3 gap-2">
              {sentimentOptions.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setSentiment(o.value)}
                  className={`rounded-2xl border p-3 text-center smooth ${
                    sentiment === o.value
                      ? "border-accent bg-accent/15 text-accent scale-[1.02]"
                      : "border-border bg-input/30 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="text-2xl">{o.emoji}</div>
                  <div className="text-sm mt-1 font-medium">{o.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional magic */}
          <div className="space-y-3 rounded-2xl border border-border bg-input/20 p-4">
            <div className="text-sm font-medium text-foreground/90 mb-1">
              ✨ תוספות קסומות
            </div>

            <label className="flex items-center justify-between gap-3 cursor-pointer py-1">
              <div className="text-sm">
                <div className="font-medium">איור לכל עמוד</div>
                <div className="text-xs text-muted-foreground">
                  ציורי מים רכים שנוצרים במיוחד לסיפור
                </div>
              </div>
              <Switch checked={withImages} onCheckedChange={setWithImages} />
            </label>

            <label className="flex items-center justify-between gap-3 cursor-pointer py-1">
              <div className="text-sm">
                <div className="font-medium">מוזיקה רכה ברקע</div>
                <div className="text-xs text-muted-foreground">
                  צלילי רוגע עדינים בזמן הקריאה
                </div>
              </div>
              <Switch checked={withMusic} onCheckedChange={setWithMusic} />
            </label>

            <label className="flex items-center justify-between gap-3 cursor-pointer py-1">
              <div className="text-sm">
                <div className="font-medium">הקראת הסיפור</div>
                <div className="text-xs text-muted-foreground">
                  הדפדפן יקריא את הטקסט בקול עברי
                </div>
              </div>
              <Switch checked={withTTS} onCheckedChange={setWithTTS} />
            </label>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive-foreground">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-13 py-4 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl shadow-lg smooth"
          >
            {loading
              ? withImages
                ? "רוקמים סיפור ומציירים... ✨"
                : "רוקמים סיפור..."
              : "צור סיפור ✨"}
          </Button>

          {story && !reading && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setReading(true)}
              className="w-full smooth"
            >
              קרא שוב את "{story.title}"
            </Button>
          )}
        </form>

        <footer className="mt-10 text-center text-xs text-muted-foreground/70">
          לחישה לפני השינה · בעברית · ללא הרשמה
        </footer>
      </div>

      {story && reading && (
        <StoryReader
          title={story.title}
          pages={story.pages}
          autoMusic={withMusic}
          withImages={withImages}
          styleAnchor={
            story.character_sheet ||
            `Main character: a child named ${childName.trim()}. Story idea: ${topic.trim()}. Keep this same character's appearance (clothing, hair, body) on every page.`
          }
          onClose={() => setReading(false)}
          key={withTTS ? "tts" : "no-tts"}
        />
      )}
    </div>
  );
}
