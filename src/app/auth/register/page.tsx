"use client"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Transition } from "@headlessui/react"
import { CheckIcon } from "@radix-ui/react-icons"

import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerFormSchema } from "@/lib/form-schemas"
import { z } from "zod"

import { isEmailAvailable } from "@/lib/actions"
import { authClient } from "@/lib/auth/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterPage() {
  const router = useRouter()

  const [emailStepComplete, setEmailStepComplete] = useState<boolean>(false)
  const [checkingEmail, setCheckingEmail] = useState<boolean>(false)
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      username: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  })

  const handleAvailableEmail = async (email: string): Promise<boolean> => {
    const valid = await form.trigger("email")
    if (!valid) return false
    setCheckingEmail(true)
    try {
      const { data: response } = await isEmailAvailable(email)
      if (!response?.available) {
        form.setError("email", {
          type: "manual",
          message: "Email is already taken",
        })
        return false
      } else {
        form.clearErrors("email")
        return true
      }
    } finally {
      setCheckingEmail(false)
    }
  }

  const handleAvailableUsername = async (
    username: string
  ): Promise<boolean> => {
    const valid = await form.trigger("username")
    if (!valid) return false
    setCheckingUsername(true)
    try {
      const { data: response, error } = await authClient.isUsernameAvailable({
        username: username,
      })
      if (!response?.available) {
        form.setError("username", {
          type: "manual",
          message: "Username is already taken",
        })
        return false
      } else {
        form.clearErrors("username")
        return true
      }
    } finally {
      setCheckingUsername(false)
    }
  }

  const handleFirstStep = async () => {
    const fields = ["password", "confirmPassword"] as const
    await form.trigger(fields)
    const emailAvailable = await handleAvailableEmail(form.getValues("email"))
    const fieldStates = fields.map((f) => form.getFieldState(f))
    const hasErrors = fieldStates.some((s) => !!s.error)
    if (!hasErrors && emailAvailable) {
      setTimeout(() => setEmailStepComplete(true), 10)
    }
  }

  const onSubmit: SubmitHandler<z.infer<typeof registerFormSchema>> = async (
    values: z.infer<typeof registerFormSchema>
  ) => {
    const usernameAvailable = await handleAvailableUsername(values.username)
    if (!usernameAvailable) return

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
          setIsSubmitting(true)
        },
        onSuccess: (ctx) => {
          setIsSuccess(true)
          router.push("/tasks")
        },
        onError: (ctx) => {
          setIsSubmitting(false)
        },
      }
    )
  }

  return (
    <div className="flex flex-col w-full h-full">
      <p className="text-2xl font-semibold text-center">Registration</p>
      {isSuccess ? (
        <div className="flex flex-col justify-center items-center w-full h-full space-y-4 mt-10">
          <CheckIcon className="size-8 text-green-500" />
          <p className="text-green-500">Success!</p>
        </div>
      ) : (
        <>
          {isSubmitting ? (
            <div className="flex flex-col justify-center items-center w-full h-full space-y-4 mt-10">
              <Spinner className="size-8" />
              <p>Submitting...</p>
            </div>
          ) : (
            <form
              id="register-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-8"
            >
              <FieldGroup className="grid">
                <Transition
                  show={!emailStepComplete}
                  enter="transition-opacity duration-500 ease-in-out"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-500 ease-in-out"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  as="div"
                  className="col-start-1 row-start-1 w-full"
                >
                  <Field>
                    <Controller
                      name="email"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="register-form-email">
                            Email
                          </FieldLabel>
                          <Input
                            className="bg-form-input-background border border-form-input-border"
                            type="email"
                            {...field}
                            id="register-form-email"
                            aria-invalid={fieldState.invalid}
                          />
                          {checkingEmail && <Spinner />}
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Field className="flex flex-row items-start gap-4">
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
                            <FieldLabel
                              htmlFor="register-form-confirmPassword"
                              className="whitespace-nowrap  "
                            >
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
                    <Field
                      className="flex items-center justify-center mt-8"
                      orientation="horizontal"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                      >
                        Reset
                      </Button>
                      <Button
                        type="button"
                        disabled={checkingEmail}
                        onClick={() => {
                          handleFirstStep()
                        }}
                      >
                        Next
                      </Button>
                    </Field>
                  </Field>
                </Transition>
                <Transition
                  show={emailStepComplete}
                  enter="transition-opacity duration-500 ease-in-out"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-500 ease-in-out"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  as="div"
                  className="col-start-1 row-start-1 w-full"
                >
                  <Field>
                    <Controller
                      name="name"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="register-form-name">
                            Name
                          </FieldLabel>
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
                          />
                          {checkingUsername && <Spinner />}
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Field
                      className="flex items-center justify-center mt-8"
                      orientation="horizontal"
                    >
                      <Button
                        type="button"
                        variant="outline"
                        disabled={checkingUsername}
                        onClick={() =>
                          setTimeout(() => setEmailStepComplete(false), 10)
                        }
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        form="register-form"
                        disabled={checkingUsername}
                        className="self-center"
                      >
                        Submit
                      </Button>
                    </Field>
                  </Field>
                </Transition>
              </FieldGroup>
            </form>
          )}
        </>
      )}

      <Button
        className="pl-0 mt-10"
        variant="link"
        disabled={isSubmitting}
        onClick={() => {
          router.push("/auth/login")
        }}
      >
        Already registered? Login
      </Button>
    </div>
  )
}
