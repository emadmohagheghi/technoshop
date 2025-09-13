import { Steps } from "./_components/steps";
import OrderSummaryWrapper from "./_components/order-summery/order-summary-wrapper";

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="xs:px-10 container px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">تسویه حساب</h1>
      <Steps />
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2">{children}</div>
        <div className="relative col-span-1 lg:col-span-1">
          <div className="sticky top-48">
            <OrderSummaryWrapper />
          </div>
        </div>
      </div>
    </div>
  );
}
