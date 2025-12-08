import { BrandingKitData } from '@/lib/types';
import { IdeaIntake } from '@prisma/client';

export async function generateBrandingKit(project: IdeaIntake): Promise<BrandingKitData> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  const apiUrl = process.env.OPENROUTER_API_KEY
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
  
  const model = process.env.OPENROUTER_API_KEY
    ? 'openai/gpt-4o' // Use stronger model for creative branding
    : 'gpt-4o';

  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const systemPrompt = `تو یک استراتژیست برند و کپی‌رایتر خلاق فارسی‌زبان هستی. باید یک "بسته برند" (Branding Kit) کامل برای استارتاپ زیر بسازی.
خروجی باید فقط و فقط JSON معتبر باشد که دقیقاً با این تایپ اسکریپت مطابقت داشته باشد:

type BrandingKitSection = {
  id: string;
  title: string;       // عنوان فارسی جذاب
  description: string; // توضیحات فارسی کامل و خلاقانه
  bullets?: string[];  // لیست نکات
  options?: string[];  // برای نام و شعار
  keywords?: string[]; // برای جهت‌گیری بصری
};

type BrandingColor = {
  name: string; // نام فارسی و خلاقانه رنگ
  hex: string;  // کد رنگ معتبر
  usage: string;// کاربرد در UI
};

type BrandingKitData = {
  nameAndSlogan: BrandingKitSection;   // پیشنهادات نام و شعار
  personality: BrandingKitSection;     // شخصیت برند
  toneOfVoice: BrandingKitSection;     // لحن گفتار
  brandPromises: BrandingKitSection;   // قول‌های برند
  visualDirection: BrandingKitSection; // جهت‌گیری بصری کلی
  colors: {
    title: string;
    description: string;
    palette: BrandingColor[];
  };
  usageExamples: BrandingKitSection;   // نمونه‌های واقعی کاربرد متن/کپی
};

نکات مهم:
1. تمام متن‌ها باید کاملاً فارسی، روان و مناسب مخاطب ایرانی باشد.
2. نام‌های پیشنهادی برند می‌توانند فارسی، انگلیسی یا ترکیبی باشند، اما توضیحات آن‌ها باید فارسی باشد.
3. لحن باید متناسب با مخاطب هدف استارتاپ انتخاب شود.`;

  const userPrompt = `
اطلاعات استارتاپ:
- ایده: ${project.ideaOneLiner}
- مشکل: ${project.problem}
- راه‌حل: ${project.solution}
- مخاطب هدف: ${project.audience}

لطفاً بسته برند کامل را با ساختار JSON خواسته شده تولید کن.
`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...(process.env.OPENROUTER_API_KEY && {
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Startup Execution Platform',
      }),
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8, // Slightly higher for creativity
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('AI API Error:', errorData);
    throw new Error(errorData.error?.message || 'Failed to generate branding kit from AI provider');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch (e) {
    console.error('JSON Parse Error:', e);
    throw new Error('Failed to parse AI response');
  }
}
