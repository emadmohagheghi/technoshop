import { Steps } from "./_components/steps";

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container px-4 xs:px-10 py-8 overflow-hidden">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-2xl font-bold">تسویه حساب</h1>
        <Steps />
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
