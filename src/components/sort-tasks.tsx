"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Triangle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

type SortTasksProps = {
  className?: string;
};

export default function SortTasks({ className }: SortTasksProps) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const sortOrder = new URLSearchParams(searchParams).get("sort") || "newest";

  function toggleSortOrder() {
    const params = new URLSearchParams(searchParams);
    const newOrder = sortOrder === "newest" ? "oldest" : "newest";
    params.set("sort", newOrder);
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
        className="flex w-fit items-center justify-center space-x-0 p-2 xl:space-x-2 xl:p-4"
      >
        <p className="hidden text-sm xl:block">Date</p>
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
