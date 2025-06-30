import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter, useSearchParams } from "next/navigation"

interface SortTasksProps {
  sortOrder: "newest" | "oldest"
  setSortOrder: (order: "newest" | "oldest") => void
}

export default function SortTasks({ sortOrder, setSortOrder }: SortTasksProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleSortChange(value: string) {
    setSortOrder(value as "newest" | "oldest")
    const params = new URLSearchParams(searchParams)
    params.set("sort", value)
    router.replace(`?${params.toString()}`)
  }

  return (
    <div className="h-full flex flex-row justify-center items-center gap-2 outline outline-1 outline-container-outline bg-container p-4 rounded-md">
      <Label>Sort by date:</Label>
      <RadioGroup
        value={sortOrder}
        onValueChange={handleSortChange}
        className="flex items-center"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem
            className="bg-white dark:bg-neutral-900"
            value="newest"
            id="option-newest"
          />
          <Label htmlFor="option-newest">Newest first</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem
            className="bg-white dark:bg-neutral-900"
            value="oldest"
            id="option-oldest"
          />
          <Label htmlFor="option-oldest">Oldest first</Label>
        </div>
      </RadioGroup>
    </div>
  )
}
