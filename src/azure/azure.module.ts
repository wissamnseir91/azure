import { Module } from '@nestjs/common';
import { AzureService } from './azure.service';
import { ServiceBusService } from './service-bus/service-bus.service';
import { MessageService } from 'src/message.service';
import { MessageModule } from 'src/message.module';
import { Message } from 'src/message.model';

@Module({
  imports: [MessageModule],
  providers: [AzureService, ServiceBusService, MessageService, Message],
  exports: [AzureService, ServiceBusService],
})
export class AzureModule {}
