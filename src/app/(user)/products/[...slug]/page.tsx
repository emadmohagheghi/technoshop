import ImageSlider from "./_components/image-slider";
import ProductInfo from "./_components/product-info";
import Features from "./_components/features";
import ProductTabs from "./_components/product-tabs/product-tabs";
import { getProductByShortSlug } from "@/services/products-service";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const productSlug = resolvedParams.slug[0];

  try {
    const product = await getProductByShortSlug(Number(productSlug));
    const productTitle = product.title_ir;
    const brandName = product.brand?.title_ir || "";
    const imageUrl = product.images?.[0]?.image?.name
      ? `https://technoshop.emadmo.ir/images/products/${product.images[0].image.name}`
      : "https://technoshop.emadmo.ir/images/logo.svg";

    return {
      title: product.meta_title || `${productTitle} | تکنوشاپ`,
      description:
        product.meta_description ||
        product.description ||
        `خرید ${productTitle} با بهترین قیمت و گارانتی معتبر از تکنوشاپ`,
      keywords: [productTitle, brandName, "خرید", "تکنوشاپ", "قیمت", "گارانتی"],
      openGraph: {
        title: product.meta_title || `${productTitle} | تکنوشاپ`,
        description:
          product.meta_description ||
          product.description ||
          `خرید ${productTitle} با بهترین قیمت`,
        url: `https://technoshop.emadmo.ir/products/${productSlug}`,
        siteName: "تکنوشاپ",
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: productTitle,
          },
        ],
        locale: "fa_IR",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.meta_title || `${productTitle} | تکنوشاپ`,
        description:
          product.meta_description ||
          product.description ||
          `خرید ${productTitle} با بهترین قیمت`,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: "محصول | تکنوشاپ",
      description: "مشاهده جزئیات محصول در تکنوشاپ",
    };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const resolvedParams = await params;
  const productSlug = resolvedParams.slug[0];

  const product = await getProductByShortSlug(Number(productSlug));

  return (
    <div>
      <div className="container p-3">
        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="flex w-full justify-center lg:w-4/12">
            <ImageSlider images={product.images} />
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
