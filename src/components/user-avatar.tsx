"use client";

import { getImageUrlFromS3 } from "@/lib/s3/bucket";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type UserAvatarProps = {
  imageString: string | null | undefined;
};

export default function UserAvatar({ imageString }: UserAvatarProps) {
  const [image, setImage] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!imageString || imageString === "") return;

    getImageUrlFromS3(imageString).then((data) => {
      if (isMounted) {
        setImage(data.data!);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [imageString]);

  return (
    <Avatar>
      <AvatarImage src={image} />
      <AvatarFallback />
    </Avatar>
  );
}
