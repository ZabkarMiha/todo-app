import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "../lib/auth/auth-client";
import UserAvatar from "./user-avatar";

export default function UserDataDialog() {
  const user = authClient.useSession().data?.user;

  const [open, setOpen] = useState(false);
  const [edit, isEdit] = useState(true);

  const defaultValues = {
    email: user?.email,
    username: user?.username!,
  };

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof userFormSchema>> = async (
    data: z.infer<typeof userFormSchema>,
  ) => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start font-normal m-0 p-2"
        >
          Account
        </Button>
      </DialogTrigger>
      <DialogContent className={"space-y-6"}>
        <DialogHeader>
          <DialogTitle>Your profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-7 md:flex-row">
          <div className="flex flex-row gap-4 justify-center items-center md:flex-col">
            <UserAvatar className="size-auto" imageString={user?.image}></UserAvatar>
            <Button variant="ghost">Change image</Button>
          </div>
          
          <form
          id="edit-user-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex-1"
        >
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-user-form-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="edit-user-form-email"
                    aria-invalid={fieldState.invalid}
                    disabled={edit}
                    className="disabled:opacity-100 disabled:border-input/30 disabled:bg-input/30"
                  />
                  {/* <FieldDescription>Your email</FieldDescription> */}
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
                  <Input
                    {...field}
                    id="edit-user-form-username"
                    aria-invalid={fieldState.invalid}
                    disabled={edit}
                    className="disabled:opacity-100 disabled:border-input/30 disabled:bg-input/30"
                  />
                  {/* <FieldDescription>
                    Your username
                  </FieldDescription> */}
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        </div>
        
        <Field orientation="horizontal" className="justify-end">
          {edit ? (
            <Button onClick={() => isEdit(false)}>Edit</Button>
          ) : (
            <Button onClick={() => isEdit(true)}>Done</Button>
          )}
        </Field>
      </DialogContent>
    </Dialog>
  );
}
