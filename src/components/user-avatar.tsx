"use client";

import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import AvatarCropUpload from "./avatar-crop-upload";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type UserAvatarProps = {
  className?: string;
  editable?: boolean;
};

export default function UserAvatar({
  className,
  editable = false,
}: UserAvatarProps) {
  const user = authClient.useSession().data?.user;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {editable ? (
        <>
          <Avatar className={cn("group", className)}>
            <span
              className={`absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/50 ${
                user?.image &&
                "opacity-0 transition-opacity group-hover:opacity-100"
              }`}
              onClick={() => setIsDialogOpen(true)}
            >
              <span className="font-medium text-white">
                {user?.image ? "Edit image" : "Select image"}
              </span>
            </span>

            <AvatarImage src={user?.image ?? undefined} alt="user" />
            <AvatarFallback />
          </Avatar>

          {editable && user && (
            <AvatarCropUpload
              userId={user.id}
              imageString={user.image}
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
            />
          )}
        </>
      ) : (
        <Avatar className={className}>
          <AvatarImage src={user?.image!} alt="user" />
          <AvatarFallback />
        </Avatar>
      )}
    </>
  );
}
