interface StoredValue {
  value: string;
  ttl?: number;
}

const dataMap = new Map<string, StoredValue>();

function expireTTL(key: string) {
  const storedValue = dataMap.get(key);
  if (storedValue?.ttl && Date.now() > storedValue.ttl) {
    dataMap.delete(key);
  }
}

const storage = {
  set(key: string, value: string) {
    const storedValue = { value };
    dataMap.set(key, storedValue);
  },

  get(key: string): string | undefined {
    return dataMap.get(key)?.value;
  },

  del(key: string): boolean {
    return dataMap.delete(key);
  },

  exists(key: string): boolean {
    return dataMap.has(key);
  },

  expire(key: string, ttl: number): boolean {
    const storedValue = dataMap.get(key);
    if (storedValue) {
      storedValue.ttl = Date.now() + ttl * 1000;
      return true;
    }
    return false;
  },

  ttl(key: string): number {
    const storedValue = dataMap.get(key);

    if (!storedValue) return -2;
    const { ttl } = storedValue;
    if (ttl) {
      return Math.floor((ttl - Date.now()) / 1000);
    }
    return -1;
  },
};

type UnknownFunction = (...args: unknown[]) => unknown;

const proxy = new Proxy(storage, {
  get(target, key) {
    const origMethod = target[key as keyof typeof target];
    // Should not happen for now as all properties are methods but allow for future changes
    if (typeof origMethod !== "function") {
      return origMethod;
    }
    return function (...args: unknown[]) {
      // This approach will only expire on method calls, not in the background
      // This is a trade-off for simplicity and performance
      // In the future, a background cleanup should be considered
      expireTTL(args[0] as string);
      return (origMethod as UnknownFunction).apply(null, args);
    };
  },
});

export default proxy;
