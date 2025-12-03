"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type UserAvatarProps = {
  className?: string;
  imageString: string | null | undefined;
};

export default function UserAvatar({
  className,
  imageString,
}: UserAvatarProps) {
  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={imageString!} alt="user" />
      <AvatarFallback />
    </Avatar>
  );
}
