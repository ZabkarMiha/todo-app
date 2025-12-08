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
import UserAvatar from "@/components/user-avatar";
import { isEmailAvailable } from "@/lib/actions/database";
import { authClient } from "@/lib/auth/auth-client";
import { registerFormSchema } from "@/lib/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export default function RegisterPage() {
  const router = useRouter();

  const [emailStepComplete, setEmailStepComplete] = useState<boolean>(false);
  const [checkingEmail, setCheckingEmail] = useState<boolean>(false);

  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [showAvatarStep, setShowAvatarStep] = useState<boolean>(false);

  const [loading, isLoading] = useState<boolean>(false);

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
  });

  const handleAvailableEmail = async (email: string): Promise<boolean> => {
    setCheckingEmail(true);

    const { data, error } = await isEmailAvailable(email);

    if (error) {
      form.setError("email", {
        type: "manual",
        message: error.message,
      });
      setCheckingEmail(false);
      return false;
    }

    if (!data) {
      setCheckingEmail(false);
      return false;
    }

    if (!data.available) {
      form.setError("email", {
        type: "manual",
        message: "Email is already taken",
      });
      setCheckingEmail(false);
      return false;
    }

    form.clearErrors("email");
    setCheckingEmail(false);
    return true;
  };

  const handleAvailableUsername = async (
    username: string,
  ): Promise<boolean> => {
    setCheckingUsername(true);

    const { data, error } = await authClient.isUsernameAvailable({
      username: username,
    });

    if (error) {
      form.setError("username", {
        type: "manual",
        message: error.message,
      });
      setCheckingUsername(false);
      return false;
    }

    if (!data) {
      setCheckingUsername(false);
      return false;
    }

    if (!data.available) {
      form.setError("username", {
        type: "manual",
        message: "Username is already taken",
      });
      setCheckingUsername(false);
      return false;
    }

    form.clearErrors("username");
    setCheckingUsername(false);
    return true;
  };

  const handleEmailStep = async () => {
    const fieldsToTrigger = ["email", "password", "confirmPassword"] as const;
    await form.trigger(fieldsToTrigger);
    if (!form.getFieldState("email").error) {
      await handleAvailableEmail(form.getValues("email"));
    }
    const fieldStates = fieldsToTrigger.map((f) => form.getFieldState(f));
    const hasErrors = fieldStates.some((s) => !!s.error);
    if (!hasErrors) {
      setTimeout(() => setEmailStepComplete(true), 10);
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof registerFormSchema>> = async (
    values,
  ) => {
    const usernameAvailable = await handleAvailableUsername(values.username);
    if (!usernameAvailable) return;

    setIsSubmitting(true);

    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        username: values.username,
        callbackURL: "/tasks",
      },
      {
        onRequest: () => {},
        onSuccess: () => {
          setIsSubmitting(false);
          setIsSuccess(true);
        },
        onError: (ctx) => {
          console.error(ctx.error.message);
          setIsSubmitting(false);
        },
      },
    );
  };

  return (
    <>
      <p className="text-center text-3xl font-semibold">Registration</p>

      {isSubmitting && (
        <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
          <Spinner className="size-8" />
          <p>Submitting...</p>
        </div>
      )}

      {!isSuccess && !isSubmitting && (
        <div className="flex-1 content-center">
          <form
            id="register-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="h-full"
          >
            <FieldGroup className="grid grid-cols-1 grid-rows-1 h-full">
              <div
                className={`col-start-1 row-start-1 h-full w-full transition-opacity duration-500 ease-in-out ${!emailStepComplete ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                <Field className="gap-7 h-full justify-center">
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="register-form-email">
                          Email
                        </FieldLabel>
                        <Input
                          className="bg-form-input-background border-form-input-border border"
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
                            className="bg-form-input-background border-form-input-border border"
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
                            className="whitespace-nowrap"
                          >
                            Confirm password
                          </FieldLabel>
                          <Input
                            className="bg-form-input-background border-form-input-border border"
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
                    className="flex items-center justify-center"
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
                        handleEmailStep();
                      }}
                    >
                      Next
                    </Button>
                  </Field>
                </Field>
              </div>
              <div
                className={`col-start-1 row-start-1 h-full w-full transition-opacity duration-500 ease-in-out ${emailStepComplete ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                <Field className="gap-7 h-full justify-center">
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="register-form-name">
                          Name
                        </FieldLabel>
                        <Input
                          className="bg-form-input-background border-form-input-border border"
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
                          className="bg-form-input-background border-form-input-border border"
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
                    className="flex items-center justify-center"
                    orientation="horizontal"
                  >
                    <Button
                      type="button"
                      variant="secondary"
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
              </div>
            </FieldGroup>
          </form>
        </div>
      )}

      {isSuccess && (
        <Field className="gap-7 h-full justify-center">
          {loading && (
            <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
              <Spinner className="size-8" />
              <p>Loading...</p>
            </div>
          )}

          {!showAvatarStep && !loading && (
            <Field className="flex items-center justify-center gap-7">
              <span className="text-center">
                Do you wish to add a profile picture?
              </span>
              <Button
                onClick={() => {
                  setShowAvatarStep(true);
                }}
              >
                Yes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  isLoading(true);
                  router.push("/tasks");
                }}
              >
                No, continue
              </Button>
            </Field>
          )}

          {showAvatarStep && !loading && (
            <div className="flex flex-col gap-7 h-full items-center justify-center">
              <div className="flex h-[35%] aspect-square items-center justify-center">
                <UserAvatar className="size-full" editable={true} />
              </div>
              <Field
                className="flex items-center justify-center"
                orientation="horizontal"
              >
                <Button
                  type="button"
                  variant="secondary"
                  className=""
                  onClick={() =>
                    setTimeout(() => {
                      setShowAvatarStep(false);
                    }, 10)
                  }
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    router.push("/tasks");
                  }}
                >
                  Submit
                </Button>
              </Field>
            </div>
          )}
        </Field>
      )}

      <div className="self-center mt-auto">
        <Button variant="link" disabled={isSubmitting || !isSuccess}>
          <Link href={"/auth/login"}>Already registered? Login</Link>
        </Button>
      </div>
    </>
  );
}
