"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/auth-client";
import { loginFormSchema } from "@/lib/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export default function LoginPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<z.infer<typeof loginFormSchema>> = async (
    values: z.infer<typeof loginFormSchema>,
  ) => {
    const authValues = {
      password: values.password,
      callbackURL: "/tasks",
    };
    const authCallbacks = {
      onRequest: () => setIsSubmitting(true),
      onSuccess: () => {
        setIsSuccess(true);
        router.push("/tasks");
      },
      onError: (ctx: { error: { message: string } }) => {
        setIsSubmitting(false);
        form.setError("root", {
          type: "manual",
          message: ctx.error.message,
        });
      },
    };

    const isEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(
      values.emailOrUsername,
    );

    if (isEmail) {
      await authClient.signIn.email(
        {
          email: values.emailOrUsername,
          ...authValues,
        },
        {
          ...authCallbacks,
        },
      );
    } else {
      await authClient.signIn.username(
        {
          username: values.emailOrUsername,
          ...authValues,
        },
        {
          ...authCallbacks,
        },
      );
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <p className="text-center text-2xl font-semibold">Login</p>
      {isSuccess ? (
        <div className="mt-10 flex h-full w-full flex-col items-center justify-center space-y-4">
          <CheckIcon className="size-8 text-green-500" />
          <p className="text-green-500">Success!</p>
        </div>
      ) : (
        <>
          {isSubmitting ? (
            <div className="mt-10 flex h-full w-full flex-col items-center justify-center space-y-4">
              <Spinner className="size-8" />
              <p>Submitting...</p>
            </div>
          ) : (
            <form
              id="login-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-8"
            >
              <FieldGroup>
                <Controller
                  name="emailOrUsername"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="login-form-emailOrUsername">
                        Email or username
                      </FieldLabel>
                      <Input
                        className="bg-form-input-background border-form-input-border border"
                        {...field}
                        id="login-form-emailOrUsername"
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
                      <FieldLabel htmlFor="login-form-password">
                        Password
                      </FieldLabel>
                      <Input
                        className="bg-form-input-background border-form-input-border border"
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
                {form.formState.errors.root && (
                  <FieldError errors={[form.formState.errors.root]} />
                )}
                <Field
                  className="mt-4 flex items-center justify-center"
                  orientation="horizontal"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                  >
                    Reset
                  </Button>
                  <Button type="submit" form="login-form">
                    Submit
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}
        </>
      )}

      <Button className="mt-10 pl-0" variant="link" disabled={isSubmitting}>
        <Link href={"/auth/register"}>Don't have an account? Register</Link>
      </Button>
    </div>
  );
}
