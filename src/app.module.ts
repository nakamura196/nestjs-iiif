import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3Module } from './s3.module';

@Module({
  imports: [S3Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
