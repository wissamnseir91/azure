import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AzureModule } from './azure/azure.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AzureModule,
    MongooseModule.forRoot('mongodb://localhost:27017/azure'), // <-- Use type assertion here
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
