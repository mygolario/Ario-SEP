import { FundingPlanData } from '@/lib/types';

export async function generateFundingRoadmap(
  projectData: any
): Promise<FundingPlanData> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  const apiUrl = process.env.OPENROUTER_API_KEY
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
  
  const model = process.env.OPENROUTER_API_KEY
    ? 'openai/gpt-4o'
    : 'gpt-4o';

  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const systemPrompt = `تو یک مشاور استارتاپ و برنامه‌ریز مالی هستی.
باید برای ایده داده شده یک "نقشه راه تأمین مالی" ساده و واقع‌بینانه بنویسی.

فرض کن تیم در مرحله خیلی ابتدایی است و می‌خواهد بداند:
- در چند مرحله کلی، چه نوع پولی لازم دارد
- هر مرحله تقریبا برای چه بازه زمانی است
- پول در هر مرحله بیشتر قرار است کجا خرج شود
- به چه خروجی‌هایی باید برسد تا بتواند وارد مرحله بعد شود

خروجی را فقط و فقط به صورت JSON معتبر (بدون هیچ متن اضافی بیرون از JSON) برگردان، با این ساختار تایپ‌اسکریپت:

type FundingPhase = {
  id: string;
  order: number;
  title: string;         // فارسی
  timeframe: string;     // مثلاً: "۳ تا ۶ ماه اول"
  goal: string;          // هدف اصلی این مرحله
  amountSummary: string; // توضیح کیفی درباره مقدار پول موردنیاز
  spendCategories: {
    name: string;        // فارسی
    description: string; // فارسی
  }[];
  milestones: string[];  // چند خروجی مهم
  risks?: string[];      // ریسک‌های خاص این مرحله
};

type FundingPlanData = {
  overallStrategy: {
    title: string;
    description: string; // توضیح کلی درباره رویکرد مالی (۲-۳ پاراگراف)
  };
  phases: FundingPhase[];
  generalNotes: string[]; // چند نکته کلی درباره مدیریت پول
};

همه متن‌ها باید کاملاً فارسی، روان و بدون هیچ کلمه انگلیسی باشند.
نکات را طوری بنویس که برای یک بنیان‌گذار تازه‌کار ایرانی قابل فهم و عمل باشد.
از عددسازی جزئی و غیرواقعی خودداری کن و بیشتر توضیح کیفی بده.`;

  const userPrompt = `
اطلاعات ایده:
- ایده: ${projectData.title}
- مشکل: ${projectData.description}
- مخاطب هدف: ${projectData.targetAudience}

لطفاً نقشه راه تأمین مالی را بساز.`;

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
    throw new Error(errorData.error?.message || 'Failed to generate funding plan');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error('Failed to parse AI response');
  }
}
