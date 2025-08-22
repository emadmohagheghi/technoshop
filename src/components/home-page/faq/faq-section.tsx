import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// داده‌های نمونه برای سوالات متداول
const faqData = [
  {
    id: "item-1",
    question: "چگونه می‌توانم سفارش خود را پیگیری کنم؟",
    answer:
      "پس از ثبت سفارش، کد پیگیری برای شما ارسال خواهد شد. می‌توانید با وارد کردن این کد در بخش پیگیری سفارش، وضعیت سفارش خود را مشاهده کنید.",
  },
  {
    id: "item-2",
    question: "آیا امکان مرجوع کردن کالا وجود دارد؟",
    answer:
      "بله، شما می‌توانید تا ۷ روز پس از تحویل کالا، در صورت عدم رضایت و با حفظ شرایط اولیه کالا، درخواست مرجوعی دهید.",
  },
  {
    id: "item-3",
    question: "روش‌های پرداخت چه هستند؟",
    answer:
      "ما از روش‌های مختلف پرداخت شامل کارت‌های بانکی، پرداخت اینترنتی، و پرداخت در محل تحویل پشتیبانی می‌کنیم.",
  },
  {
    id: "item-4",
    question: "زمان ارسال کالا چقدر است؟",
    answer:
      "زمان ارسال بسته به نوع کالا و مقصد متفاوت است. معمولاً برای شهر تهران ۱-۳ روز کاری و برای سایر شهرها ۳-۷ روز کاری زمان نیاز است.",
  },
  {
    id: "item-5",
    question: "آیا هزینه ارسال رایگان است؟",
    answer:
      "برای سفارش‌های بالای ۵۰۰ هزار تومان، هزینه ارسال در شهر تهران رایگان است. برای مبالغ کمتر یا سایر شهرها، هزینه ارسال محاسبه و اعلام خواهد شد.",
  },
  {
    id: "item-6",
    question: "چگونه می‌توانم با پشتیبانی تماس بگیرم؟",
    answer:
      "شما می‌توانید از طریق تلفن ۰۲۱-۱۲۳۴۵۶۷۸، ایمیل support@shop.com یا چت آنلاین سایت با تیم پشتیبانی ما در ارتباط باشید.",
  },
];

export default function FAQSection() {
  return (
    <section>
      <div className="">
        <h2 className="text-brand-primary mb-4 text-2xl font-bold lg:text-3xl lg:font-medium">
          سوالات متداول
        </h2>

        <div className="">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="rounded-lg border border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800"
              >
                <AccordionTrigger className="py-6 text-right hover:no-underline">
                  <span className="text-xs font-medium text-black lg:text-lg">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-right">
                  <p className="pb-4 leading-7 text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
