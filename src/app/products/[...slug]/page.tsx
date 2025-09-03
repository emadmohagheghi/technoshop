import { readData } from "@/core/http-service";
import { ProductDetail } from "@/types/product.types";
import ImageSlider from "./_components/image-slider";
import ProductInfo from "./_components/product-info";
import Features from "./_components/features";
import ProductTabs from "./_components/product-tabs/product-tabs";


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

  const { images, stockrecord, title_ir, title_en } = product;

  return (
    <div>
      <div className="container p-3">
        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="flex w-full justify-center lg:w-4/12">
            <ImageSlider images={images} />
          </div>
          <div className="w-full lg:w-5/12">
            <ProductInfo {...product} />
          </div>
          <div className="w-full lg:w-3/12">
            <Features />
          </div>
        </div>
        <div>
          <ProductTabs />
        </div>
      </div>
    </div>
  );
}
