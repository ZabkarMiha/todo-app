"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import {
  ImageCrop,
  ImageCropApply,
  ImageCropContent,
  ImageCropReset,
} from "@/components/ui/shadcn-io/image-crop";
import { authClient } from "@/lib/auth/auth-client";
import { deleteImageFromS3, uploadImageToS3 } from "@/lib/s3/bucket";
import { Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

type AvatarCropUploadProps = {
  userId: string;
  imageString: string | null | undefined;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function AvatarCropUpload({
  userId,
  imageString,
  isOpen = false,
  onOpenChange,
}: AvatarCropUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleFileDrop = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setPreview(null);
      setAvatarFile(null);
    }
  };

  const handleInternalCrop = (croppedUrl: string) => {
    setPreview(croppedUrl);

    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop() || "png";
      const fileName = `avatar.${fileExtension}`;
      const fileObject = dataURLtoFile(croppedUrl, fileName);

      setAvatarFile(fileObject);
    }
  };

  const handleUpload = async () => {
    setIsSubmitting(true);

    if (imageString) {
      const url = new URL(imageString);
      const result = url.pathname.substring(1);

      await deleteImageFromS3(result);
    }

    const responseUploadImageToS3 = await uploadImageToS3(avatarFile!, userId);

    if (responseUploadImageToS3.error) {
      toast.error(responseUploadImageToS3.error.message);
      setIsSubmitting(false);
      return;
    }

    const imageKey = responseUploadImageToS3.data?.url;

    const { data, error } = await authClient.updateUser({ image: imageKey });

    if (error) {
      toast.error(error.message);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      handleCancel();
      onOpenChange?.(false);
    }, 2000);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    setAvatarFile(null);

    setIsSubmitting(false);
    setIsSuccess(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleCancel();
        }
        onOpenChange?.(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {!selectedFile
              ? "Upload Image"
              : !preview
                ? "Crop Your Image"
                : "Your Cropped Image"}
          </DialogTitle>
          <DialogDescription>Add or update your image</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center">
          {isSuccess && (
            <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
              <Check className="size-8 text-green-500" />
              <p className="text-green-500">Success!</p>
            </div>
          )}

          {isSubmitting && (
            <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
              <Spinner className="size-8" />
              <p>Submitting...</p>
            </div>
          )}

          {!selectedFile && (
            <Dropzone
              accept={{ "image/jpeg": [], "image/png": [], "image/webp": [] }}
              maxFiles={1}
              onDrop={handleFileDrop}
            >
              <DropzoneEmptyState />
              <DropzoneContent />
            </Dropzone>
          )}

          {!preview && selectedFile && (
            <div className="flex flex-col items-center gap-4">
              <ImageCrop
                file={selectedFile}
                onCrop={handleInternalCrop}
                aspect={1}
                circularCrop={true}
              >
                <ImageCropContent className="max-w-sm" />
                <div className="flex items-center gap-2 mt-4">
                  <Button variant="ghost" type="button" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <ImageCropReset asChild>
                    <Button variant="outline" type="button">
                      Reset
                    </Button>
                  </ImageCropReset>
                  <ImageCropApply asChild>
                    <Button type="button">Apply Crop</Button>
                  </ImageCropApply>
                </div>
              </ImageCrop>
            </div>
          )}

          {preview && selectedFile && !isSubmitting && !isSuccess && (
            <div className="flex flex-col items-center gap-4">
              <Image
                src={preview}
                alt="Cropped preview"
                width={200}
                height={200}
                className="rounded-full border object-cover"
              />
              <Button
                className="w-full"
                variant="ghost"
                onClick={() => handleCancel()}
              >
                Change Image
              </Button>
              <div className="flex flex-row gap-4 w-full items-center justify-center">
                <DialogClose asChild>
                  <Button variant="outline" onClick={() => handleCancel()}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    handleUpload();
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
