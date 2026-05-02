import { createFileRoute, Link } from "@tanstack/react-router";
import { PromoLayout } from "@/components/PromoLayout";

export const Route = createFileRoute("/stories")({
  component: StoriesPage,
  head: () => ({
    meta: [
      { title: "סיפורי הורים | סיפורי לילה טוב" },
      {
        name: "description",
        content: "הורים מספרים: איך סיפור אישי שינה את השעה הכי קשה (והכי יפה) של היום.",
      },
      { property: "og:title", content: "סיפורי הורים שמשתמשים באפליקציה" },
      {
        property: "og:description",
        content: "המלצות אמיתיות מהורים על שעת השינה החדשה של המשפחה.",
      },
    ],
  }),
});

const testimonials = [
  {
    name: "מיכל, אמא לעידן (4)",
    quote:
      "עידן לא מסכים לישון בלי 'הסיפור על עידן והכוכב הסגול'. הוא מבקש אותו כל ערב מחדש — בכל פעם בגרסה אחרת. גמרתם לי את הצרות.",
    emoji: "🌟",
  },
  {
    name: "יוסי, אבא לתאומות",
    quote:
      "שתי הבנות, אישיויות הפוכות, סיפור אחד שמתאים לשתיהן? בלתי אפשרי. עכשיו כל אחת מקבלת את הסיפור שלה — ושתיהן ישנות עד הבוקר.",
    emoji: "👯",
  },
  {
    name: "שירה, אמא לרוני (6)",
    quote:
      "רוני מתחילה כיתה א' ופחדה. ביקשתי סיפור על ילדה שמתחילה בית ספר חדש ומוצאת חברה. היא הקשיבה בעיניים פעורות. בבוקר היא יצאה בחיוך.",
    emoji: "🎒",
  },
  {
    name: "דנה, אמא לתאומים בני 3",
    quote:
      "המוזיקה ברקע + ההקראה = אני יכולה סוף סוף לשתות תה חם בזמן שהם מקשיבים. גן עדן.",
    emoji: "🍵",
  },
  {
    name: "אורן, אבא לאיתי (5)",
    quote:
      "האיורים פשוט מהממים. איתי שואל אותי כל פעם 'איך הם ידעו איך נראית הדמות שלי?'. אין לי לב לספר לו.",
    emoji: "🎨",
  },
  {
    name: "טלי, אמא חד הורית",
    quote:
      "אחרי יום עבודה ארוך, אין לי כוח להמציא. עכשיו יש לי שותפה לסיפורים שעוזרת לי להיות אמא טובה יותר בלילה.",
    emoji: "💜",
  },
];

function StoriesPage() {
  return (
    <PromoLayout>
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="text-center mb-14">
          <h1 className="font-display text-4xl sm:text-5xl text-[oklch(0.3_0.12_320)] mb-4">
            הורים מספרים
          </h1>
          <p className="text-lg text-[oklch(0.45_0.06_320)] max-w-xl mx-auto">
            הסיפורים שמאחורי הסיפורים — איך משפחות אמיתיות הפכו את שעת השינה לרגע האהוב ביותר ביום.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="p-6 rounded-3xl bg-white/85 border border-[oklch(0.88_0.05_320)] hover:shadow-xl hover:shadow-[oklch(0.7_0.14_315/0.15)] hover:-translate-y-1 transition-all flex flex-col"
            >
              <div className="text-4xl mb-3">{t.emoji}</div>
              <p className="text-[oklch(0.35_0.05_320)] leading-relaxed mb-5 flex-1">
                "{t.quote}"
              </p>
              <div className="text-sm font-semibold text-[oklch(0.5_0.15_320)]">— {t.name}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center p-10 rounded-[2rem] bg-gradient-to-br from-[oklch(0.95_0.06_330)] to-[oklch(0.92_0.08_300)]">
          <h2 className="font-display text-2xl sm:text-3xl text-[oklch(0.3_0.12_320)] mb-3">
            הסיפור הבא יכול להיות שלכם
          </h2>
          <Link
            to="/app"
            className="inline-block mt-3 px-8 py-3.5 rounded-full font-semibold bg-gradient-to-l from-[oklch(0.6_0.2_320)] to-[oklch(0.7_0.15_290)] text-white shadow-xl hover:scale-105 transition-all"
          >
            צרו סיפור ראשון ✨
          </Link>
        </div>
      </section>
    </PromoLayout>
  );
}
