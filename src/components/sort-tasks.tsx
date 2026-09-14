"use client";

import { Button } from "@/components/ui/button";
import { SortKeys, SortOrders } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ListFilter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

type SortTasksProps = {
  className?: string;
};

export default function SortTasks({ className }: SortTasksProps) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const sortOrder: SortOrders =
    (searchParams.get("sortOrder") as SortOrders) || "descending";
  const sortKey: SortKeys =
    (searchParams.get("sortKey") as SortKeys) || "dateAdded";

  function toggleSortKey(value: string) {
    const params = new URLSearchParams(searchParams);

    params.set("sortKey", value);
    params.set("page", "1");

    replace(`${pathname}?${params.toString()}`);
  }

  function toggleSortOrder(value: string) {
    const params = new URLSearchParams(searchParams);

    params.set("sortOrder", value);
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="flex w-fit items-center justify-center space-x-0 p-2 sm:space-x-1 sm:p-2"
          >
            <p className="hidden text-sm sm:block">Filter</p>
            <ListFilter />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Sort by:</DropdownMenuLabel>
            <DropdownMenuItem>
              <RadioGroup
                value={sortKey}
                onValueChange={(e) => toggleSortKey(e)}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="dateAdded" id="r1" />
                  <Label htmlFor="r1">Date added</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="completed" id="r2" />
                  <Label htmlFor="r2">Completed</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="dueDate" id="r3" />
                  <Label htmlFor="r3">Due date</Label>
                </div>
              </RadioGroup>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Sorting order:</DropdownMenuLabel>
            <DropdownMenuItem>
              <RadioGroup
                defaultValue={sortOrder}
                onValueChange={(e) => toggleSortOrder(e)}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="descending" id="r1" />
                  <Label htmlFor="r1">Descending</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="ascending" id="r2" />
                  <Label htmlFor="r2">Ascending</Label>
                </div>
              </RadioGroup>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
