"use client";
import { Button } from "@/app/_components/ui/button";
import { Layer, Like1, Dislike } from "iconsax-reactjs";
import { Rating } from "@/app/_components/ui/rating";
import Carousel from "@/app/_components/ui/carousel";
import type { CommentsProps } from "./types";

const SORT_OPTIONS = [
  "جدیدترین",
  "قدیمی ترین",
  "بیشترین امتیاز",
  "کمترین امتیاز",
] as const;

export default function Comments({ comments }: CommentsProps) {
  return (
    <>
      <div className="my-5 flex flex-col gap-5 lg:px-10">
        <div className="hidden items-center justify-between border-b border-gray-300 pb-5 lg:flex">
          <div className="flex items-center justify-between gap-4 text-lg">
            <p className="ml-5 flex items-center gap-2 text-lg font-medium">
              <Layer className="size-6 stroke-black" />
              مرتب سازی:
            </p>
            <div className="text-brand-primary cursor-pointer underline underline-offset-10">
              {SORT_OPTIONS[0]}
            </div>
            <div className="cursor-pointer">{SORT_OPTIONS[1]}</div>
            <div className="cursor-pointer">{SORT_OPTIONS[2]}</div>
            <div className="cursor-pointer">{SORT_OPTIONS[3]}</div>
          </div>
          <Button className="bg-brand-primary hover:bg-brand-primary-focus">
            نظر خود را ثبت کنید
          </Button>
        </div>
        {/* laptop view */}
        <div className="hidden flex-col gap-5 divide-y divide-gray-300 px-10 lg:flex">
          {comments?.map((comment) => (
            <div className="space-y-3 py-3" key={"comment-" + comment.id}>
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <p>کاربر ناشناس</p>
                  <Rating rate={5} />
                  <p className="text-sm">
                    {new Date(comment.created_at).toLocaleDateString("fa-IR")}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-18">
                  <p>ایا این نظر مفید بود؟</p>
                  <div className="flex items-center justify-between gap-10">
                    <div className="flex items-center gap-2">
                      <p>0</p>
                      <button className="cursor-pointer">
                        <Like1 className="size-6 stroke-black" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <p>0</p>
                      <button className="cursor-pointer">
                        <Dislike className="size-6 stroke-black" />
                      </button>
                    </div>
                  </div>
                </div>
                <button className="text-primary cursor-pointer text-xl">
                  پاسخ
                </button>
              </div>
              <div>{comment.comment}</div>
            </div>
          ))}
        </div>
        {/* mobile view */}
        <div className="space-y-5 lg:hidden">
          <Carousel rtl slides={{ perView: "auto", spacing: 12 }}>
            {comments?.map((comment) => (
              <div
                className="flex w-72 flex-col gap-4 rounded-lg border border-gray-300 p-3"
                key={"comment-" + comment.id}
              >
                <div className="flex w-fit flex-col gap-2">
                  <p>کاربر ناشناس</p>
                  <Rating rate={5} />
                  <p className="text-sm">
                    {new Date(comment.created_at).toLocaleDateString("fa-IR")}
                  </p>
                </div>

                <p className="line-clamp-4 h-20 w-full text-sm">
                  {comment.comment}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-primary cursor-pointer">پاسخ</p>
                  <div className="flex items-center gap-12">
                    <div className="flex items-center gap-2">
                      <p>0</p>
                      <button className="cursor-pointer">
                        <Like1 className="stroke-success size-6" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <p>0</p>
                      <button className="cursor-pointer">
                        <Dislike className="stroke-error size-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
          <Button>نظر خود را ثبت کنید</Button>
        </div>
      </div>
    </>
  );
}
