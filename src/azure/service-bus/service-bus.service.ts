import { ServiceBusClient, ServiceBusMessage, delay } from '@azure/service-bus';
import { Injectable } from '@nestjs/common';
import { Message } from 'src/message.model';
import { MessageService } from 'src/message.service';

@Injectable()
export class ServiceBusService {
  private serviceBusClient: ServiceBusClient;
  constructor(private readonly messageService: MessageService) {
    // constructor() {
    this.serviceBusClient = new ServiceBusClient(
      'Endpoint=sb://wissambus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=cmSioAE0wFTM1jzdOr/+RDsuIZGJbG4rr+ASbOGN/CI=',
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
      const newMessage = new Message({
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
