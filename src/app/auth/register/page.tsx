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
import {
  insertUserClientTasks,
  isEmailAvailable,
} from "@/lib/actions/repository";
import { getAllTasks } from "@/lib/actions/repository-client";
import { authClient } from "@/lib/auth/auth-client";
import { FEATURE_FLAGS } from "@/lib/features";
import { registerFormSchema } from "@/lib/form-schemas";
import { ReturnTask } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<
    "registrationStep" | "avatarStep" | "clientTasksStep"
  >("registrationStep");

  const [emailStepComplete, setEmailStepComplete] = useState<boolean>(false);
  const [checkingEmail, setCheckingEmail] = useState<boolean>(false);

  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [showAvatarStep, setShowAvatarStep] = useState<boolean>(false);

  const [userId, setUserId] = useState<string>("");

  const userLocalTasks = useLiveQuery(() => getAllTasks());

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

  const handleTasksToUserStep = () => {
    if (userLocalTasks === undefined) {
      return;
    }

    if ((userLocalTasks.data?.length ?? 0) === 0) {
      router.push("/tasks");
      return;
    }

    setStep("clientTasksStep");
  };

  const addTasksToUser = async () => {
    if (!userLocalTasks?.data?.length) {
      router.push("/tasks");
      return;
    }

    setIsSubmitting(true);

    const tasks: Omit<ReturnTask, "id">[] = userLocalTasks.data.map((task) => ({
      title: task.title,
      description: task.description,
      completed: task.completed,
      dueDate: task.dueDate,
      dateAdded: task.dateAdded,
    }));

    const result = await insertUserClientTasks(userId, tasks);

    if (result.error) {
      console.error(result.error.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/tasks");
  };

  const onSubmit: SubmitHandler<z.infer<typeof registerFormSchema>> = async (
    values,
  ) => {
    const usernameAvailable = await handleAvailableUsername(values.username);
    if (!usernameAvailable) return;

    setIsSubmitting(true);

    const { data } = await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        username: values.username,
      },
      {
        onRequest: () => {},
        onSuccess: (ctx) => {
          setIsSubmitting(false);
          setStep("avatarStep");
        },
        onError: (ctx) => {
          console.error(ctx.error.message);
          setIsSubmitting(false);
        },
      },
    );

    if (data) {
      setUserId(data.user.id);
    }
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

      {step === "registrationStep" && !isSubmitting && (
        <div className="flex-1 content-center">
          <form
            id="register-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="h-full"
          >
            <FieldGroup className="grid h-full grid-cols-1 grid-rows-1">
              <div
                className={`col-start-1 row-start-1 h-full w-full transition-opacity duration-500 ease-in-out ${!emailStepComplete ? "opacity-100" : "pointer-events-none opacity-0"}`}
              >
                <Field className="h-full justify-center gap-7">
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
                className={`col-start-1 row-start-1 h-full w-full transition-opacity duration-500 ease-in-out ${emailStepComplete ? "opacity-100" : "pointer-events-none opacity-0"}`}
              >
                <Field className="h-full justify-center gap-7">
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

      {step === "avatarStep" && !isSubmitting && (
        <Field className="h-full justify-center gap-7">
          {/* {loading && (
            <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
              <Spinner className="size-8" />
              <p>Loading...</p>
            </div>
          )} */}

          {!showAvatarStep && (
            <Field className="flex items-center justify-center gap-7">
              <span className="text-center">
                Do you wish to add a profile picture?
              </span>
              <Button
                disabled={!FEATURE_FLAGS.isAvatarUploadEnabled}
                onClick={() => {
                  setShowAvatarStep(true);
                }}
              >
                Yes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  handleTasksToUserStep();
                  //router.push("/tasks");
                }}
              >
                No, continue
              </Button>
            </Field>
          )}

          {showAvatarStep && (
            <div className="flex h-full flex-col items-center justify-center gap-7">
              <div className="flex aspect-square h-[35%] items-center justify-center">
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
                    handleTasksToUserStep();
                    setShowAvatarStep(false);
                    /* router.push("/tasks"); */
                  }}
                >
                  Submit
                </Button>
              </Field>
            </div>
          )}
        </Field>
      )}

      {userLocalTasks !== undefined &&
        userLocalTasks.data?.length !== 0 &&
        step === "clientTasksStep" &&
        !isSubmitting && (
          <Field className="h-full justify-center gap-7">
            <span className="text-center">
              Looks like you added some tasks while you were in guest mode. Add
              them to your new online account?
            </span>
            <Field
              className="flex items-center justify-center"
              orientation="horizontal"
            >
              <Button
                type="button"
                variant="secondary"
                className=""
                onClick={() => {
                  router.push("/tasks");
                }}
              >
                No
              </Button>
              <Button type="button" onClick={addTasksToUser}>
                Yes
              </Button>
            </Field>
          </Field>
        )}

      <div className="mt-auto self-center">
        <Button variant="link" disabled={isSubmitting}>
          <Link href={"/auth/login"}>Already registered? Login</Link>
        </Button>
      </div>
    </>
  );
}
