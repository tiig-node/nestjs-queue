import BetterQueue from "better-queue";

export class UniqueQueue {
  private arrQueue: Array<any>;
  private queue: any;

  constructor (worker: any, options?: {
    concurrent?: number;
    afterProcessDelay?: number;
  }) {
    const opt = options || { };
    this.arrQueue = new Array();
    this.queue = new BetterQueue(worker, {
      cancelIfRunning: false,
      concurrent: 5 || 1,
      // delayedDebounce: 3000,
      ...opt
    });
    this.queue.on("task_finish", (taskId: any, _result: any) => {
      // console.log(taskId, "Finish");

      const taskQueueId = this.arrQueue.findIndex(el => el.id === taskId);
      if (taskQueueId > -1) {
        // console.log(taskId, "Dequeue");
        this.arrQueue.splice(taskQueueId, 1);
        // Handle finished result
      }
    });
  }

  public inQueue (id: any) {
    if (this.arrQueue.find(el => el.id === id)) {
      return true;
    } else return false;
  }

  public enqueue (id: string, task: any) {
    // if (!this.arrQueue.find(el => el.id === id)) {]
    if (!this.inQueue(id)) {
      // console.log(id, "enqueue");
      this.arrQueue.push({ id });
      this.queue.push({ id, task });
    }
  }
}
