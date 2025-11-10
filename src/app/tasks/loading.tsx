import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-5 mt-2 mb-2 flex flex-col md:mx-10 xl:mx-20">
      <div className="hidden gap-5 2xl:mx-0 2xl:grid 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[40dvh] w-full rounded-md" />
        ))}
      </div>
      <div className="hidden gap-5 xl:mx-0 xl:grid xl:grid-cols-3 2xl:hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-[40dvh] w-full rounded-md" />
        ))}
      </div>
      <div className="hidden gap-5 md:grid md:grid-cols-2 xl:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-[40dvh] w-full rounded-md" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 md:hidden">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="h-[40dvh] w-full rounded-md" />
        ))}
      </div>
      <div className="sticky bottom-4 mx-2 h-fit rounded-md p-2 backdrop-blur-xl md:mx-0 md:self-center">
        <Skeleton className="h-24 w-full md:h-12 md:w-lg" />
      </div>
    </div>
  );
}
