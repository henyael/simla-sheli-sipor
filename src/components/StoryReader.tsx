import { useEffect, useState } from "react";
import type { StoryPage } from "@/server/generate-story";
import { Button } from "@/components/ui/button";
import { speak, stopSpeaking, isTTSAvailable } from "@/lib/tts";
import { startAmbientMusic, stopAmbientMusic } from "@/lib/ambient-music";

interface StoryReaderProps {
  title: string;
  pages: StoryPage[];
  onClose: () => void;
  /** Auto-start ambient music when the reader opens. */
  autoMusic?: boolean;
}

export function StoryReader({
  title,
  pages,
  onClose,
  autoMusic = false,
}: StoryReaderProps) {
  const [page, setPage] = useState(0);
  const [music, setMusic] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const total = pages.length;
  const isLast = page === total - 1;
  const current = pages[page];
  const ttsAvailable = isTTSAvailable();

  useEffect(() => {
    setPage(0);
  }, [pages]);

  // Try to start music on the first user interaction inside the reader
  // (browsers block AudioContext without a real user gesture).
  useEffect(() => {
    if (!autoMusic) return;
    const tryStart = async () => {
      const ok = await startAmbientMusic();
      if (ok) setMusic(true);
      window.removeEventListener("pointerdown", tryStart);
      window.removeEventListener("keydown", tryStart);
    };
    window.addEventListener("pointerdown", tryStart, { once: true });
    window.addEventListener("keydown", tryStart, { once: true });
    return () => {
      window.removeEventListener("pointerdown", tryStart);
      window.removeEventListener("keydown", tryStart);
      stopAmbientMusic();
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stop narration whenever the page changes or reader closes
  useEffect(() => {
    stopSpeaking();
    setSpeaking(false);
  }, [page]);

  const toggleMusic = async () => {
    if (music) {
      stopAmbientMusic();
      setMusic(false);
    } else {
      // This runs inside a click handler — the gesture browsers require.
      const ok = await startAmbientMusic();
      setMusic(ok);
      if (!ok) {
        console.warn("Ambient music could not start (browser blocked audio).");
      }
    }
  };

  const toggleNarration = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      const text = current?.text ?? "";
      if (!text) return;
      setSpeaking(true);
      speak(text, () => setSpeaking(false));
    }
  };

  const handleClose = () => {
    stopAmbientMusic();
    stopSpeaking();
    onClose();
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-4 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-xl my-8">
        <button
          onClick={handleClose}
          className="absolute -top-4 left-0 text-sm text-muted-foreground hover:text-foreground smooth"
          aria-label="סגור"
        >
          ✕ סגור
        </button>

        {/* Audio controls — top-right */}
        <div className="absolute -top-4 right-0 flex items-center gap-2">
          <button
            onClick={toggleMusic}
            className={`text-xs rounded-full px-3 py-1.5 border smooth ${
              music
                ? "border-primary/60 bg-primary/15 text-primary"
                : "border-border bg-card/40 text-muted-foreground hover:text-foreground"
            }`}
            aria-label="מוזיקה רכה"
          >
            {music ? "🎵 מוזיקה" : "🔇 מוזיקה"}
          </button>
          {ttsAvailable && (
            <button
              onClick={toggleNarration}
              className={`text-xs rounded-full px-3 py-1.5 border smooth ${
                speaking
                  ? "border-accent/60 bg-accent/15 text-accent"
                  : "border-border bg-card/40 text-muted-foreground hover:text-foreground"
              }`}
              aria-label="הקראה"
            >
              {speaking ? "⏸ הקראה" : "🔊 הקראה"}
            </button>
          )}
        </div>

        <div className="rounded-3xl border border-border bg-card shadow-2xl p-6 sm:p-10 min-h-[70vh] flex flex-col mt-6">
          <h2 className="font-display text-2xl sm:text-3xl text-primary text-center mb-2">
            {title}
          </h2>

          <div className="text-center text-xs text-muted-foreground mb-5">
            עמוד {page + 1} מתוך {total}
          </div>

          <div
            key={page}
            className="page-in flex-1 flex flex-col items-center justify-center text-center gap-6"
          >
            {current?.image_url && (
              <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-xl border border-border/50 bg-background/40">
                <img
                  src={current.image_url}
                  alt=""
                  className="w-full h-auto block"
                  loading="lazy"
                />
              </div>
            )}

            <p className="story-text text-foreground/95 px-1">
              {current?.text}
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-full smooth"
            >
              → הקודם
            </Button>

            <div className="flex gap-1.5">
              {pages.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full smooth ${
                    i === page ? "w-7 bg-primary" : "w-1.5 bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>

            {isLast ? (
              <Button
                onClick={handleClose}
                className="bg-primary text-primary-foreground rounded-full smooth"
              >
                לילה טוב 🌙
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setPage((p) => Math.min(total - 1, p + 1))}
                className="rounded-full smooth"
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
