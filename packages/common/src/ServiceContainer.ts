import {NotifyService} from './NotifyService';

export class ServiceContainer {
  private types = new Map<string, unknown>();

  private notifyService = new NotifyService();

  constructor(private name: string) {}

  getName() {
    return this.name;
  }

  get<T>(key: string): T | undefined {
    return this.types.get(key) as T;
  }

  set<T>(key: string, value: T): void {
    this.types.set(key, value);
    this.notifyService.notify(key, value);
  }

  getOrThrow<T>(key: string): T {
    const item = this.get<T>(key);
    if (!item)
      throw new Error(`ServiceContainer ${this.name} - No item for key ${key}`);
    return item;
  }

  wait<T>(forKey: string): Promise<T> {
    const item = this.get<T>(forKey);

    return item
      ? Promise.resolve(item)
      : new Promise(resolve => {
          this.notifyService.register(forKey, item => resolve(item.value as T));
        });
  }
}
