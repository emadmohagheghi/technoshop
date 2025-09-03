const specifications = [
  {
    label: "نوع کارتابری",
    value: "عمومی/طراحی",
  },
  {
    label: "ابعاد نمایشگر",
    value: "13.3 اینچ",
  },
  {
    label: "سری پردازنده",
    value: "Apple M1",
  },
  {
    label: "ظرفیت حافظه RAM",
    value: "8 گیگابایت",
  },
  {
    label: "سازنده پردازنده گرافیکی",
    value: "Apple",
  },
  {
    label: "ظرفیت حافظه داخلی",
    value: "256 گیگابایت",
  },
];

export default function Features() {
  console.log("hi")
  return (
    <div className="border-brand-primary overflow-hidden rounded-lg space-y-4 pt-10">
      <h3 className="text-base font-medium lg:text-xl">ویژگی ها</h3>
      <div className="divide-brand-primary border-brand-primary divide-y divide-dashed rounded-xl border-2">
        {specifications.map((spec, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-2 py-4 text-xs lg:text-sm"
          >
            <span className="text-gray-700">{spec.label}:</span>
            <span>{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
