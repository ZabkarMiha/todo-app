"use server";

import {
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { ActionResponse } from "../types";

const s3client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function uploadImageToS3(
  file: File,
  username: string,
): Promise<ActionResponse<PutObjectCommandOutput>> {
  try {
    const fileBuffer = Buffer.from(await file.bytes());
    const extension = file.name.split(".")[1];
    const finalKey = username + "-avatar." + extension;

    const input: PutObjectCommandInput = {
      Body: fileBuffer,
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: finalKey,
    };
    const command = new PutObjectCommand(input);
    const response = await s3client.send(command);

    return { data: response };
  } catch (e) {
    if (e instanceof S3ServiceException) {
      return {
        error: { message: e.message, status: e.$response?.statusCode! },
      };
    }
    return {
      error: { message: "Failed to upload due to unknown error", status: 500 },
    };
  }
}

export async function getImageFromS3(
  key: string,
): Promise<ActionResponse<Blob>> {
  try {
    const input: GetObjectCommandInput = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };
    const command = new GetObjectCommand(input);
    const response = await s3client.send(command);

    const data = await response.Body?.transformToByteArray();

    const arrayBuffer: ArrayBuffer = new Uint8Array(data!).buffer;

    const blob = new Blob([arrayBuffer], {
      type: "image",
    });

    return { data: blob };
  } catch (e) {
    if (e instanceof S3ServiceException) {
      return {
        error: { message: e.message, status: e.$response?.statusCode! },
      };
    }
    return {
      error: { message: "Failed to upload due to unknown error", status: 500 },
    };
  }
}
