import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { callSepModel } from "@/lib/openrouter";

// --- Internal Prompts ---

function buildDeepPlanPromptA(project: any) {
  return `
تو یک مشاور استراتژی استارتاپ هستی که برای بنیان‌گذاران ایرانی کار می‌کنی.
باید برای این ایده یک «برنامه عمیق» در سطح گزارش مشاور حرفه‌ای بنویسی.

هدف:
- کمک به بنیان‌گذار برای فهم بهتر ایده‌اش
- روشن کردن مشتری، مسئله، راه‌حل و بازار
- ترسیم مسیر ۹۰ روز اول و بعد از آن
- نشان‌دادن ریسک‌ها و معیارهای سنجش پیشرفت

اطلاعات ایده:
- ایده در یک جمله: ${project.ideaOneLiner}
- مشکل: ${project.problem}
- راه‌حل: ${project.solution}
- مشتری یا مخاطب هدف: ${project.audience}

از چند چارچوب شناخته‌شده در ذهن خودت استفاده کن (مثل JTBD، تحلیل بازار، تحلیل رقبا، ریسک‌ها و شاخص‌ها)،
اما اسم این چارچوب‌ها را در متن نیاور. فقط خروجی‌ات باید باهوش، منظم و قابل‌فهم برای یک بنیان‌گذار ایرانی باشد.

خروجی را فقط و فقط به صورت JSON معتبر (بدون هیچ متن اضافی بیرون از JSON) برگردان، با این ساختار:

{
  "overview": {
    "id": "overview",
    "title": "یک عنوان کوتاه برای نمای کلی ایده",
    "description": "۳ تا ۵ پاراگراف کوتاه که توضیح می‌دهد این ایده چه مسئله‌ای را در کدام بازار حل می‌کند و مسیر کلی آن چیست.",
    "bullets": [
      "۴ تا ۷ نکته کلیدی درباره تصویر کلی ایده، بازار و ارزش پیشنهادی"
    ]
  },
  "customerAndProblem": {
    "id": "customerAndProblem",
    "title": "مشتری و مسئله",
    "description": "۲ تا ۴ پاراگراف که توضیح می‌دهد مشتری ایده چه کسی است، در چه موقعیتی قرار دارد و چه درد و مسئله‌ای را تجربه می‌کند.",
    "bullets": [
      "چند جمله که وضعیت فعلی زندگی/کار مشتری را توصیف می‌کند.",
      "چند نمونه از دردسرها و احساسات مشتری نسبت به این مسئله.",
      "اگر چند دسته مشتری متفاوت وجود دارد، هر کدام را کوتاه توضیح بده."
    ]
  },
  "solutionAndProduct": {
    "id": "solutionAndProduct",
    "title": "راه‌حل و محصول",
    "description": "۲ تا ۴ پاراگراف که توضیح می‌دهد این سرویس یا محصول دقیقاً چه کار می‌کند و چه تغییری در زندگی/کار مشتری ایجاد می‌کند.",
    "bullets": [
      "۳ تا ۷ ویژگی یا مزیت اصلی راه‌حل.",
      "توضیح اینکه چه چیزی این ایده را نسبت به گزینه‌های فعلی متمایز می‌کند.",
      "اگر امکان‌پذیر است، یک مثال ساده از تجربه واقعی مشتری با این محصول بنویس."
    ]
  },
  "roadmap90Days": {
    "id": "roadmap90Days",
    "title": "برنامه ۹۰ روز اول",
    "description": "۱ تا ۳ پاراگراف که تصویر کلی سه ماه اول را توضیح می‌دهد (تمرکز، یادگیری و ساخت).",
    "bullets": [
      "ماه اول: روی چه چیزهایی باید تمرکز شود (مثل: روشن‌تر کردن مسئله، صحبت با چند مشتری، ساخت نمونه اولیه سبک).",
      "ماه دوم: چه کارهایی برای اعتبارسنجی، تست و اصلاح باید انجام شود.",
      "ماه سوم: چه کارهایی برای آماده‌شدن برای نسخه عمومی‌تر / لندینگ / اولین کاربران جدی باید انجام شود."
    ]
  },
  "risks": {
    "id": "risks",
    "title": "ریسک‌ها و خطاهای رایج",
    "description": "۱ تا ۳ پاراگراف درباره خطرات اصلی این ایده در بازار و اشتباهاتی که معمولاً بنیان‌گذاران در این فضا مرتکب می‌شوند.",
    "bullets": [
      "۳ تا ۷ ریسک مهم (مثلاً: نبود تقاضای واقعی، اشباع بازار، هزینه جذب مشتری، مشکل در اجرا و...).",
      "چند اشتباه رایج که باید از آن‌ها پرهیز شود."
    ]
  },
  "metrics": {
    "id": "metrics",
    "title": "معیارهای پیشرفت",
    "description": "۱ تا ۲ پاراگراف که توضیح می‌دهد بنیان‌گذار باید روی چه نوع عددها و نشانه‌هایی تمرکز کند.",
    "bullets": [
      "چند معیار ساده برای ماه‌های اول (مثل تعداد مکالمه واقعی با مشتری، تعداد کاربر فعال اولیه، نرخ بازگشت، نرخ تبدیل در لندینگ و...).",
      "توضیح اینکه این معیارها چگونه نشان می‌دهند ایده در مسیر درست است یا نه."
    ]
  }
}

قواعد مهم:
- همه عنوان‌ها و توضیحات باید کاملاً فارسی، روان و قابل‌فهم برای یک بنیان‌گذار تازه‌کار باشند.
- از هیچ واژه‌ی انگلیسی در متن‌ها استفاده نکن.
- توضیحات را طوری بنویس که حس یک گزارش مشاوره حرفه‌ای بدهد، نه یک مقاله کلی و سطحی.
- فقط JSON معتبر برگردان و هیچ چیز دیگر بیرون از JSON ننویس.
`;
}

