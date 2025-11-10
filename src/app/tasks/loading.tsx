import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col mx-5 mb-2 mt-2 md:mx-10 xl:mx-20">
      <div className="hidden gap-5 2xl:grid 2xl:grid-cols-4 2xl:mx-0">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="w-full rounded-md h-[40dvh]" />
        ))}
      </div>
      <div className="hidden gap-5 xl:grid 2xl:hidden xl:grid-cols-3 xl:mx-0">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="w-full rounded-md h-[40dvh]" />
        ))}
      </div>
      <div className="hidden gap-5 md:grid xl:hidden md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="w-full rounded-md h-[40dvh]" />
        ))}
      </div>
      <div className="grid gap-5 md:hidden grid-cols-1">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton key={index} className="w-full rounded-md h-[40dvh]" />
        ))}
      </div>
      <div className="sticky bottom-4 h-fit backdrop-blur-xl p-2 mx-2 rounded-md md:mx-0 md:self-center">
        <Skeleton className="w-full h-24 md:h-12 md:w-lg" />
      </div>
    </div>
  )
}
