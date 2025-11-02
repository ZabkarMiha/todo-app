import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col h-full mx-5 mb-32 md:mx-10 xl:mx-20">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:mx-0 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton
            key={index}
            className="w-full rounded-md h-60"
          />
        ))}
      </div>
      <div className="fixed left-0 right-0 bottom-2 z-50 w-[calc(100svw-1rem)] p-2 flex flex-col space-y-1 mx-auto md:flex-row md:self-center md:justify-center md:space-y-0 md:space-x-1 xl:w-fit xl:bottom-10">
        <Skeleton className="w-80 h-12"/>
      </div>
    </div>
  )
}
