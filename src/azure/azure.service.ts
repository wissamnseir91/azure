import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventHubConsumerClient } from '@azure/event-hubs';
import { ServiceBusService } from './service-bus/service-bus.service';

@Injectable()
export class AzureService implements OnModuleInit {
  private consumerClient: EventHubConsumerClient;

  constructor(private readonly serviceBusService: ServiceBusService) {
    this.consumerClient = new EventHubConsumerClient(
      '$Default',
      'Endpoint=sb://wissam.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=L8GkMCy79uvNKZuSKWB9SvVKg6lZyrrhs+AEhECA/MY=',
      'wissameventhub',
    );
  }

  async onModuleInit() {
    const subscription = this.consumerClient.subscribe({
      processEvents: async (events, context) => {
        if (events.length === 0) {
          console.log(
            `No events received within wait time. Waiting for next interval`,
          );
          return;
        }

        for (const event of events) {
          console.log(
            `Received event: '${event.body.type}' from partition: '${context.partitionId}' and consumer group: '${context.consumerGroup}'`,
          );
          this.serviceBusService.sendMessage(
            event.body.type,
            event.body.message,
          );
        }
        // Update the checkpoint.
        await context.updateCheckpoint(events[events.length - 1]);
      },

      processError: async (err, context) => {
        console.log(`Error : ${err}`);
      },
    });
    await new Promise(() => {});
    // After 30 seconds, stop processing.
    // await new Promise((resolve) => {
    //   setTimeout(async () => {
    //     await subscription.close();
    //     await this.consumerClient.close();
    //   }, 30000);
    // });
  }
}
