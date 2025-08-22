import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Skeleton } from "./skeleton";

export default function ProductCardSkeleton() {
  return (
    <Card className="w-[119px] gap-0 bg-white p-2 shadow-none lg:w-[184px] lg:gap-2 lg:px-3.5 lg:py-4">
      <CardHeader className="flex h-4 items-center justify-between p-0">
        <Skeleton className="h-full w-full bg-gray-200" />
      </CardHeader>
      <CardContent className="flex flex-col p-0 lg:gap-2">
        <Skeleton className="aspect-square w-full bg-gray-200" />
        <CardTitle className="line-clamp-2 p-0 text-center text-[10px] leading-[140%] font-medium lg:text-xs">
          <Skeleton className="h-8.5 w-full bg-gray-200" />
        </CardTitle>
      </CardContent>
      <CardFooter className="flex-col gap-0 self-end p-0 lg:gap-2 w-full">
        <div className="h-3.5" />
        <div className="h-6 w-30 self-end lg:h-7">
          <Skeleton className="h-full w-full bg-gray-200" />
        </div>
      </CardFooter>
    </Card>
  );
}
