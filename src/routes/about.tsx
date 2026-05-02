import { createFileRoute, Link } from "@tanstack/react-router";
import { PromoLayout } from "@/components/PromoLayout";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "מי אנחנו | סיפורי לילה טוב" },
      {
        name: "description",
        content: "הסיפור מאחורי האפליקציה: הורים שרצו רגע שקט, אישי וקסום עם הילדים לפני השינה.",
      },
      { property: "og:title", content: "מי אנחנו — סיפורי לילה טוב" },
      {
        property: "og:description",
        content: "נבנה על ידי הורים, עבור הורים. למה יצרנו את האפליקציה ולאן אנחנו הולכים.",
      },
    ],
  }),
});

function AboutPage() {
  return (
    <PromoLayout>
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
        <div className="text-center mb-12">
          <span className="text-5xl">💜</span>
          <h1 className="font-display text-4xl sm:text-5xl text-[oklch(0.3_0.12_320)] mt-4 mb-4">
            הסיפור מאחורי הסיפורים
          </h1>
          <p className="text-lg text-[oklch(0.45_0.06_320)]">
            נבנה על ידי הורים, עבור הורים.
          </p>
        </div>

        <div className="space-y-6 text-[oklch(0.35_0.05_320)] leading-loose text-lg">
          <p>
            הכל התחיל בלילה אחד שבו אזלו לנו הסיפורים. הילדה ביקשה "סיפור על דובי שמחפש את הירח, אבל
            עם נסיכה ועם תפוז שמדבר" — וברור שאף ספר על המדף לא ענה לדרישות.
          </p>
          <p>
            במקום לאלתר עוד פעם בעייפות, חשבנו: למה אי אפשר פשוט להגיד למחשב את שם הילד ומה הוא אוהב
            הערב — ולקבל סיפור שנכתב במיוחד? סיפור עם איורים רכים, מוזיקה שקטה ברקע, וקול שיכול
            להקריא כשגם להורה כבר נסגרות העיניים.
          </p>
          <p>
            אז בנינו את זה. בעברית, חינמי, ללא הרשמה. כי שעת ההשכבה היא הרגע היקר ביותר ביום —
            ומגיע לה כלי שלא יגנוב לכם אותו, אלא יוסיף לו עוד קצת קסם.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-3 gap-4">
          {[
            { icon: "🇮🇱", title: "עברית מהבית", text: "כל סיפור נכתב בעברית טבעית, לא תרגום." },
            { icon: "🔒", title: "פרטיות לפני הכל", text: "בלי הרשמה, בלי איסוף נתונים על הילדים." },
            { icon: "🎨", title: "מקורי לחלוטין", text: "כל סיפור וכל איור נוצרים ברגע, לכם בלבד." },
          ].map((v) => (
            <div key={v.title} className="p-5 rounded-2xl bg-white/70 border border-[oklch(0.88_0.05_320)] text-center">
              <div className="text-3xl mb-2">{v.icon}</div>
              <div className="font-semibold text-[oklch(0.3_0.12_320)] mb-1">{v.title}</div>
              <div className="text-sm text-[oklch(0.5_0.06_320)]">{v.text}</div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/app"
            className="inline-block px-8 py-3.5 rounded-full font-semibold bg-gradient-to-l from-[oklch(0.6_0.2_320)] to-[oklch(0.7_0.15_290)] text-white shadow-xl hover:scale-105 transition-all"
          >
            נסו אותנו הערב ✨
          </Link>
        </div>
      </section>
    </PromoLayout>
  );
}
