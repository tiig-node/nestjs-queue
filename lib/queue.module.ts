import { DynamicModule, Global, Module, OnModuleInit } from "@nestjs/common";
import { MetadataScanner } from "@nestjs/core/metadata-scanner";
import { Queue } from "./queue";
import { QueueInjection } from "./queue.decorators";
import { QueueModuleOptions } from "./queue.interfaces";
import { QueueProvider } from "./queue.provider";

const defaultOptions: QueueModuleOptions = {
  name: "default",
  concurrent: 1
};

@Global()
@Module({
  providers: [QueueProvider, MetadataScanner]
})
export class QueueModule implements OnModuleInit {
  constructor (
    private readonly provider: QueueProvider,
    @QueueInjection()
    private readonly queue: Queue
  ) {}

  onModuleInit () {
    const workers = this.provider.getQueueWorkers();

    if (workers && workers.length) {
      workers.forEach(worker => {
        this.queue.process(worker.eventName, (...args) => {
          // console.log(consumer.eventName, consumer.callback);
          worker.instance.callback = worker.callback;
          return worker.instance.callback(...args);
        });
      });
    }
  }

  static forRoot (options: QueueModuleOptions): DynamicModule {
    const currentOptions: QueueModuleOptions = Object.assign(
      defaultOptions,
      options
    );

    const [valueProvider, factoryProvider] = QueueProvider.createProviders(
      currentOptions
    );

    return {
      module: QueueModule,
      providers: [valueProvider, factoryProvider],
      exports: [factoryProvider]
    };
  }
}
