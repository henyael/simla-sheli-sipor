import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  childName: z.string().trim().min(1).max(40),
  topic: z.string().trim().min(1).max(200),
  length: z.enum(["short", "medium", "long"]),
  sentiment: z.enum(["magical", "inspiring", "learning"]),
});

export type StoryPage = { text: string };
export type StoryResult = { title: string; pages: StoryPage[] };

const lengthSpec: Record<string, { pages: string; words: string }> = {
  short: { pages: "5-6 עמודים", words: "כ-250 מילים סה״כ" },
  medium: { pages: "8-10 עמודים", words: "כ-450 מילים סה״כ" },
  long: { pages: "12-14 עמודים", words: "כ-700 מילים סה״כ (כ-3 דקות קריאה)" },
};

const sentimentSpec: Record<string, string> = {
  magical: "קסום וחלומי, עם נגיעות של פלא ודמיון",
  inspiring: "מעורר השראה ומחזק ביטחון עצמי",
  learning: "עם לקח עדין על חברות, אומץ או טוב לב",
};

export const generateStory = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const lenInfo = lengthSpec[data.length];
    const sentInfo = sentimentSpec[data.sentiment];

    const systemPrompt = `אתה הורה אוהב שמספר סיפור לפני השינה לילד שלו בעברית.
הסגנון שלך חם, רגוע, אישי וטבעי - כאילו אתה יושב על קצה המיטה ולוחש את הסיפור.
לעולם לא תכתוב כמו AI: בלי "פעם, בארץ רחוקה" קלישאי, בלי "ובכן", בלי הסברים מטה-טקסטואליים.
עברית פשוטה, חמה וזורמת. משפטים קצרים. מילים שילד בן 4-7 מבין.
הסיפור חייב להסתיים בסוף שקט ומנמנם - הדמות נרגעת, נושמת עמוק, עוצמת עיניים.`;

    const userPrompt = `כתוב סיפור לפני השינה עבור ילד/ה בשם "${data.childName}".
הרעיון של הסיפור: ${data.topic}
סוג: ${sentInfo}
אורך: ${lenInfo.pages}, ${lenInfo.words}.

חשוב:
- שם הילד/ה (${data.childName}) חייב להופיע מספר פעמים בסיפור.
- חלק את הסיפור ל"עמודים" של 2-3 משפטים בלבד כל אחד.
- הסיום חייב להיות שלו, חלומי, מנמנם.
- הוסף כותרת קצרה ופיוטית בעברית.

החזר תשובה אך ורק דרך קריאת הכלי save_story.`;

    const body = {
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "save_story",
            description: "שמור את סיפור הלילה הטוב",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "כותרת קצרה בעברית" },
                pages: {
                  type: "array",
                  description: "עמודי הסיפור, 2-3 משפטים כל אחד",
                  items: {
                    type: "object",
                    properties: {
                      text: { type: "string" },
                    },
                    required: ["text"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["title", "pages"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "save_story" } },
    };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      if (res.status === 429) {
        throw new Error("יותר מדי בקשות. נסו שוב בעוד רגע.");
      }
      if (res.status === 402) {
        throw new Error("נגמרו הקרדיטים ל-Lovable AI. הוסיפו קרדיטים בהגדרות.");
      }
      const t = await res.text();
      console.error("AI gateway error:", res.status, t);
      throw new Error("שגיאה ביצירת הסיפור. נסו שוב.");
    }

    const json = (await res.json()) as {
      choices?: Array<{
        message?: {
          tool_calls?: Array<{
            function?: { name?: string; arguments?: string };
          }>;
        };
      }>;
    };

    const call = json.choices?.[0]?.message?.tool_calls?.[0];
    const argsStr = call?.function?.arguments;
    if (!argsStr) {
      throw new Error("הסיפור לא הוחזר כראוי. נסו שוב.");
    }

    let parsed: StoryResult;
    try {
      parsed = JSON.parse(argsStr) as StoryResult;
    } catch {
      throw new Error("שגיאה בפענוח הסיפור. נסו שוב.");
    }

    if (!parsed.title || !Array.isArray(parsed.pages) || parsed.pages.length === 0) {
      throw new Error("הסיפור שהוחזר ריק. נסו שוב.");
    }

    return parsed satisfies StoryResult;
  });
