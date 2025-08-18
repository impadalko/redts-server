const dataMap = new Map<string, string>();

const storage = {
  set(key: string, value: string) {
    dataMap.set(key, value);
  },

  get(key: string): string | undefined {
    return dataMap.get(key);
  },
};

export default storage;
