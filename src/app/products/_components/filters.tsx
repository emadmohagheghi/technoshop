"use client";
import { useProductsFilters } from "@/hooks/use-product-filter";
import { useHeaderStore } from "@/stores/header-data.store";
import { parsePriceFilter, formatPrice } from "@/utils/product";
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { Switch } from "@/app/_components/ui/switch";
import { Button } from "@/app/_components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/_components/ui/drawer";
import { Label } from "@/app/_components/ui/label";
import { Slider } from "@/app/_components/ui/slider";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/_components/ui/accordion";

const FilterContent = () => {
  const {
    filters: { brand, category, special, price },
    setters: { setBrand, setCategory, setSpecial, setPrice },
    actions: { clearFilters },
  } = useProductsFilters();

  const categories = useHeaderStore((state) => state.categories);
  const brands = useHeaderStore((state) => state.brands);

  // Parse price filter to get min and max values
  const { min, max } = parsePriceFilter(price);

  // Local state for slider values
  const [sliderValues, setSliderValues] = useState<[number, number]>([
    min ?? 0,
    max ?? 500_000_000,
  ]);

  // Update slider when price filter changes
  useEffect(() => {
    setSliderValues([min ?? 0, max ?? 500_000_000]);
  }, [min, max]);

  const handleBrandChange = (checked: boolean, brandId: string) => {
    const currentBrands = brand || [];
    if (checked) {
      setBrand([...currentBrands, brandId]);
    } else {
      setBrand(currentBrands.filter((id) => id !== brandId));
    }
  };

  const handlePriceChange = (values: number[]) => {
    setSliderValues([values[0], values[1]]);
  };

  const handlePriceCommit = (values: number[]) => {
    setPrice(values[0], values[1]);
  };

  return (
    <div className="max-h-150 w-full overflow-y-auto p-4">
      <div className="mb-8 flex w-full items-center justify-between">
        <p>فیلترها</p>
        <Button
          variant="link"
          onClick={clearFilters}
          className="text-error text-xs"
        >
          پاک کردن فیلترها
        </Button>
      </div>
      <div className="flex w-full items-center justify-between border-b py-4">
        <Label htmlFor="special-offers">فروش ویژه</Label>
        <Switch
          dir="ltr"
          checked={special}
          onCheckedChange={setSpecial}
          id="special-offers"
        />
      </div>
      <Accordion className="w-full items-start" type="multiple">
        {/* محدوده قیمت */}
        <AccordionItem value="price">
          <AccordionTrigger>محدوده قیمت</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 p-2">
              <div className="px-3">
                <Slider
                  value={sliderValues}
                  onValueChange={handlePriceChange}
                  onValueCommit={handlePriceCommit}
                  max={500_000_000}
                  min={0}
                  step={5_00_000}
                  className="w-full"
                  dir="rtl"
                />
              </div>
              <div className="flex items-center justify-between px-3 text-sm text-gray-600">
                <span>از: {formatPrice(sliderValues[0])} تومان</span>
                <span>تا: {formatPrice(sliderValues[1])} تومان</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* برند */}
        <AccordionItem value="brand">
          <AccordionTrigger>برند</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 px-3">
              {brands.map((brandItem) => (
                <div
                  key={brandItem.id}
                  className="flex items-center space-x-2 space-x-reverse"
                >
                  <Checkbox
                    id={`brand-${brandItem.id}`}
                    checked={brand?.includes(brandItem.id.toString()) ?? false}
                    onCheckedChange={(checked) =>
                      handleBrandChange(!!checked, brandItem.id.toString())
                    }
                  />
                  <Label
                    htmlFor={`brand-${brandItem.id}`}
                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {brandItem.title_ir}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* دسته‌بندی */}
        <AccordionItem value="category">
          <AccordionTrigger>دسته‌بندی</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 px-3">
              <RadioGroup
                dir="rtl"
                value={category ?? ""}
                onValueChange={(value) => setCategory(value || null)}
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="" id="all-categories" />
                  <Label htmlFor="all-categories">همه دسته‌بندی‌ها</Label>
                </div>
                {categories.map((categoryItem) => (
                  <div
                    key={categoryItem.id}
                    className="flex items-center space-x-2 space-x-reverse"
                  >
                    <RadioGroupItem
                      value={categoryItem.slug}
                      id={`category-${categoryItem.id}`}
                    />
                    <Label
                      htmlFor={`category-${categoryItem.id}`}
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {categoryItem.title_ir}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default function Filters() {
  return (
    <>
      {/* desktop */}
      <div className="hidden w-full rounded-lg bg-[#fff] shadow lg:block">
        <FilterContent />
      </div>
      {/* mobile */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex-1 !rounded-full lg:hidden bg-brand-primary text-white"
          >
            فیلتر ها
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>فیلتر محصولات</DrawerTitle>
          </DrawerHeader>
          <FilterContent />
          <DrawerClose asChild>
            <Button variant="outline" className="mb-2 w-full">
              بستن
            </Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    </>
  );
}
