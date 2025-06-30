"use client"

import { Input } from "./ui/input"
import { useSearchParams, useRouter } from "next/navigation"

export default function Search() {
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("query", term)
      params.set("page", "1")
    } else {
      params.delete("query")
      params.set("page", "1")
    }
    replace(`?${params.toString()}`)
  }

  return (
    <div className="h-full">
      <Input
        type="text"
        placeholder="Search tasks..."
        className="w-80 h-full"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}
