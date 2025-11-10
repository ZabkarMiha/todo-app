"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "./ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type SearchProps = {
  className?: string;
};

export default function Search({ className }: SearchProps) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    params.set("page", "1");
    replace(`?${params.toString()}`);
  }

  return (
    <div className={cn("relative flex items-center", className)}>
      <MagnifyingGlassIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-6 w-6 -translate-y-1/2" />
      <Input
        type="text"
        id="search"
        placeholder="Search tasks..."
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10 text-base"
        value={searchParams.get("query") || ""}
      />
    </div>
  );
}
