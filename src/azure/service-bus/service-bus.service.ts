import { ServiceBusClient, ServiceBusMessage, delay } from '@azure/service-bus';
import { Injectable } from '@nestjs/common';
import { IMessage, Message, MessageSchema } from 'src/message.model';
import { MessageService } from 'src/message.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class ServiceBusService {
  private serviceBusClient: ServiceBusClient;
  constructor(
    private readonly messageService: MessageService,
    @InjectModel(Message.name) private messageModel: Model<IMessage>,
  ) {
    // constructor() {
    this.serviceBusClient = new ServiceBusClient(
      process.env.SERVICE_BUS,
    );
  }
  async sendMessage(queueName: string, body: string): Promise<void> {
    const sender = this.serviceBusClient.createSender(queueName);

    const message: ServiceBusMessage = {
      body: body,
      // Add other properties as needed
    };

    await sender.sendMessages([message]);
    await sender.close();
    this.receiveMessage(queueName);
  }

  async receiveMessage(queueName: string): Promise<void> {
    const receiver = this.serviceBusClient.createReceiver(queueName);

    const myMessageHandler = async (messageReceived) => {
      console.log(`Received message: ${messageReceived.body}`);
      const newMessage = new this.messageModel({
        type: queueName,
        message: messageReceived.body,
      });

      this.messageService.create(newMessage);
    };

    const myErrorHandler = async (error) => {
      console.log(error);
    };

    receiver.subscribe({
      processMessage: myMessageHandler,
      processError: myErrorHandler,
    });
    await delay(20000);

    await receiver.close();
  }
}
