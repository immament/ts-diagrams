export class Cache<K extends object, V> {
  private _isEmpty = true;
  private readonly map = new WeakMap<K, V>();

  isEmpty() {
    return this._isEmpty;
  }

  getOrCreate(key: K, ctr: (key: K) => V) {
    return this.map.get(key) ?? this.create(key, ctr);
  }

  get(key: K) {
    return this.map.get(key);
  }

  has(key: K) {
    return this.map.has(key);
  }

  set(key: K, value: V) {
    this.map.set(key, value);
    this._isEmpty = false;
  }

  protected create(key: K, ctr: (key: K) => V) {
    const value = ctr(key);
    if (value !== undefined) {
      this.set(key, value);
    }
    return value;
  }
}

export class CacheWithUndefined<K extends object, V> extends Cache<
  K,
  V | undefined
> {
  protected create(key: K, ctr: (key: K) => V) {
    const value = ctr(key);
    this.set(key, value);
    return value;
  }
}
