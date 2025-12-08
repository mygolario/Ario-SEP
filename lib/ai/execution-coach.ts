import { ExecutionPlanData } from '@/lib/types';
import { IdeaIntake } from '@prisma/client';

export async function generateExecutionPlan(
  project: IdeaIntake
): Promise<ExecutionPlanData> {
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

  const systemPrompt = `تو یک کوچ اجرایی برای بنیان‌گذاران استارتاپ هستی.
باید برای ایده زیر یک "برنامه اجرای اولیه" برای چند هفته اول بچینی؛ طوری که:
- ساده و قابل‌انجام باشد
- برای یک آدم معمولی قابل فهم باشد
- فقط روی چند کار مهم و ضروری تمرکز کند

خروجی را فقط و فقط به صورت JSON معتبر (بدون هیچ متن اضافی بیرون از JSON) برگردان، با ساختار زیر:

type ExecutionTask = {
  id: string;          // شناسه یکتا
  title: string;       // عنوان کوتاه تسک (فارسی)
  description?: string; // توضیح کمی عمیق‌تر، فارسی
  category: "تحقیق" | "محصول" | "بازاریابی" | "مالی" | "ذهنیت و نظم شخصی" | string;
  suggestedDuration?: string; // مثلا: "۳۰ تا ۶۰ دقیقه"
  difficulty?: "خیلی سبک" | "متوسط" | "سنگین" | string;
};

type ExecutionWeek = {
  id: string;
  order: number;
  label: string;       // مثلا: "هفته اول", "هفته دوم", "ماه اول"
  focus: string;       // توضیح کلی تمرکز این هفته
  tasks: ExecutionTask[];
};

type ExecutionPlanData = {
  summary: {
    title: string;
    description: string; // توضیح کلی درباره رویکرد اجرای قدم‌های اول (۲-۳ پاراگراف)
  };
  weeks: ExecutionWeek[];
  reminders: string[]; // چند نکته تکراری مهم
};

قواعد مهم:
- همه متن‌ها باید کاملاً فارسی و روان باشند.
- از هیچ واژه انگلیسی در title, description, label, focus, category یا متن تسک‌ها استفاده نکن.
- تعداد هفته‌ها می‌تواند بین ۲ تا ۵ باشد (مثلاً: هفته اول، هفته دوم، هفته سوم، یا ماه اول).
- تعداد تسک‌ها در هر هفته را محدود نگه دار (مثلاً بین ۳ تا ۷ تسک)، تا کاربر حس نکند غرق شده است.
- تسک‌ها را تا حد ممکن مشخص و قابل انجام بنویس، نه کلی و مبهم.`;

  const userPrompt = `
اطلاعات ایده:
- ایده در یک جمله: ${project.ideaOneLiner}
- مشکل: ${project.problem}
- راه‌حل: ${project.solution}
- مشتری یا مخاطب هدف: ${project.audience}

لطفاً برنامه اجرای اولیه را بساز.`;

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
    throw new Error(errorData.error?.message || 'Failed to generate execution plan');
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch (e) {
    throw new Error('Failed to parse AI response');
  }
}
