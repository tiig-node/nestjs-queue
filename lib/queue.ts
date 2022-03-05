import { UniqueQueue } from "./uqueue";

export class Queue {
  private arrQueue: Map<string, UniqueQueue>;
  private options: any;

  constructor (options?: {
    concurrent?: number;
    afterProcessDelay?: number;
  }) {
    this.arrQueue = new Map();
    this.options = options || { };
  }

  process (queueName: string, worker: any) {
    if (!this.arrQueue.get(queueName)) {
      this.arrQueue.set(queueName, new UniqueQueue(worker, this.options));
    }
  }

  public inQueue (queueName: string, taskId: string) {
    const queue = this.arrQueue.get(queueName);
    if (!queue) return false;

    return queue.inQueue(taskId);
  }

  public push (queueName: string, taskId: string, task: any) {
    const queue = this.arrQueue.get(queueName);
    if (!queue) return false;

    return queue.enqueue(taskId, task);
  }
}
