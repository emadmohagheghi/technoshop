import { renderEditorJS } from "@/utils/renderEditorJS";

// sample information
const sampleInformation = {
  time: 1635603431943,
  blocks: [
    {
      type: "header" as const,
      data: {
        text: "نگاهی به مک بوک ایر MGN63 2020",
        level: 2,
      },
    },
    {
      type: "paragraph" as const,
      data: {
        text: "لپ تاپ 13 اینچی اپل مدل MacBook Air MGN63 2020، نخستین لپ تاپ کمپانی اپل با تراشه قدرتمند و اختصاصی M1 است که با توان پردازشی بالای خود قادر است دستورات کاربران را در سریع‌ترین زمان ممکن مدیریت کند. مک بوک ایر MGN63 2020 به نمایشگر 13.3 اینچی رتینا با پشتیبانی از فناوری HDR10 مجهز شده و کیبورد حرفه‌ای Magic Keyboard اپل، تجربه‌ای متفاوت از تایپ کردن را برای کاربران رقم خواهد زد. افزون بر این، وجود امکاناتی مانند تاچ آی دی و پورت‌های USB-C با پشتیبانی از فناوری تاندربولت، مک بوک پیش رو را به محصولی همه‌فن حریف تبدیل می‌کنند.",
      },
    },
    {
      type: "image" as const,
      data: {
        file: {
          url: "/images/example.png",
        },
        caption: "تصویر نمونه",
      },
    },
    {
      type: "header" as const,
      data: {
        text: "طراحی و کیفیت ساخت Macbook Air 2020 MGN63",
        level: 2,
      },
    },
    {
      type: "paragraph" as const,
      data: {
        text: "در طراحی مک بوک ایر 2020، اپل از آلیاژ آلومینیوم برای تولید بدنه اصلی استفاده کرده و طراحی مهندسی این لپ تاپ باعث شده تا وزن آن به فقط 1.29 کیلوگرم برسد؛ این یعنی کاربران بدون نگرانی می‌توانند لپ تاپ را همه‌جا همراه خود داشته باشند. سیستم بدون فن، یکی دیگر از نقاط قوت در طراحی مک بوک ایر MGN63 2020 بوده و باعث می‌شود تا حتی موقع پردازش‌های سنگین نیز دستگاه، کمترین صدا را داشته باشد.",
      },
    },
  ],
  version: "2.24.3",
};

export default function Review() {
  return (
    <>
      <div className="flex flex-col items-center gap-5 p-5">
        {renderEditorJS(sampleInformation)}
      </div>
    </>
  );
}
