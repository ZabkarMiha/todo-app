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
import { useSearchParams } from "next/navigation";

type PaginationBarProps = {
  tasksCount: number;
  currentPage: number;
  tasksPerPage: number;
  className?: string;
};

export default function PaginationBar({
  tasksCount,
  currentPage,
  tasksPerPage,
  className,
}: PaginationBarProps) {
  const maxPreviousPages = 0;
  const maxNextPages = 0;
  const totalPages = Math.ceil(tasksCount / tasksPerPage);

  const searchParams = useSearchParams();

  function getPageUrl(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `?${params.toString()}`;
  }

  return (
    <Pagination className={cn("m-0 w-fit", className)}>
      <PaginationContent>
        {currentPage > 1 && (
          <>
            <PaginationItem>
              <PaginationPrevious href={getPageUrl(currentPage - 1)} />
            </PaginationItem>

            {currentPage > maxPreviousPages + 1 && (
              <>
                <PaginationItem>
                  <PaginationLink href={getPageUrl(1)}>1</PaginationLink>
                </PaginationItem>
                {currentPage > maxPreviousPages + 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </>
            )}

            {[...Array(Math.min(maxPreviousPages, currentPage - 1))].map(
              (_, idx) => {
                const page =
                  currentPage -
                  (Math.min(maxPreviousPages, currentPage - 1) - idx);
                return (
                  <PaginationItem key={page}>
                    <PaginationLink href={getPageUrl(page)}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              },
            )}
          </>
        )}

        <PaginationItem>
          <PaginationLink href="#" isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {tasksCount - currentPage * tasksPerPage > 0 && (
          <>
            {[...Array(Math.min(maxNextPages, totalPages - currentPage))].map(
              (_, idx) => {
                const page = currentPage + idx + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink href={getPageUrl(page)}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              },
            )}

            {currentPage + maxNextPages < totalPages && (
              <>
                {currentPage + maxNextPages + 1 < totalPages && (
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
              <PaginationNext href={getPageUrl(currentPage + 1)} />
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
}
