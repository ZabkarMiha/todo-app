"use server";

import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ActionResponse } from "../types";

const s3client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function deleteImageFromS3(
  key: string,
): Promise<ActionResponse<DeleteObjectCommandOutput>> {
  try {
    const input: DeleteObjectCommandInput = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(input);
    const response = await s3client.send(command);

    return { data: response };
  } catch {
    return {
      error: { message: "Failed to delete due to unknown error", status: 500 },
    };
  }
}

type uploadImageToS3Return = {
  putObjectCommandOutput: PutObjectCommandOutput;
  url: string;
};

export async function uploadImageToS3(
  file: File,
  userId: string,
): Promise<ActionResponse<uploadImageToS3Return>> {
  try {
    const fileBuffer = Buffer.from(await file.bytes());
    const extension = file.name.split(".")[1];
    const finalKey = userId + "-" + Date.now() + "-avatar." + extension;

    const input: PutObjectCommandInput = {
      Body: fileBuffer,
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: finalKey,
      ContentType: file.type,
    };

    const command = new PutObjectCommand(input);
    const response = await s3client.send(command);

    const url = `https://${process.env.CLOUDFRONT_DOMAIN_NAME}/${finalKey}`;

    return { data: { putObjectCommandOutput: response, url: url } };
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

export async function getImageUrlFromS3(
  key: string,
): Promise<ActionResponse<{ imageUrl: string; expiry: number }>> {
  try {
    const input: GetObjectCommandInput = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    const expiresIn = 3600;

    const command = new GetObjectCommand(input);

    const url = await getSignedUrl(s3client, command, { expiresIn: expiresIn });

    return { data: { imageUrl: url, expiry: expiresIn } };
  } catch (e) {
    return { error: { message: "Failed to get image URL", status: 500 } };
  }
}
