export interface QueueModuleOptions {
  name?: string;
  concurrent?: number;
  afterProcessDelay?: number;
  // connection: Bull.QueueOptions;
}
