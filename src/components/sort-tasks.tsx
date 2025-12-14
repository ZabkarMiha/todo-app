"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Triangle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SortTasksProps = {
  className?: string;
};

export default function SortTasks({ className }: SortTasksProps) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const sortOrder = searchParams.get("sortOrder") || "newest";

  function toggleSortOrder() {
    const params = new URLSearchParams(searchParams);
    const newSort = sortOrder === "newest" ? "oldest" : "newest";

    params.set("sortOrder", newSort);
    params.set("page", "1");

    replace(`${pathname}?${params.toString()}`);
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
