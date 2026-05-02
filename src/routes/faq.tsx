import { createFileRoute, Link } from "@tanstack/react-router";
import { PromoLayout } from "@/components/PromoLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: "שאלות נפוצות ומחיר | סיפורי לילה טוב" },
      {
        name: "description",
        content: "כמה זה עולה? האם צריך להירשם? מה לגבי פרטיות? כל התשובות במקום אחד.",
      },
      { property: "og:title", content: "שאלות נפוצות — סיפורי לילה טוב" },
      {
        property: "og:description",
        content: "תשובות מהירות לכל מה שרציתם לדעת על האפליקציה.",
      },
    ],
  }),
});

const faqs = [
  {
    q: "כמה זה עולה?",
    a: "האפליקציה חינמית לחלוטין. ללא תשלום, ללא תקופת ניסיון, ללא פרסומות. פשוט פותחים ויוצרים.",
  },
  {
    q: "צריך להירשם?",
    a: "לא. לא מבקשים מכם דוא\"ל, לא סיסמה ולא שום פרט. נכנסים, יוצרים סיפור, נהנים.",
  },
  {
    q: "באיזו שפה הסיפורים?",
    a: "עברית, נכתבים מאפס בעברית טבעית — לא תרגום מאנגלית. גם ההקראה היא בקול עברי.",
  },
  {
    q: "האם הסיפורים מתאימים לכל גיל?",
    a: "כן — הסיפורים נכתבים בשפה רכה ומותאמת לילדים. אתם בוחרים את האורך והסגנון, וכותבים בעצמכם את נושא הסיפור — כך הוא תמיד מתאים בדיוק לילד שלכם.",
  },
  {
    q: "כמה זמן לוקח ליצור סיפור?",
    a: "כמה שניות לטקסט, ועוד מעט יותר אם בחרתם איורים (כל עמוד מצויר במיוחד). בסך הכל לרוב פחות מדקה.",
  },
  {
    q: "מה קורה לסיפורים שיצרתי?",
    a: "הם נשמרים בספרייה האישית שלכם בדפדפן, כדי שתוכלו לחזור אליהם. אנחנו לא משתפים אותם עם אף אחד.",
  },
  {
    q: "אפשר להשתמש בלי אינטרנט?",
    a: "ליצירת סיפור חדש צריך אינטרנט (כי הסיפור נכתב במיוחד עבורכם). אבל סיפורים שכבר יצרתם נשארים זמינים בספרייה גם אופליין.",
  },
  {
    q: "מה לגבי פרטיות הילדים?",
    a: "לוקחים את זה ברצינות. השם שאתם מקלידים משמש רק ליצירת הסיפור הספציפי. אנחנו לא בונים פרופילים על הילדים ולא מוכרים מידע לאף אחד.",
  },
];

function FaqPage() {
  return (
    <PromoLayout>
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
        <div className="text-center mb-12">
          <span className="text-5xl">💬</span>
          <h1 className="font-display text-4xl sm:text-5xl text-[oklch(0.3_0.12_320)] mt-4 mb-4">
            שאלות נפוצות
          </h1>
          <p className="text-lg text-[oklch(0.45_0.06_320)]">
            הכל במקום אחד. עוד שאלה? נשמח לשמוע.
          </p>
        </div>

        {/* Pricing highlight */}
        <div className="mb-10 p-6 rounded-3xl bg-gradient-to-br from-[oklch(0.95_0.06_330)] to-[oklch(0.92_0.09_295)] border border-[oklch(0.85_0.08_320)] text-center">
          <div className="text-3xl mb-2">🎁</div>
          <div className="font-display text-2xl text-[oklch(0.3_0.12_320)] mb-1">חינם. באמת.</div>
          <p className="text-sm text-[oklch(0.45_0.06_320)]">
            ללא תשלום, ללא הרשמה, ללא פרסומות. כי לפני השינה לא צריך אף אחד מהם.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-2xl bg-white/80 border border-[oklch(0.88_0.05_320)] px-5 data-[state=open]:border-[oklch(0.75_0.13_315)]"
            >
              <AccordionTrigger className="text-right text-base font-semibold text-[oklch(0.3_0.12_320)] hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-[oklch(0.4_0.05_320)] leading-relaxed text-base">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-14 text-center">
          <Link
            to="/app"
            className="inline-block px-8 py-3.5 rounded-full font-semibold bg-gradient-to-l from-[oklch(0.6_0.2_320)] to-[oklch(0.7_0.15_290)] text-white shadow-xl hover:scale-105 transition-all"
          >
            מוכנים להתחיל ✨
          </Link>
        </div>
      </section>
    </PromoLayout>
  );
}
