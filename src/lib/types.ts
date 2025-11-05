export type Task = {
  id: string
  title: string
  description: string | null
  completed: boolean
  dateAdded: Date
}

export type ActionResponse<T> = {
  data?: T
  error?: string
}
