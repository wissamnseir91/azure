import { Module } from '@nestjs/common';
import { AzureService } from './azure.service';
import { ServiceBusService } from './service-bus/service-bus.service';
import { MessageService } from 'src/message.service';
import { MessageModule } from 'src/message.module';
import { Message, MessageSchema } from 'src/message.model';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MessageModule,
  ],
  providers: [AzureService, ServiceBusService, MessageService],
  exports: [AzureService, ServiceBusService],
})
export class AzureModule {}
