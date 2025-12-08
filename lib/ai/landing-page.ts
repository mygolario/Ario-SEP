import { LandingPlanData } from '@/lib/types';
import { IdeaIntake } from '@prisma/client';

export async function generateLandingPagePlan(project: IdeaIntake, brandingKitData?: any): Promise<LandingPlanData> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  const apiUrl = process.env.OPENROUTER_API_KEY
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
  
  const model = process.env.OPENROUTER_API_KEY
    ? 'openai/gpt-4o' // High capability model for structured layout
    : 'gpt-4o';

  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const systemPrompt = `تو یک طراح تجربه کاربری و کپی‌رایتر حرفه‌ای صفحه لندینگ هستی. باید برای ایده استارتاپی زیر یک ساختار کامل صفحه لندینگ (Landing Page Structure) به زبان فارسی طراحی کنی.
خروجی باید فقط و فقط JSON معتبر باشد که دقیقاً با این تایپ اسکریپت مطابقت داشته باشد:

type LandingSection = {
  id: string;
  type: string;
  title: string;       // عنوان فارسی جذاب
  subtitle?: string;   // زیرعنوان فارسی
  body?: string;       // متن اصلی فارسی
  bullets?: string[];  // لیست نکات
  highlightText?: string; // متن تأکیدی یا روی دکمه
};

type LandingPlanData = {
  hero: LandingSection;        // بخش بالای صفحه
  problem: LandingSection;     // بخش طرح مشکل
  solution: LandingSection;    // بخش راه‌حل
  features: LandingSection;    // ویژگی‌ها
  steps: LandingSection;       // مراحل کار
  socialProof: LandingSection; // اعتماد و اعتبار
  faq: LandingSection;         // سؤالات متداول
  finalCta: LandingSection;    // دکمه اقدام نهایی
};

نکات مهم:
1. تمام متن‌ها باید کاملاً فارسی، روان و مناسب مخاطب ایرانی باشد.
2. از کلمات انگلیسی در متن خروجی استفاده نکن.
3. لحن نوشته‌ها باید ترغیب‌کننده و متناسب با پرسونای مشتری باشد.`;

  // Branding Kit Data is now rich Farsi structure
  const tone = brandingKitData?.toneOfVoice?.description || 'حرفه‌ای و قابل اعتماد';
  const personality = brandingKitData?.personality?.description || 'جدی و کارآمد';

  const userPrompt = `
اطلاعات استارتاپ:
- ایده: ${project.ideaOneLiner}
- مشکل: ${project.problem}
- راه‌حل: ${project.solution}
- مخاطب هدف: ${project.audience}

لحن برند: ${tone}
شخصیت برند: ${personality}

لطفاً ساختار کامل صفحه لندینگ را با فرمت JSON خواسته شده تولید کن.
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
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('AI API Error:', errorData);
    throw new Error(errorData.error?.message || 'Failed to generate landing page plan from AI provider');
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
