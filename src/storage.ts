const dataMap = new Map<string, string>();

const storage = {
  set(key: string, value: string) {
    dataMap.set(key, value);
  },

  get(key: string): string | undefined {
    return dataMap.get(key);
  },

  del(key: string): boolean {
    return dataMap.delete(key);
  },

  exists(key: string): boolean {
    return dataMap.has(key);
  },
};

export default storage;
