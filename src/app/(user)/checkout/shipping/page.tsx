import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import ShippingForm from "./_components/shipping-form";

export default function ShippingPage() {
  return (
    <div className="space-y-6">
      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات ارسال</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ShippingForm />
        </CardContent>
      </Card>
    </div>
  );
}