function buildDeepPlanPromptB(project: any) {
  return `
تو یک مشاور استارتاپ فارسی‌زبان هستی و باید برای این ایده یک «برنامه عمیق» بسازی.

اطلاعات ایده:
- ایده در یک جمله: ${project.ideaOneLiner}
- مشکل: ${project.problem}
- راه‌حل: ${project.solution}
- مشتری یا مخاطب هدف: ${project.audience}

خروجی را فقط و فقط به صورت JSON معتبر (بدون هیچ متن اضافی بیرون از JSON) برگردان، با این ساختار:

{
  "overview": {
    "id": "overview",
    "title": "یک عنوان کوتاه برای نمای کلی ایده",
    "description": "چند پاراگراف کوتاه که مسیر کلی این ایده را توضیح می‌دهد.",
    "bullets": [
      "۳ تا ۵ نکته کلیدی درباره تصویر کلی ایده"
    ]
  },
  "customerAndProblem": {
    "id": "customerAndProblem",
    "title": "مشتری و مسئله",
    "description": "توضیحی روان درباره اینکه مشتری کیست و دقیقاً چه مشکلی دارد.",
    "bullets": [
      "چند مثال از وضعیت فعلی مشتری",
      "احساسات و دردسرهایی که تجربه می‌کند"
    ]
  },
  "solutionAndProduct": {
    "id": "solutionAndProduct",
    "title": "راه‌حل و محصول",
    "description": "توضیح درباره اینکه این سرویس یا محصول چه کاری انجام می‌دهد و چه تغییری ایجاد می‌کند.",
    "bullets": [
      "چند ویژگی یا مزیت اصلی راه‌حل",
      "چیزی که این راه‌حل را متفاوت می‌کند"
    ]
  },
  "roadmap90Days": {
    "id": "roadmap90Days",
    "title": "برنامه ۹۰ روز اول",
    "description": "توضیح کلی درباره اولویت‌ها در سه ماه اول.",
    "bullets": [
      "ماه اول: ...",
      "ماه دوم: ...",
      "ماه سوم: ..."
    ]
  },
  "risks": {
    "id": "risks",
    "title": "ریسک‌ها و خطاهای رایج",
    "description": "توضیحی درباره خطرات و اشتباهاتی که این ایده ممکن است با آن روبه‌رو شود.",
    "bullets": [
      "چند ریسک مهم",
      "چند اشتباه رایج بنیان‌گذاران در این فضا"
    ]
  },
  "metrics": {
    "id": "metrics",
    "title": "معیارهای پیشرفت",
    "description": "توضیح درباره این‌که از کجا بفهمیم ایده در مسیر درستی حرکت می‌کند.",
    "bullets": [
      "چند معیار ساده و قابل اندازه‌گیری در ماه‌های اول"
    ]
  }
}

قواعد مهم:
- همه عنوان‌ها و توضیحات باید کاملاً فارسی و روان باشند.
- از هیچ واژه‌ی انگلیسی در متن‌ها استفاده نکن.
- فقط JSON معتبر برگردان و هیچ چیز دیگر بیرون از JSON ننویس.
`;
}

