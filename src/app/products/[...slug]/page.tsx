import { readData } from "@/core/http-service";
import { ProductDetail } from "@/types/product.types";
import { ImageSlider } from "./_components/image-slider";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const resolvedParams = await params;
  const productSlug = resolvedParams.slug[0];

  const product = await readData<ProductDetail>(
    `http://localhost:8000/api/catalog/product/${productSlug}/`,
  ).then((response) => response.data);

  console.log(product);

  return (
    <div>
      <div className="container p-3">
        <div className="flex lg:flex-row gap-2 flex-col">
          <div className="w-full lg:w-4/12 flex justify-center">
            <ImageSlider images={product.images} />
          </div>
          <div className="bg-brand-primary w-full lg:w-5/12">1</div>
          <div className="bg-brand-primary-content w-full lg:w-3/12">2</div>
        </div>
      </div>
    </div>
  );
}
