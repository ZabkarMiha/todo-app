"use client"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { loginFormSchema } from "@/lib/form-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth/auth-client"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { DialogFooter } from "@/components/ui/dialog"

export default function LoginPage() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const router = useRouter()

  const onSubmit: SubmitHandler<z.infer<typeof loginFormSchema>> = async (
    values: z.infer<typeof loginFormSchema>
  ) => {
    const { data, error } = await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/tasks",
      },
      {
        onRequest: (ctx) => {
          ;<Spinner />
        },
        onSuccess: (ctx) => {
          router.push("/tasks")
        },
        onError: (ctx) => {
          alert(ctx.error.message)
        },
      }
    )
  }

  return (
    <div className="flex flex-col w-full h-full">
      <p className="text-2xl font-semibold text-center">Login</p>
      <form
        id="login-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8"
      >
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-form-email">Email</FieldLabel>
                <Input
                  className="bg-form-input-background border border-form-input-border"
                  {...field}
                  id="login-form-email"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-form-password">Password</FieldLabel>
                <Input
                  className="bg-form-input-background border border-form-input-border"
                  type="password"
                  {...field}
                  id="login-form-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
      <Field className="flex items-center justify-center mt-8" orientation="horizontal">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" form="login-form">
          Submit
        </Button>
      </Field>
      <Button
        className="pl-0 mt-auto"
        variant="link"
        onClick={() => {
          router.push("/auth/register")
        }}
      >
        Don't have an account? Register
      </Button>
    </div>
  )
}
