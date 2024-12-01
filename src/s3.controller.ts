// src/s3.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { S3Service } from './s3.service';

@Controller('iiif/2')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Get(':encodedKey/manifest')
  async getManifest(@Param('encodedKey') encodedKey: string) {
    try {
      // `%2F` を `/` にデコードして元のキーに戻す
      let key = encodedKey.replace(/~/g, '/');

      if (!key.endsWith('/manifest.json')) {
        key += '/manifest.json';
      }

      // S3からJSONファイルを取得
      const data = await this.s3Service.getJsonFile(key);

      return data;
    } catch (error) {
      return { error: error.message };
    }
  }
}
