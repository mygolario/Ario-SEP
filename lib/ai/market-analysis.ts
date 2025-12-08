import { MarketAnalysisData } from '@/lib/types';

export async function generateMarketAnalysis(
    project: any // IdeaIntake type really
  ): Promise<MarketAnalysisData> {
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
  
    const systemPrompt = `تو یک تحلیل‌گر بازار و مشاور استارتاپ هستی. باید برای ایده زیر یک تحلیل کلی از بازار و رقبا آماده کنی.
    خروجی را فقط و فقط به صورت JSON معتبر (بدون هیچ متن اضافی بیرون از JSON) برگردان، با این ساختار تایپ اسکریپت:
  
    type MarketSegment = {
      name: string;        // نام فارسی بخش بازار
      description: string; // توضیح فارسی
      needs: string[];     // فهرست نیازها
    };
    
    type CompetitorRow = {
      name: string;          // نام رقیب
      type: string;          // "مستقیم" یا "غیرمستقیم"
      strengths: string[];   // نقاط قوت
      weaknesses: string[];  // نقاط ضعف
    };
    
    type MarketAnalysisData = {
      overview: {
        title: string;
        description: string;
      };
      segments: MarketSegment[];
      layers: {
        overallMarket: string;  // توضیح فارسی TAM (کل بازار بالقوه)
        targetMarket: string;   // توضیح فارسی SAM (بازار هدف)
        reachableMarket: string; // توضیح فارسی SOM (بازار قابل دسترس)
      };
      competitors: {
        title: string;
        description: string;
        items: CompetitorRow[];
      };
      opportunities: {
        title: string;       // عنوان بخش فرصت‌ها
        bullets: string[];   // لیست فرصت‌ها
      };
      risks: {
        title: string;       // عنوان بخش ریسک‌ها
        bullets: string[];   // لیست ریسک‌ها
      };
    };
  
    نکات مهم:
    1. همه متن‌ها باید کاملاً فارسی و روان باشند و از هیچ واژه‌ی انگلیسی استفاده نشود.
    2. توضیحات را طوری بنویس که یک آدم غیرتخصصی هم بتواند بفهمد.
    3. تحلیل‌ها واقعی و منطقی باشند.`;
  
    const userPrompt = `
  اطلاعات ایده:
  - ایده: ${project.ideaOneLiner}
  - مشکل: ${project.problem}
  - راه‌حل: ${project.solution}
  - مخاطب هدف: ${project.audience}
  
  لطفاً تحلیل کامل بازار را با فرمت JSON خواسته شده تولید کن.
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
      throw new Error(errorData.error?.message || 'Failed to generate market analysis');
    }
  
    const data = await response.json();
    const content = data.choices[0].message.content;
  
    try {
      return JSON.parse(content);
    } catch (e) {
      throw new Error('Failed to parse AI response');
    }
  }
