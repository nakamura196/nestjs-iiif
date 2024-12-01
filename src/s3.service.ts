// src/s3.service.ts
import { Injectable } from '@nestjs/common';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT,
      forcePathStyle: true, // パススタイルを有効化（多くの互換ストレージで必要）
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
  }

  async getJsonFile(key: string): Promise<any> {
    const bucket = process.env.S3_BUCKET_NAME;
    if (!bucket) {
      throw new Error('S3_BUCKET_NAME is not set in environment variables.');
    }
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const response = await this.s3Client.send(command);

    const stream = response.Body as Readable;
    const chunks: Uint8Array[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const fileContent = Buffer.concat(chunks).toString('utf-8');
    return JSON.parse(fileContent);
  }
}
