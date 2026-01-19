import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_QUEUE_KEY = '@offline_ai_requests_queue';

export type QueuedRequest = {
  id: string;
  type: 'therapy' | 'chat';
  timestamp: number;
  data: any;
  retryCount: number;
};

class OfflineQueueManager {
  private queue: QueuedRequest[] = [];
  private isProcessing = false;

  async initialize() {
    try {
      const stored = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading offline queue:', error);
    }
  }

  async addToQueue(type: 'therapy' | 'chat', data: any): Promise<string> {
    const request: QueuedRequest = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: Date.now(),
      data,
      retryCount: 0,
    };

    this.queue.push(request);
    await this.saveQueue();
    
    console.log(`Added request to offline queue: ${request.id}`);
    return request.id;
  }

  async removeFromQueue(id: string) {
    this.queue = this.queue.filter(req => req.id !== id);
    await this.saveQueue();
  }

  async getQueue(): Promise<QueuedRequest[]> {
    return [...this.queue];
  }

  async clearQueue() {
    this.queue = [];
    await this.saveQueue();
  }

  private async saveQueue() {
    try {
      await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  }

  async processQueue(
    onProcess: (request: QueuedRequest) => Promise<boolean>
  ): Promise<number> {
    if (this.isProcessing) {
      console.log('Queue is already being processed');
      return 0;
    }

    this.isProcessing = true;
    let processedCount = 0;

    try {
      const queueCopy = [...this.queue];
      
      for (const request of queueCopy) {
        try {
          console.log(`Processing queued request: ${request.id}`);
          const success = await onProcess(request);
          
          if (success) {
            await this.removeFromQueue(request.id);
            processedCount++;
          } else {
            // Increment retry count
            const index = this.queue.findIndex(r => r.id === request.id);
            if (index !== -1) {
              this.queue[index].retryCount++;
              
              // Remove if too many retries (max 3)
              if (this.queue[index].retryCount >= 3) {
                console.log(`Removing request after 3 failed retries: ${request.id}`);
                await this.removeFromQueue(request.id);
              } else {
                await this.saveQueue();
              }
            }
          }
        } catch (error) {
          console.error(`Error processing request ${request.id}:`, error);
        }
      }
    } finally {
      this.isProcessing = false;
    }

    return processedCount;
  }

  getQueueSize(): number {
    return this.queue.length;
  }
}

export const offlineQueue = new OfflineQueueManager();
