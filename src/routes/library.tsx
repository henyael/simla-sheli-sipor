import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getDeviceSupabase } from "@/lib/supabase-device";
import { StoryReader } from "@/components/StoryReader";
import { Button } from "@/components/ui/button";
import type { StoryPage } from "@/server/generate-story";

interface StoryRow {
  id: string;
  title: string;
  child_name: string;
  topic: string;
  pages: StoryPage[];
  created_at: string;
}

export const Route = createFileRoute("/library")({
  component: LibraryPage,
  head: () => ({
    meta: [
      { title: "הספרייה שלי | סיפורי לילה טוב" },
      { name: "description", content: "כל סיפורי הלילה הטוב שיצרתם, שמורים במקום אחד." },
    ],
  }),
});

function LibraryPage() {
  const router = useRouter();
  const [stories, setStories] = useState<StoryRow[] | null>(null);
  const [open, setOpen] = useState<StoryRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sb = getDeviceSupabase();
    sb.from("stories")
      .select("id,title,child_name,topic,pages,created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError("לא הצלחנו לטעון את הספרייה.");
          setStories([]);
          return;
        }
        setStories((data ?? []) as unknown as StoryRow[]);
      });
  }, []);

  const remove = async (id: string) => {
    const sb = getDeviceSupabase();
    await sb.from("stories").delete().eq("id", id);
    setStories((s) => s?.filter((x) => x.id !== id) ?? null);
  };

  return (
    <div className="relative min-h-screen">
      <div className="starfield" />
      <div className="relative z-10 mx-auto max-w-2xl px-5 py-10 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-primary">
            הספרייה שלי 📚
          </h1>
          <Link to="/">
            <Button variant="ghost">← חזרה</Button>
          </Link>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
            {error}
          </div>
        )}

        {stories === null && (
          <div className="text-center text-muted-foreground py-12">טוען...</div>
        )}

        {stories && stories.length === 0 && (
          <div className="text-center text-muted-foreground py-16 fade-up">
            <div className="text-5xl mb-4">🌙</div>
            <p>עוד לא יצרתם סיפורים.</p>
            <Link to="/" className="inline-block mt-4">
              <Button>צרו את הסיפור הראשון</Button>
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {stories?.map((s) => (
            <div
              key={s.id}
              className="fade-up rounded-2xl border border-border bg-card p-5 shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  onClick={() => setOpen(s)}
                  className="text-right flex-1"
                >
                  <h3 className="font-display text-xl text-primary mb-1">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    עבור {s.child_name} · {s.topic}
                  </p>
                </button>
                <button
                  onClick={() => {
                    if (confirm("למחוק את הסיפור?")) remove(s.id);
                  }}
                  className="text-xs text-muted-foreground hover:text-destructive transition"
                  aria-label="מחק"
                >
                  מחק
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <StoryReader
          title={open.title}
          pages={open.pages}
          onClose={() => {
            setOpen(null);
            router.invalidate();
          }}
        />
      )}
    </div>
  );
}
