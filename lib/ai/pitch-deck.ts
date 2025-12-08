import { PitchDeckData } from '@/lib/types';

export async function generatePitchDeck(
  projectData: any
): Promise<PitchDeckData> {
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

  const systemPrompt = `تو یک مشاور استارتاپ و مدرس ارائه به سرمایه‌گذار هستی.
باید برای ایده زیر یک اسکلت کامل Pitch Deck طراحی کنی که بنیان‌گذار بتواند بعداً اسلایدهایش را بر اساس آن بسازد.
خروجی را فقط و فقط به صورت JSON معتبر (بدون هیچ متن اضافی بیرون از JSON) برگردان. ساختار باید دقیقاً مطابق این تایپ اسکریپت باشد:

type PitchDeckSlide = {
  id: string;        // شناسه یکتا مثل cover, problem, solution
  order: number;     // ترتیب اسلاید از ۱
  title: string;     // عنوان فارسی
  subtitle?: string; // زیرعنوان فارسی
  body?: string;     // متن اصلی فارسی
  bullets?: string[]; // نکات کلیدی
  note?: string;      // نکته آموزشی برای ارائه دهنده
};

type PitchDeckData = {
  slides: PitchDeckSlide[];
};

لیست اسلایدها باید شامل موارد زیر باشد (به ترتیب):
1. cover (جلد)
2. problem (مشکل)
3. solution (راه‌حل)
4. product (محصول در عمل)
5. market (بازار)
6. businessModel (مدل درآمدی)
7. goToMarket (ورود به بازار)
8. competition (رقبا)
9. team (تیم)
10. ask (درخواست سرمایه)
11. closing (جمع‌بندی)

نکات مهم:
1. همه متن‌ها باید کاملاً فارسی، روان و مناسب ارائه به سرمایه‌گذار ایرانی باشد.
2. از کلمات انگلیسی در متن خروجی استفاده نکن (مگر اصطلاحات رایج که معادل فارسی ندارند).
3. لحن باید حرفه‌ای، امیدوارکننده و واقع‌بینانه باشد.`;

  const userPrompt = `
اطلاعات ایده:
- ایده: ${projectData.title}
- توضیح: ${projectData.description}
- مخاطب هدف: ${projectData.targetAudience}

لطفاً ساختار کامل Pitch Deck را با فرمت JSON تولید کن.`;

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
    throw new Error(errorData.error?.message || 'Failed to generate pitch deck');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error('Failed to parse AI response');
  }
}
