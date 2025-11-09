"use client"

import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { TriangleUpIcon } from "@radix-ui/react-icons"

type SortTasksProps = {
  className?: string
}

export default function SortTasks({ className }: SortTasksProps) {
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const sortOrder = new URLSearchParams(searchParams).get("sort") || "newest"

  function toggleSortOrder() {
    const params = new URLSearchParams(searchParams)
    const newOrder = sortOrder === "newest" ? "oldest" : "newest"
    params.set("sort", newOrder)
    replace(`?${params.toString()}`)
  }

  return (
    <div
      className={cn(
        "h-full flex flex-row justify-center items-center",
        className
      )}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSortOrder}
        className="flex items-center space-x-0 w-fit justify-center p-2 xl:p-4 xl:space-x-2"
      >
        <p className="text-sm hidden xl:block">Date</p>
        <TriangleUpIcon
          className={cn(
            "h-6 w-6 transition-transform duration-200",
            sortOrder === "newest" ? "rotate-180" : "rotate-0"
          )}
        />
      </Button>
    </div>
  )
}
