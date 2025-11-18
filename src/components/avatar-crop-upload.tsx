"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { uploadImageToS3 } from "@/lib/s3/bucket";

export default function AvatarCropUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const { data: session } = authClient.useSession();

  const handleFileDrop = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setCroppedImage(null);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setCroppedImage(croppedImage);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setCroppedImage(null);
  };

  const handleUpload = async () => {
    console.log(croppedImage);

    const data = await uploadImageToS3(croppedImage!, session?.user.username!);

    console.log("Uploaded: ", data);
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Image Upload and Crop</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 p-6">
        {!selectedFile && (
          <div className="w-full">
            <Dropzone
              accept={{ "image/jpeg": [], "image/png": [], "image/webp": [] }}
              maxFiles={1}
              onDrop={handleFileDrop}
            >
              <DropzoneEmptyState />
              <DropzoneContent />
            </Dropzone>
          </div>
        )}
        {!croppedImage && selectedFile && (
          <div className="flex flex-col items-center gap-4 w-full">
            <h3 className="text-lg font-medium">Crop Your Image</h3>
            <ImageCrop
              file={selectedFile}
              onCrop={handleCropComplete}
              aspect={1}
              circularCrop={true}
            >
              <ImageCropContent className="max-w-md" />
              <div className="flex items-center gap-2 mt-4">
                <ImageCropApply asChild>
                  <Button>Apply Crop</Button>
                </ImageCropApply>
                <ImageCropReset asChild>
                  <Button variant="outline">Reset</Button>
                </ImageCropReset>
                <Button variant="ghost" onClick={handleReset}>
                  Cancel
                </Button>
              </div>
            </ImageCrop>
          </div>
        )}
        {croppedImage && selectedFile && (
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-medium">Your Cropped Image:</h3>
            <Image
              src={croppedImage}
              alt="Cropped preview"
              width={200}
              height={200}
              className="rounded-lg border"
            />
            <Button variant="outline" onClick={handleReset}>
              Upload Another Image
            </Button>
            <Button variant="outline" onClick={handleUpload}>
              Use image
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
