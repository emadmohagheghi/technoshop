// create an array of information
const info = [
  { label: "دوربین", value: "3 تا" },
  { label: "حافظه داخلی", value: "256 گیگابایت" },
  { label: "حافظه رم", value: "8 گیگابایت" },
  { label: "پردازنده", value: "Apple M1" },
  { label: "گرافیک", value: "Apple M1" },
  { label: "سیستم عامل", value: "macOS" },
  { label: "وزن", value: "1.29 کیلوگرم" },
  { label: "ابعاد", value: "30.41 × 21.24 × 1.61 سانتیمتر" },
  { label: "رنگ", value: "نقره‌ای" },
  { label: "گارانتی", value: "یک ساله" },
];

export default function Specifications() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-start gap-8 overflow-hidden p-5">
        <p className="text-primary mt-4 text-lg md:text-3xl">مشخصات</p>
        <div className={`flex flex-col items-center justify-center gap-5`}>
          {info.map((item, index) => (
            <div
              key={index}
              className="flex w-full items-center justify-between rounded-lg bg-gray-100 p-6 text-sm md:text-lg"
            >
              <p>{item.label}</p>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
