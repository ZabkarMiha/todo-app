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

export type EmailTemplateProps = {
  username: string
}

export type SendEmailProps = {
  username: string
  email: string
}
