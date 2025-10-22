"use client"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { registerFormSchema } from "@/lib/form-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth/auth-client"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"

export default function Page() {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const router = useRouter()

  const onSubmit: SubmitHandler<z.infer<typeof registerFormSchema>> = async (
    values: z.infer<typeof registerFormSchema>
  ) => {
    const { data, error } = await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.username,
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
    <>
      <p className="text-2xl font-semibold text-center">Registration</p>
      <form
        id="register-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-form-email">Email</FieldLabel>
                <Input
                  className="bg-form-input-background border border-form-input-border"
                  {...field}
                  id="register-form-email"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-form-username">
                  Username
                </FieldLabel>
                <Input
                  className="bg-form-input-background border border-form-input-border"
                  {...field}
                  id="register-form-username"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field className="grid grid-cols-2 gap-4">
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-form-password">
                    Password
                  </FieldLabel>
                  <Input
                    className="bg-form-input-background border border-form-input-border"
                    type="password"
                    {...field}
                    id="register-form-password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="register-form-confirmPassword">
                    Confirm password
                  </FieldLabel>
                  <Input
                    className="bg-form-input-background border border-form-input-border"
                    type="password"
                    {...field}
                    id="register-form-confirmPassword"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </Field>
        </FieldGroup>
      </form>
      <Field orientation="horizontal">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" form="register-form">
          Submit
        </Button>
      </Field>
    </>
  )
}
