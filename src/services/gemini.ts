import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features will be limited.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const SYSTEM_INSTRUCTION = `
Siz "Nafas" - O'zbekistondagi xotin-qizlar uchun maxsus yaratilgan, hamdard va bilimli sun'iy intellekt yordamchisiz.
Sizning asosiy vazifangiz:
1. Jinsiy, ruhiy va jismoniy zo'ravonlikka uchragan ayollarga psixologik dalda berish.
2. O'zbekiston Respublikasi qonunchiligi (Lex.uz ma'lumotlari asosida) bo'yicha huquqiy maslahatlar berish.
3. O'zbek stereotiplarini yengishda va travmalarni davolashda yordam berish.

MUHIM QOIDALAR:
- FAQAT zo'ravonlik, psixologik salomatlik va ayollar huquqlari mavzusida gapiring. Boshqa mavzularda (masalan, ovqat pishirish, texnika) javob bermang.
- Har doim o'zbek tilida, muloyim va qo'llab-quvvatlovchi ohangda javob bering.
- Agar foydalanuvchi xavf ostida bo'lsa, darhol SOS tugmasidan foydalanishni yoki 102 ga qo'ng'iroq qilishni maslahat bering.
- Lex.uz saytidagi qonunlardan iqtibos keltiring (masalan, "Xotin-qizlarni tazyiq va zo'ravonlikdan himoya qilish to'g'risida"gi qonun).
- Anonimlik va xavfsizlikni birinchi o'ringa qo'ying.
`;

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isRateLimit = error?.message?.includes("429") || error?.status === "RESOURCE_EXHAUSTED";
      if (isRateLimit && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        console.warn(`Rate limit hit, retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export async function generateSupportResponse(prompt: string, history: any[] = []) {
  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    }));
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Kechirasiz, hozirda javob berishda xatolik yuz berdi. Iltimos, birozdan so'ng qayta urinib ko'ring.";
  }
}

export const ASSESSMENT_QUESTIONS = [
  "Oxirgi 24 soat ichida stress darajangiz qanchalik yuqori bo'ldi?",
  "O'zingizni xavfsiz his qilyapsizmi?",
  "Atrofingizdagilar sizga ruhiy bosim o'tkazishyaptimi?",
  "Kelajakka bo'lgan umidingiz qanchalik kuchli?",
  "Hozirgi holatingizda kimdandir yordam olishga tayyormisiz?"
];

export async function analyzeAssessment(answers: string[]) {
  const prompt = `Foydalanuvchining quyidagi 5ta savolga bergan javoblarini tahlil qiling va uning stress darajasini (0-100%) aniqlang. Shuningdek, unga motivatsiya beruvchi qisqa xabar yozing:
  ${answers.map((a, i) => `${i+1}. ${ASSESSMENT_QUESTIONS[i]}: ${a}`).join("\n")}`;

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            stressLevel: { type: Type.NUMBER },
            motivation: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["stressLevel", "motivation", "summary"]
        }
      }
    }));
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Assessment Analysis Error:", error);
    return null;
  }
}
