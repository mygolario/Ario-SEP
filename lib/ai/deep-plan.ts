import { DeepPlanData } from '@/lib/types';
import { IdeaIntake } from '@prisma/client';

export async function generateDeepPlan(project: IdeaIntake): Promise<DeepPlanData> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  const apiUrl = process.env.OPENROUTER_API_KEY
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
  
  const model = process.env.OPENROUTER_API_KEY
    ? 'openai/gpt-4o' // Use stronger model for deep plan
    : 'gpt-4o';

  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const systemPrompt = `تو یک مشاور استارتاپ و استراتژی کسب‌وکار خبره هستی. باید یک "برنامه عمیق" (Deep Plan) جامع برای استارتاپ کاربر بسازی.
خروجی باید فقط و فقط JSON معتبر باشد که دقیقاً با این تایپ اسکریپت مطابقت داشته باشد:

type DeepPlanSection = {
  id: string;
  title: string;       // عنوان فارسی جذاب
  description: string; // توضیحات فارسی کامل (۳-۵ خط)
  bullets?: string[];  // لیست نکات کلیدی فارسی
};

type DeepPlanData = {
  overview: DeepPlanSection;          // نمای کلی ایده و فرصت بازار
  customerAndProblem: DeepPlanSection;// تحلیل مشتری و مشکل اصلی
  solutionAndProduct: DeepPlanSection;// راه‌حل و ویژگی‌های محصول
  roadmap90Days: DeepPlanSection;     // برنامه اجرایی ۹۰ روز اول
  risks: DeepPlanSection;             // ریسک‌ها و چالش‌های اصلی
  metrics: DeepPlanSection;           // معیارهای کلیدی موفقیت (KPI)
};

تمام متن‌ها باید به زبان فارسی، حرفه‌ای و مناسب اکوسیستم استارتاپی ایران باشد. از کلمات انگلیسی در متن خروجی استفاده نکن مگر اینکه اصطلاح فنی رایج باشد.`;

  const userPrompt = `
اطلاعات استارتاپ:
- ایده: ${project.ideaOneLiner}
- مشکل: ${project.problem}
- راه‌حل: ${project.solution}
- مخاطب هدف: ${project.audience}

لطفاً برنامه عمیق استراتژیک را با ساختار JSON خواسته شده تولید کن.
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
    throw new Error(errorData.error?.message || 'Failed to generate deep plan from AI provider');
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
