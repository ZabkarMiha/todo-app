"use client";

import { cn } from "@/lib/utils";
import { Search as SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui/input";

type SearchProps = {
  className?: string;
};

export default function Search({ className }: SearchProps) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    params.set("page", "1");

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className={cn("relative flex items-center", className)}>
      <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-6 w-6 -translate-y-1/2" />
      <Input
        type="text"
        id="search"
        placeholder="Search tasks..."
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 text-base"
        defaultValue={searchParams.get("query")?.toString()}
      />
    </div>
  );
}
