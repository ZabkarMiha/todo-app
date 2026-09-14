"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

type PaginationBarProps = {
  className?: string;
  tasksCount: number;
  tasksPerPage: number;
  page: number;
};

export default function PaginationBar({
  className,
  tasksCount,
  tasksPerPage,
  page,
}: PaginationBarProps) {
  const maxPreviousPages = 0;
  const maxNextPages = 0;
  const totalPages = Math.ceil(tasksCount / tasksPerPage);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  function getPageUrl(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  }

  return (
    <Pagination className={cn("m-0 w-fit", className)}>
      <PaginationContent>
        {page > 1 && (
          <>
            <PaginationItem>
              <PaginationPrevious href={getPageUrl(page - 1)} />
            </PaginationItem>

            {page > maxPreviousPages + 1 && (
              <>
                <PaginationItem>
                  <PaginationLink href={getPageUrl(1)}>1</PaginationLink>
                </PaginationItem>
                {page > maxPreviousPages + 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </>
            )}

            {[...Array(Math.min(maxPreviousPages, page - 1))].map((_, idx) => {
              const pageItem =
                page - (Math.min(maxPreviousPages, page - 1) - idx);
              return (
                <PaginationItem key={pageItem}>
                  <PaginationLink href={getPageUrl(pageItem)}>
                    {pageItem}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
          </>
        )}

        <PaginationItem>
          <PaginationLink href="#" isActive>
            {page}
          </PaginationLink>
        </PaginationItem>

        {tasksCount - page * tasksPerPage > 0 && (
          <>
            {[...Array(Math.min(maxNextPages, totalPages - page))].map(
              (_, idx) => {
                const pageItem = page + idx + 1;
                return (
                  <PaginationItem key={pageItem}>
                    <PaginationLink href={getPageUrl(pageItem)}>
                      {pageItem}
                    </PaginationLink>
                  </PaginationItem>
                );
              },
            )}

            {page + maxNextPages < totalPages && (
              <>
                {page + maxNextPages + 1 < totalPages && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink href={getPageUrl(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext href={getPageUrl(page + 1)} />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}
