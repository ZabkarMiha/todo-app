"use server"

import EmailTemplate from "@/components/email-template"
import { ActionResponse, SendEmailProps } from "../types"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({username, email}: SendEmailProps): Promise<ActionResponse<string>> {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_SENDER as string,
      to: email,
      subject: "TodoApp - Confirm your email",
      react: EmailTemplate({username: username}),
    })

    if (error) {
      return { error: error.message }
    }

    if (!data) {
      return { error: "No data" }
    }

    return { data: data.id }
  } catch (error) {
    return { error: "Error occured while sending email" }
  }
}
