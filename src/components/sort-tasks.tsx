"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Triangle } from "lucide-react";
import { useRouter } from "next/navigation";

type SortTasksProps = {
  className?: string;
  sortOrder: string;
};

export default function SortTasks({ className, sortOrder }: SortTasksProps) {
  const { replace } = useRouter();

  function toggleSortOrder() {
    const params = new URLSearchParams(window.location.search);
    const sort = sortOrder === "newest" ? "oldest" : "newest";
    params.set("sortOrder", sort);
    replace(`?${params.toString()}`);
  }

  return (
    <div
      className={cn(
        "flex h-full flex-row items-center justify-center",
        className,
      )}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSortOrder}
        className="flex w-fit items-center justify-center space-x-0 p-2 sm:space-x-1 sm:p-2"
      >
        <p className="hidden text-sm sm:block">Date</p>
        <Triangle
          className={cn(
            "h-6 w-6 transition-transform duration-200",
            sortOrder === "newest" ? "rotate-180" : "rotate-0",
          )}
        />
      </Button>
    </div>
  );
}
