"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { authClient } from "@/lib/auth/auth-client";
import { uploadImageToS3 } from "@/lib/s3/bucket";
import { useState } from "react";
import { Button } from "./ui/button";

export default function UploadImage() {
  const [files, setFiles] = useState<File[] | undefined>();
  const { data: session } = authClient.useSession();

  const handleDrop = (files: File[]) => {
    setFiles(files);
  };

  const handleUpload = async () => {
    if (!files) {
      console.error("Please upload a file");
      return;
    }
    const data = await uploadImageToS3(files[0]!, session?.user.username!);

    console.log("Uploaded: ", data);
  };

  return (
    <div>
      <Dropzone
        accept={{ "image/*": [] }}
        maxSize={1024 * 1024 * 10}
        onDrop={handleDrop}
        onError={console.error}
        src={files}
      >
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
      <Button onClick={() => handleUpload()}>Upload</Button>
    </div>
  );
}
