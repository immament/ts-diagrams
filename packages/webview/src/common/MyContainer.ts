export class MyContainer {
  private types = new Map<string, unknown>();

  get<T>(key: string): T | undefined {
    return this.types.get(key) as T;
  }

  set<T>(key: string, value: T): void {
    this.types.set(key, value);
  }

  getOrThrow<T>(key: string): T {
    const item = this.get<T>(key);
    if (!item) throw new Error(`No item for key ${key}`);
    return item;
  }
}

const myContainer = (global.MyContainer = new MyContainer());

export default myContainer;