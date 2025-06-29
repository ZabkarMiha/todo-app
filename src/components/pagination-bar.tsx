import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type PaginationBarProps = {
  tasksCount: number
  currentPage: number
  tasksPerPage: number
}

export default function PaginationBar({
  tasksCount,
  currentPage,
  tasksPerPage,
}: PaginationBarProps) {
  {
    const maxPreviousPages = 2
    const maxNextPages = 2
    const totalPages = Math.ceil(tasksCount / tasksPerPage)

    return (
      <Pagination className="outline outline-1 outline-container-outline rounded-md bg-container p-2 w-fit bottom-5 sticky">
        <PaginationContent>
          {currentPage > 1 && (
            <>
              <PaginationItem>
                <PaginationPrevious href={`/?page=${currentPage - 1}`} />
              </PaginationItem>

              {currentPage > maxPreviousPages + 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink href={`/?page=1`}>1</PaginationLink>
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
                    (Math.min(maxPreviousPages, currentPage - 1) - idx)
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink href={`/?page=${page}`}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }
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
                  const page = currentPage + idx + 1
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink href={`/?page=${page}`}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }
              )}

              {currentPage + maxNextPages < totalPages && (
                <>
                  {currentPage + maxNextPages + 1 < totalPages && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink href={`/?page=${totalPages}`}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext href={`/?page=${currentPage + 1}`} />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    )
  }
}
