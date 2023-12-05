import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AzureModule } from './azure/azure.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config();
@Module({
  imports: [
    AzureModule,
    MongooseModule.forRoot(process.env.DATABASE_CONNECTION_STRNG), // <-- Use type assertion here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
