import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "בית" },
  { to: "/about", label: "מי אנחנו" },
  { to: "/stories", label: "סיפורי הורים" },
  { to: "/faq", label: "שאלות נפוצות" },
] as const;

export function PromoLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div dir="rtl" className="promo-theme min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[oklch(0.99_0.01_340/0.75)] border-b border-[oklch(0.85_0.06_320/0.4)]">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-start">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="p-2.5 rounded-full text-[oklch(0.35_0.12_320)] bg-white/70 border border-[oklch(0.85_0.06_320/0.6)] hover:bg-white hover:shadow-md transition-all"
            aria-label="תפריט"
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-[oklch(0.85_0.06_320/0.4)] bg-[oklch(0.99_0.01_340)]">
            <nav className="mx-auto max-w-6xl flex flex-col p-3 gap-1 items-end">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="w-full text-right px-4 py-3 rounded-xl text-sm font-medium text-[oklch(0.4_0.1_320)] hover:bg-[oklch(0.92_0.05_330)]"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/app"
                onClick={() => setOpen(false)}
                className="w-full mt-2 px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-l from-[oklch(0.65_0.18_320)] to-[oklch(0.75_0.13_290)] text-white text-center"
              >
                צור סיפור ✨
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="mt-20 border-t border-[oklch(0.85_0.06_320/0.4)] bg-[oklch(0.97_0.02_330)]">
        <div className="mx-auto max-w-6xl px-5 py-10 grid sm:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-display text-base text-[oklch(0.35_0.12_320)]">Luna tales</span>
            </div>
            <p className="text-[oklch(0.5_0.06_320)] leading-relaxed">
              סיפורים אישיים בעברית, בלחיצה אחת. עשויים באהבה עבור הורים וילדים.
            </p>
          </div>
          <div>
            <div className="font-semibold text-[oklch(0.35_0.12_320)] mb-3">ניווט</div>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[oklch(0.5_0.06_320)] hover:text-[oklch(0.55_0.18_320)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold text-[oklch(0.35_0.12_320)] mb-3">להתחיל עכשיו</div>
            <Link
              to="/app"
              className="inline-block px-5 py-2.5 rounded-full bg-[oklch(0.7_0.14_315)] text-white font-medium hover:bg-[oklch(0.65_0.18_320)] transition-colors"
            >
              צור סיפור חינם
            </Link>
          </div>
        </div>
        <div className="border-t border-[oklch(0.85_0.06_320/0.4)] py-5 text-center text-xs text-[oklch(0.55_0.05_320)]">
          © {new Date().getFullYear()} סיפורי לילה טוב · עשוי באהבה 💜
        </div>
      </footer>
    </div>
  );
}
