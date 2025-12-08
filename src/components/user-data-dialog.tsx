import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { userFormSchema } from "@/lib/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "../lib/auth/auth-client";

import { Spinner } from "./ui/spinner";
import UserAvatar from "./user-avatar";

export default function UserDataDialog() {
  const user = authClient.useSession().data?.user;

  const [editUsername, isEditUsername] = useState(false);

  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);

  const defaultValues = {
    email: user?.email,
    username: user?.username!,
  };

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  const handleAvailableUsername = async (
    username: string,
  ): Promise<boolean> => {
    if (username === defaultValues.username) {
      isEditUsername(false);
      return false;
    }

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

  const onSubmit: SubmitHandler<z.infer<typeof userFormSchema>> = async (
    values: z.infer<typeof userFormSchema>,
  ) => {
    if (await handleAvailableUsername(values.username)) {
      toast.promise(authClient.updateUser({ username: values.username }), {
        closeButton: true,
        position: "top-center",
        loading: "Loading...",
        success: () => {
          isEditUsername(false);
          return "Username updated";
        },
        error: (error) => {
          isEditUsername(false);
          return error.message;
        },
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="m-0 w-full justify-start p-2 font-normal"
        >
          Account
        </Button>
      </DialogTrigger>
      <DialogContent
        className={""}
        onInteractOutside={(e) => {
          if (editUsername) {
            e.preventDefault();
          }
        }}
        showCloseButton={!editUsername}
      >
        <DialogHeader>
          <DialogTitle>Your profile</DialogTitle>
          <DialogDescription>You can edit your information</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-7 md:flex-row">
          <div className="flex h-42 items-center justify-center md:h-full md:w-[40%]">
            <div className="flex aspect-square h-full items-center justify-center md:h-auto md:w-full">
              <UserAvatar className="size-full" editable={true} />
            </div>
          </div>

          <form
            id="edit-user-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 items-center justify-center gap-8"
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="edit-user-form-email">
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id="edit-user-form-email"
                      aria-invalid={fieldState.invalid}
                      disabled={true}
                      className="disabled:border-input/30 disabled:bg-input/30 disabled:opacity-100"
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
                    <FieldLabel htmlFor="edit-user-form-username">
                      Username
                    </FieldLabel>
                    <div className="flex w-full max-w-sm items-center gap-2">
                      <Input
                        {...field}
                        id="edit-user-form-username"
                        aria-invalid={fieldState.invalid}
                        disabled={!editUsername}
                        className="disabled:border-input/30 disabled:bg-input/30 disabled:opacity-100"
                      />
                      {!editUsername ? (
                        <Button
                          type="button"
                          className="justify-self-end"
                          onClick={(e) => {
                            e.preventDefault();
                            isEditUsername(true);
                          }}
                          disabled={checkingUsername}
                        >
                          Edit
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          form="edit-user-form"
                          disabled={checkingUsername}
                        >
                          Save
                        </Button>
                      )}
                    </div>
                    {checkingUsername && <Spinner />}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </div>

        <Field orientation="horizontal">
          <DialogClose asChild>
            <Button variant="outline" disabled={editUsername}>
              Close
            </Button>
          </DialogClose>
        </Field>
      </DialogContent>
    </Dialog>
  );
}
