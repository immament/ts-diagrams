export type SimpleObject = Record<string, unknown>;

export type PrepareToPrintOptions = {
  ignoreKeys?: string[];
  initFn?: (value: SimpleObject) => SimpleObject;
  cilcularObjKeys?: string[];
  circularCache?: CircularCache;
  mappers?: Record<string, (value: unknown) => unknown>;
};

export function prepareToPrintArray(
  objects?: SimpleObject[],
  {circularCache, cilcularObjKeys, ...options}: PrepareToPrintOptions = {}
) {
  /* istanbul ignore next*/
  circularCache ??= new CircularCache(cilcularObjKeys);
  return objects?.map(o =>
    prepareToPrint(o, {...options, circularCache, cilcularObjKeys})
  );
}

export function prepareToPrint(
  objectToPrepare?: SimpleObject,
  {
    ignoreKeys = [],
    initFn = () => ({}),
    cilcularObjKeys,
    circularCache,
    mappers = {},
  }: PrepareToPrintOptions = {}
): unknown {
  if (!objectToPrepare) return;

  circularCache ??= new CircularCache(cilcularObjKeys);

  return prepare(objectToPrepare);

  function prepare(obj: SimpleObject): unknown {
    return circularCache!.checkCircular(obj) ?? mapFields(obj);
  }

  function mapFields(node: SimpleObject) {
    return Object.entries(node)
      .filter(([key]) => shouldIgnoreKey(key))
      .reduce((acc, [key, value]) => {
        value = mapField(key, value);

        if (value) acc[key] = value;
        return acc;
      }, initFn(node));
  }

  function mapField(key: string, value: unknown) {
    if (hasValueMapper(key)) return mapValue(key, value);
    if (Array.isArray(value)) return value.map(v => prepare(v));
    if (isObject(value)) return prepare(value);
    return value;
  }

  function hasValueMapper(key: string) {
    return mappers[key];
  }
  function mapValue(key: string, value: unknown): unknown {
    return mappers[key](value);
  }

  function shouldIgnoreKey(key: string): unknown {
    return !ignoreKeys.includes(key);
  }

  function isObject(obj: unknown): obj is SimpleObject {
    return typeof obj === 'object';
  }
}

class CircularCache {
  private objectsCache: SimpleObject[] = [];

  constructor(private cilcularObjKeys: string[] = []) {}

  add(obj: Record<string, unknown>) {
    this.objectsCache.push(obj);
  }

  isCircular(node: Record<string, unknown>) {
    return this.objectsCache.includes(node);
  }

  checkCircular(obj: Record<string, unknown>) {
    if (this.isCircular(obj)) {
      return this.createCircularValue(obj);
    }
    this.add(obj);
    return;
  }

  createCircularValue(obj: SimpleObject) {
    let result = 'circular';
    if (this.cilcularObjKeys.length) {
      const ids = this.cilcularObjKeys.map(v => obj[v]).join('/');
      result += ` [${ids}]`;
    }
    return result;
  }
}
