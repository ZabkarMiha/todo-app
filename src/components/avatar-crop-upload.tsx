"use client";

import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

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
  className?: string;
  onCropComplete: (file: File | null) => void;
};

export default function AvatarCropUpload({
  className,
  onCropComplete,
}: AvatarCropUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileDrop = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setPreview(null);
      onCropComplete(null);
    }
  };

  const handleInternalCrop = (croppedUrl: string) => {
    setPreview(croppedUrl);

    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop() || "png";
      const fileName = `avatar.${fileExtension}`;
      const fileObject = dataURLtoFile(croppedUrl, fileName);

      onCropComplete(fileObject);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    onCropComplete(null);
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
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
        <div className="flex flex-col items-center gap-4 w-full">
          <h3 className="text-lg font-medium">Crop Your Image</h3>
          <ImageCrop
            file={selectedFile}
            onCrop={handleInternalCrop}
            aspect={1}
            circularCrop={true}
          >
            <ImageCropContent className="max-w-md" />
            <div className="flex items-center gap-2 mt-4">
              <ImageCropApply asChild>
                <Button type="button">Apply Crop</Button>
              </ImageCropApply>
              <ImageCropReset asChild>
                <Button variant="outline" type="button">
                  Reset
                </Button>
              </ImageCropReset>
              <Button variant="ghost" type="button" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </ImageCrop>
        </div>
      )}

      {preview && selectedFile && (
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-medium">Your Cropped Image:</h3>
          <Image
            src={preview}
            alt="Cropped preview"
            width={200}
            height={200}
            className="rounded-full border object-cover"
          />
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={handleCancel}
          >
            Change Image
          </Button>
        </div>
      )}
    </div>
  );
}
