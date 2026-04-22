import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  childName: z.string().trim().min(1).max(40),
  topic: z.string().trim().min(1).max(200),
  length: z.enum(["short", "medium", "long"]),
  sentiment: z.enum(["magical", "inspiring", "learning"]),
});

const imageInputSchema = z.object({
  pageText: z.string().trim().min(1).max(2000),
  storyTitle: z.string().trim().min(1).max(200),
  // A short shared "style bible" for the whole story — same wording
  // is used on every page so all illustrations feel like one book.
  styleAnchor: z.string().trim().min(1).max(600),
});

export type StoryPage = { text: string; image_url?: string };
export type StoryResult = { title: string; pages: StoryPage[]; character_sheet?: string };

const lengthSpec: Record<string, { pages: string; words: string }> = {
  short: { pages: "5-7 עמודים", words: "כ-250-400 מילים (1-3 דקות קריאה)" },
  medium: { pages: "9-12 עמודים", words: "כ-500-750 מילים (3-5 דקות קריאה)" },
  long: { pages: "14-18 עמודים", words: "כ-900-1500 מילים (5-10 דקות קריאה)" },
};

const sentimentSpec: Record<string, string> = {
  magical: "קסום וחלומי, עם נגיעות של פלא ודמיון",
  inspiring: "מעורר השראה ומחזק ביטחון עצמי",
  learning: "עם לקח עדין על חברות, אומץ או טוב לב",
};

async function generatePageImage(
  apiKey: string,
  pageText: string,
  storyTitle: string,
  styleAnchor: string,
): Promise<string | undefined> {
  try {
    // The style block is IDENTICAL on every page so the model produces
    // visually consistent illustrations across the whole story.
    const STYLE_BIBLE = `ILLUSTRATION STYLE (must stay identical across every page of this book):
- Medium: soft pastel watercolor, gentle paper grain, hand-painted bedtime storybook.
- Palette: deep indigo & lavender night sky, warm amber/cream highlights, soft pink moonlight, dusty teal shadows. Never use neon, never high-saturation, never harsh black.
- Lighting: a single soft glowing crescent moon, tiny twinkling stars, dreamy haze.
- Mood: cozy, peaceful, magical, sleepy. Calm faces, half-closed eyes, gentle smiles.
- Composition: centered subject, generous soft background, square format, painterly soft edges.
- ABSOLUTELY NO text, letters, numbers, words, captions, signatures, or watermarks anywhere in the image.
- Same artistic hand throughout the book — like one illustrator drew all pages.`;

    const prompt = `${STYLE_BIBLE}

STORY-SPECIFIC ANCHOR (keep these characters/setting consistent every page):
${styleAnchor}

BOOK TITLE: "${storyTitle}"
SCENE TO ILLUSTRATE FOR THIS PAGE: ${pageText}

Paint this scene now in the exact style described above, matching the story-specific anchor.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Faster preview model — pro-level quality with much lower latency
        model: "google/gemini-3.1-flash-image-preview",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!res.ok) {
      console.error("Image gen failed", res.status, await res.text());
      return undefined;
    }

    const json = (await res.json()) as {
      choices?: Array<{
        message?: {
          images?: Array<{ image_url?: { url?: string } }>;
        };
      }>;
    };
    return json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  } catch (err) {
    console.error("Image gen error", err);
    return undefined;
  }
}

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
- הוסף "character_sheet" באנגלית: תיאור ויזואלי מדויק של הדמות הראשית והדמויות המשניות שיישאר זהה בכל איור (גיל, מבנה גוף, צבע ואורך שיער, צבע עיניים, בגדים מדויקים כולל צבעים, חפצים אופייניים, וגם תיאור הסביבה/עולם הסיפור). זה ה"תנ"ך" של האייר — חייב להיות ספציפי מאוד כדי שכל הציורים ייראו מאותו ספר.

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
                character_sheet: {
                  type: "string",
                  description:
                    "Detailed English visual description of main + supporting characters and setting (age, body, hair color & length, eye color, exact clothing with colors, signature props, world). Used as a locked style anchor for every illustration.",
                },
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
              required: ["title", "character_sheet", "pages"],
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

// Separate server function: generate ONE page illustration. Called from the
// client per page (in parallel with limited concurrency) so each request stays
// under the Worker timeout instead of one giant blocking call.
export const generatePageIllustration = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => imageInputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }
    const url = await generatePageImage(
      apiKey,
      data.pageText,
      data.storyTitle,
      data.styleAnchor,
    );
    return { image_url: url };
  });
