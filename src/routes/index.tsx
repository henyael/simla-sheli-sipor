import { createFileRoute, Link } from "@tanstack/react-router";
import { PromoLayout } from "@/components/PromoLayout";
import heroImage from "@/assets/luna-tales-logo.png";
import step1Image from "@/assets/step-1.jpg";
import step2Image from "@/assets/step-2.jpg";
import step3Image from "@/assets/step-3.jpg";

export const Route = createFileRoute("/")({
  component: PromoHome,
  head: () => ({
    meta: [
      { title: "סיפורי לילה טוב | סיפור אישי לילד שלכם בלחיצה אחת" },
      {
        name: "description",
        content:
          "אפליקציה חינמית להורים: יוצרים סיפור לילה טוב מותאם אישית בעברית, עם איורים, מוזיקה רכה והקראה — בלחיצה אחת.",
      },
      { property: "og:title", content: "סיפורי לילה טוב — סיפור אישי לכל ילד" },
      {
        property: "og:description",
        content: "סיפורים בעברית, מותאמים לילד שלכם. רגועים, קסומים ומוכנים תוך שניות.",
      },
    ],
  }),
});

function PromoHome() {
  return (
    <PromoLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-[oklch(0.96_0.04_340)] via-[oklch(0.95_0.05_320)] to-[oklch(0.92_0.07_295)] -z-10" />
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-right">
            <span className="inline-block mb-5 px-4 py-1.5 rounded-full bg-white/70 border border-[oklch(0.8_0.1_320)] text-xs font-medium text-[oklch(0.5_0.15_320)]">
              ✨ חינם · ללא הרשמה · בעברית
            </span>
            <h1 className="font-display text-4xl sm:text-6xl leading-tight text-[oklch(0.3_0.12_320)] mb-5">
              סיפור לילה טוב
              <br />
              <span className="bg-gradient-to-l from-[oklch(0.55_0.2_320)] to-[oklch(0.65_0.16_280)] bg-clip-text text-transparent">
                שנכתב במיוחד עבורם
              </span>
            </h1>
            <p className="text-lg text-[oklch(0.4_0.06_320)] leading-relaxed mb-8 max-w-lg mx-auto md:mx-0">
              ספרו לנו את שם הילד ועל מה הוא רוצה לחלום — ותוך שניות יקום סיפור מקורי, עם איורים רכים, מוזיקה לפני השינה
              והקראה בקול.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                to="/app"
                className="px-8 py-4 rounded-full text-base font-semibold bg-gradient-to-l from-[oklch(0.6_0.2_320)] to-[oklch(0.7_0.15_290)] text-white shadow-xl shadow-[oklch(0.6_0.2_320/0.35)] hover:scale-105 hover:shadow-2xl transition-all"
              >
                צרו סיפור עכשיו ✨
              </Link>
              <Link
                to="/stories"
                className="px-8 py-4 rounded-full text-base font-medium bg-white/80 text-[oklch(0.4_0.1_320)] border border-[oklch(0.8_0.08_320)] hover:bg-white hover:border-[oklch(0.7_0.14_315)] hover:text-[oklch(0.3_0.15_320)] hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                ראו סיפורי הורים
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center md:justify-start gap-6 text-xs text-[oklch(0.5_0.06_320)]">
              <div className="flex items-center gap-1.5">
                <span>⭐⭐⭐⭐⭐</span>
                <span>מאהבים את זה</span>
              </div>
              <div>🌙 מעל 10,000 סיפורים</div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.85_0.13_320/0.5)] to-[oklch(0.8_0.13_270/0.4)] blur-3xl rounded-full -z-10" />
            <img
              src={heroImage}
              alt="הורה וילד קוראים סיפור לפני השינה"
              width={1024}
              height={1024}
              className="w-full max-w-md aspect-square object-cover rounded-full"
              style={{
                WebkitMaskImage: "radial-gradient(circle at center, black 50%, transparent 72%)",
                maskImage: "radial-gradient(circle at center, black 50%, transparent 72%)",
              }}
            />
            {/* Shooting stars with trailing tail */}
            <span
              className="shoot-local"
              style={{ top: "10%", right: "5%", animationDelay: "0s", animationDuration: "6s" }}
            />
            <span
              className="shoot-local"
              style={{ top: "30%", right: "15%", animationDelay: "2.5s", animationDuration: "7s" }}
            />
            <span
              className="shoot-local"
              style={{ top: "55%", right: "0%", animationDelay: "4.2s", animationDuration: "6.5s" }}
            />
            <span
              className="shoot-local"
              style={{ top: "70%", right: "25%", animationDelay: "1.3s", animationDuration: "7.5s" }}
            />
            <span
              className="shoot-local"
              style={{ top: "20%", right: "40%", animationDelay: "5.5s", animationDuration: "6s" }}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl text-[oklch(0.3_0.12_320)] mb-3">
            כל מה שצריך לרגע מושלם לפני השינה
          </h2>
          <p className="text-[oklch(0.45_0.06_320)] max-w-xl mx-auto">
            לא עוד חיפוש סיפורים מתאימים. כל סיפור מותאם בדיוק לילד שלכם, ברגע.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: "✍️",
              title: "סיפור אישי",
              text: "שם הילד, נושא שאוהב, ערך שחשוב לכם — ומקבלים סיפור מקורי שלא קראתם בשום מקום.",
            },
            {
              icon: "🎨",
              title: "איורים רכים",
              text: "כל עמוד מקבל ציור מים בסגנון ילדים, עם דמות עקבית לכל אורך הסיפור.",
            },
            { icon: "🎵", title: "מוזיקה רכה", text: "פסקול שקט מתנגן ברקע — בדיוק בתדר של לפני השינה." },
            { icon: "🗣️", title: "הקראה בעברית", text: "אפשר לשבת לצד הילד ולתת לאפליקציה להקריא בקול." },
            { icon: "⏱️", title: "אורך שמתאים", text: "קצר, בינוני או ארוך — אתם בוחרים כמה זמן יש לכם הערב." },
            { icon: "💜", title: "חינם לגמרי", text: "ללא הרשמה, ללא תשלום, ללא פרסומות. פשוט פותחים ויוצרים." },
          ].map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-3xl bg-white/80 border border-[oklch(0.88_0.05_320)] hover:border-[oklch(0.75_0.13_315)] hover:shadow-xl hover:shadow-[oklch(0.7_0.14_315/0.15)] hover:-translate-y-1 transition-all"
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-display text-xl text-[oklch(0.3_0.12_320)] mb-2">{f.title}</h3>
              <p className="text-sm text-[oklch(0.45_0.06_320)] leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gradient-to-b from-[oklch(0.97_0.03_330)] to-[oklch(0.94_0.06_310)] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl text-[oklch(0.3_0.12_320)] mb-3">
              יוצרים את הספר החדש ב-3 צעדים פשוטים?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                n: "1",
                title: "ספרו לנו על הילד",
                text: "הקלידו את השם של הילד ורעיון לסיפור — דובי שמחפש את הירח, ילדה אמיצה שמטפסת על הר…",
                img: step1Image,
                alt: "הורה וילד מקלידים שם בטאבלט",
              },
              {
                n: "2",
                title: "בחרו את הקסם",
                text: "אורך, סגנון, איורים, מוזיקה והקראה — סמנו את מה שאתם רוצים הערב.",
                img: step2Image,
                alt: "ספר פתוח עם איורים מוזיקה וכוכבים",
              },
              {
                n: "3",
                title: "תהנו ביחד",
                text: "תוך שניות הסיפור מוכן. שבו לצד המיטה, פתחו את העמוד הראשון, ותצללו לתוך הסיפור.",
                img: step3Image,
                alt: "ילדה קוראת ספר עם דובי לפני השינה",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="relative rounded-3xl bg-white/80 border border-[oklch(0.88_0.05_320)] overflow-hidden hover:shadow-xl hover:shadow-[oklch(0.7_0.14_315/0.15)] hover:-translate-y-1 transition-all"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[oklch(0.95_0.05_320)]">
                  <img
                    src={s.img}
                    alt={s.alt}
                    width={768}
                    height={576}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute -bottom-5 right-6 w-12 h-12 rounded-full bg-gradient-to-br from-[oklch(0.6_0.2_320)] to-[oklch(0.7_0.15_280)] text-white font-bold text-lg flex items-center justify-center shadow-lg border-4 border-white">
                    {s.n}
                  </div>
                </div>
                <div className="p-6 pt-8">
                  <h3 className="font-display text-xl text-[oklch(0.3_0.12_320)] mb-2">{s.title}</h3>
                  <p className="text-sm text-[oklch(0.45_0.06_320)] leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ teaser */}
      <section className="mx-auto max-w-4xl px-5 py-16 sm:py-20">
        <div className="text-center mb-10">
          <span className="text-4xl">💬</span>
          <h2 className="font-display text-3xl sm:text-4xl text-[oklch(0.3_0.12_320)] mt-3 mb-3">
            שאלות נפוצות
          </h2>
          <p className="text-[oklch(0.45_0.06_320)]">התשובות הקצרות לכל מה שהורים שואלים אותנו.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { q: "כמה זה עולה?", a: "חינם לחלוטין. ללא תשלום, ללא פרסומות, ללא תקופת ניסיון." },
            { q: "צריך להירשם?", a: "לא. בלי דוא\"ל ובלי סיסמה — נכנסים ויוצרים." },
            { q: "באיזו שפה הסיפורים?", a: "עברית טבעית, נכתבת מאפס — לא תרגום. גם ההקראה בקול עברי." },
            { q: "מה לגבי פרטיות הילדים?", a: "השם משמש רק ליצירת הסיפור. לא בונים פרופילים ולא מוכרים מידע." },
          ].map((f) => (
            <div
              key={f.q}
              className="p-5 rounded-2xl bg-white/80 border border-[oklch(0.88_0.05_320)] hover:border-[oklch(0.75_0.13_315)] transition-colors"
            >
              <h3 className="font-semibold text-[oklch(0.3_0.12_320)] mb-1.5">{f.q}</h3>
              <p className="text-sm text-[oklch(0.45_0.06_320)] leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/faq"
            className="inline-block px-6 py-3 rounded-full text-sm font-medium bg-white/80 text-[oklch(0.4_0.1_320)] border border-[oklch(0.8_0.08_320)] hover:bg-white hover:border-[oklch(0.7_0.14_315)] hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            לכל השאלות הנפוצות ←
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-5 py-16 sm:py-24 text-center">
        <div className="rounded-[2.5rem] p-10 sm:p-16 bg-gradient-to-br from-[oklch(0.55_0.2_320)] via-[oklch(0.6_0.18_295)] to-[oklch(0.65_0.15_270)] text-white shadow-2xl shadow-[oklch(0.6_0.2_320/0.4)]">
          <div className="text-5xl mb-4">🌙</div>
          <h2 className="font-display text-3xl sm:text-4xl mb-3">הלילה הקרוב מחכה לסיפור</h2>
          <p className="opacity-90 mb-8 max-w-md mx-auto">בלי הרשמה. בלי תשלום. רק שם, רעיון — וקסם.</p>
          <Link
            to="/app"
            className="inline-block px-10 py-4 rounded-full text-base font-bold bg-white text-[oklch(0.4_0.18_320)] hover:scale-105 hover:shadow-2xl transition-all"
          >
            התחילו סיפור עכשיו ✨
          </Link>
        </div>
      </section>
    </PromoLayout>
  );
}