function buildDeepPlanMergerPrompt(project: any, planA: string, planB: string) {
  return `
تو یک مشاور ارشد استارتاپ هستی.
دو نسخه «برنامه عمیق» برای یک ایده داری (از دو مدل مختلف). باید از این دو نسخه، یک نسخه نهایی و بهتر بسازی.

اطلاعات ایده:
- ایده در یک جمله: ${project.ideaOneLiner}
- مشکل: ${project.problem}
- راه‌حل: ${project.solution}
- مشتری یا مخاطب هدف: ${project.audience}

نسخه اول برنامه عمیق (Plan A, JSON):
${planA}

نسخه دوم برنامه عمیق (Plan B, JSON):
${planB}

کار تو:
- نقاط قوی هر دو برنامه را نگه دار.
- توضیحات تکراری و مبهم را حذف کن.
- اگر در یک بخش، یکی از پلن‌ها توضیح بهتری دارد، همان را نگه دار.
- اگر یک نکته مفید فقط در یکی از پلن‌ها آمده، آن را هم اضافه کن.
- در نهایت فقط یک JSON برگردان با همان ساختار قبلی:

{
  "overview": {...},
  "customerAndProblem": {...},
  "solutionAndProduct": {...},
  "roadmap90Days": {...},
  "risks": {...},
  "metrics": {...}
}

فقط و فقط JSON معتبر برگردان، بدون هیچ جمله اضافی بیرون از JSON.
همه متن‌ها فارسی و روان باشند.
`;
}

// --- API Handler ---

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const { id } = await params;

    const project = await prisma.ideaIntake.findUnique({
      where: { id },
    });

    if (!project || (project.userId && project.userId !== user.id && user.role !== "ADMIN")) {
      return NextResponse.json(
        { error: "پروژه یافت نشد یا دسترسی ندارید." },
        { status: 404 }
      );
    }

    // 1. Build Prompts
    const promptA = buildDeepPlanPromptA(project);
    const promptB = buildDeepPlanPromptB(project);

    // 2. Call PLAN_A and PLAN_B in parallel
    const [planAContent, planBContent] = await Promise.all([
      callSepModel("PLAN_A", [
        { role: "system", content: "تو یک مشاور استراتژی استارتاپ فارسی‌زبان هستی." },
        { role: "user", content: promptA },
      ]),
      callSepModel("PLAN_B", [
        { role: "system", content: "تو یک مشاور استارتاپ فارسی‌زبان هستی." },
        { role: "user", content: promptB },
      ]),
    ]);

    // 3. Call MERGER to combine results
    const mergerPrompt = buildDeepPlanMergerPrompt(project, planAContent, planBContent);

    const mergedContent = await callSepModel("MERGER", [
      { role: "system", content: "تو یک ادیتور ارشد برنامه‌های استراتژیک هستی و فقط JSON معتبر برمی‌گردانی." },
      { role: "user", content: mergerPrompt },
    ]);

    // 4. Parse the JSON
    let deepPlanJson: any;
    try {
      // clean markdown code blocks if present
      const cleaned = mergedContent.replace(/```json\n?|```/g, "").trim();
      deepPlanJson = JSON.parse(cleaned);
    } catch (e) {
      console.error("Failed to parse merged deep plan JSON:", mergedContent);
      return NextResponse.json(
        { error: "خروجی مدل قابل پردازش نبود. لطفاً دوباره تلاش کن.", details: mergedContent },
        { status: 500 }
      );
    }

    // 5. Save to Prisma using nested upsert for the relation
    const updated = await prisma.ideaIntake.update({
      where: { id: project.id },
      data: {
        deepPlan: {
          upsert: {
            create: {
              data: deepPlanJson,
            },
            update: {
              data: deepPlanJson,
            },
          },
        },
      },
      include: {
        deepPlan: true,
      },
    });

    // @ts-ignore: Stale Prisma types - deepPlan is included but not in the stale type definition
    const deepPlanResult = (updated as any).deepPlan;

    return NextResponse.json({
      success: true,
      deepPlan: deepPlanResult,
    });

  } catch (error) {
    console.error("Deep Plan Ensemble Error:", error);
    return NextResponse.json(
      { error: "خطایی در ساخت برنامه عمیق پیش آمد." },
      { status: 500 }
    );
  }
}
