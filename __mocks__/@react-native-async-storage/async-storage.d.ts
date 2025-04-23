declare module '@react-native-async-storage/async-storage' {
  interface AsyncStorageMock {
    data: Map<string, string>;
    setItem: (key: string, value: string) => Promise<void>;
    getItem: (key: string) => Promise<string | null>;
    removeItem: (key: string) => Promise<void>;
    clear: () => Promise<void>;
    getAllKeys: () => Promise<string[]>;
    _clearMockData: () => void;
  }

  const AsyncStorage: AsyncStorageMock;
  export default AsyncStorage;
} 