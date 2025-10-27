"use client"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form"
import { registerFormSchema } from "@/lib/form-schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth/auth-client"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"

import { useDebouncedCallback } from "use-debounce"

export default function RegisterPage() {
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      username: "",
      confirmPassword: "",
    },
  })

  const router = useRouter()

  const handleAvailableUsername = useDebouncedCallback(
    async (username: string) => {
      const { data: response, error } = await authClient.isUsernameAvailable({
        username: username,
      })
      if (!response?.available) {
        form.setError("username", {
          type: "manual",
          message: "Username is already taken",
        })
      } else {
        form.clearErrors("username")
      }
    },
    1000
  )

  const onSubmit: SubmitHandler<z.infer<typeof registerFormSchema>> = async (
    values: z.infer<typeof registerFormSchema>
  ) => {
    const usernameIsAvailable = await handleAvailableUsername(values.username)
    if (!usernameIsAvailable) return

    const { data, error } = await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        username: values.username,
        callbackURL: "/tasks",
      },
      {
        onRequest: (ctx) => {
          ;<Spinner />
        },
        onSuccess: (ctx) => {
          form.clearErrors("username")
          router.push("/tasks")
        },
        onError: (ctx) => {
          console.log(ctx.error.message)
          if (ctx.error.status === 422) {
            form.setError("email", {
              type: "manual",
              message: "Email is already taken",
            })
          }
        },
      }
    )
  }

  const onInvalid: SubmitErrorHandler<
    z.infer<typeof registerFormSchema>
  > = async (errors) => {
    if (!errors.username) {
      const username = form.getValues("username")

      await handleAvailableUsername(username)
    }
  }

  return (
    <>
      <p className="text-2xl font-semibold text-center">Registration</p>
      <form
        id="register-form"
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
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
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-form-name">Name</FieldLabel>
                <Input
                  className="bg-form-input-background border border-form-input-border"
                  {...field}
                  id="register-form-name"
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
                  onChange={(e) => {
                    field.onChange(e)
                    if (e.currentTarget.value.length >= 3) {
                      handleAvailableUsername(e.target.value)
                    }
                  }}
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
      <Button
        className="pl-0"
        variant="link"
        onClick={() => {
          router.push("/auth/login")
        }}
      >
        Already registered? Login
      </Button>
    </>
  )
}
