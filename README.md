
## Queue manager for NestJS applications
Easy for use and installation into you'r projects.

`yarn add @npkgdev/nestjs-queue`

*For better working you need to use `nest` package with `6.*.*` ver.*
#### How to

1) Add new module in your `app.module.ts` file:

    *This module (QueueModule) marked as global.*

    ```typescript
    import { Module } from '@nestjs/common';
    import { QueueModule } from '@npkgdev/nestjs-queue';

    @Module({
        imports: [
            QueueModule.forRoot({}),
        ]
    })
    export class AppModule {}
    ```

    For first parameter `forRoot` function accept options for current module.
    Settings very simply and have this structure:

    ```typescript
    export interface QueueModuleOptions {
       name?: string
    }
    ```

2) Add queue and handle events

    For add job to queue u need inject a Queue instance into your service or controller.
    For example:

    ```typescript
    import { Controller, Get } from '@nestjs/common'
    import { QueueInjection } from 'nest-queue';

    @Controller('test')
    class TestController {
       constructor(
           @QueueInjection() private readonly queue: Queue,
       ) {}

       @Get('/')
       index() {
           this.queue.add('testEvent', { data: 1, somedata: 2 });
       }
    }
    ```

    Anywhere (controllers, services) in your project you can provide event handler for redis calls.
    `@QueueWorker(eventName)` method decorator allows you to work with it. For example:

    ```typescript
    import { QueueWorker } from '@npkgdev/nestjs-queue';

    class TestService {
        @QueueWorker('testEvent')
        eventHandler(input: any, cb: any) {
           // input.task has passed data from queue adding
           cb(); // required call to stop job
        }
    }
    ```

    *Context (this) in this function equals to TestService prototype with all resolved dependencies*

    Function that will provide as event handler receive two arguments `Job` and `DoneCallback`.
