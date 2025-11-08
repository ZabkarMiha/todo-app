export type Task = {
  id: string
  title: string
  description: string | null
  completed: boolean
  dateAdded: Date
}

type ErrorData = {
  message: string,
  status: number
}

export type ActionResponse<T> = {
  data?: T
  error?: ErrorData
}
