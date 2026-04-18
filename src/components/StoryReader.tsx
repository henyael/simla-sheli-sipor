import { useEffect, useState } from "react";
import type { StoryPage } from "@/server/generate-story";
import { Button } from "@/components/ui/button";

interface StoryReaderProps {
  title: string;
  pages: StoryPage[];
  onClose: () => void;
}

export function StoryReader({ title, pages, onClose }: StoryReaderProps) {
  const [page, setPage] = useState(0);
  const total = pages.length;
  const isLast = page === total - 1;

  useEffect(() => {
    setPage(0);
  }, [pages]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg">
        <button
          onClick={onClose}
          className="absolute -top-3 left-0 text-sm text-muted-foreground hover:text-foreground transition"
          aria-label="סגור"
        >
          ✕ סגור
        </button>

        <div className="rounded-3xl border border-border bg-card shadow-2xl p-8 sm:p-10 min-h-[60vh] flex flex-col">
          <h2 className="font-display text-2xl sm:text-3xl text-primary text-center mb-2">
            {title}
          </h2>

          <div className="text-center text-xs text-muted-foreground mb-6">
            עמוד {page + 1} מתוך {total}
          </div>

          <div
            key={page}
            className="fade-up flex-1 flex items-center justify-center text-center"
          >
            <p className="font-display text-xl sm:text-2xl leading-relaxed text-foreground/95">
              {pages[page]?.text}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              → הקודם
            </Button>

            <div className="flex gap-1.5">
              {pages.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === page
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>

            {isLast ? (
              <Button onClick={onClose} className="bg-primary text-primary-foreground">
                לילה טוב 🌙
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setPage((p) => Math.min(total - 1, p + 1))}
              >
                הבא ←
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
