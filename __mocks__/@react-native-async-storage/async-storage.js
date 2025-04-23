const AsyncStorage = {
  data: new Map(),

  setItem: jest.fn((key, value) => {
    return new Promise((resolve) => {
      AsyncStorage.data.set(key, value);
      resolve(null);
    });
  }),

  getItem: jest.fn((key) => {
    return new Promise((resolve) => {
      resolve(AsyncStorage.data.get(key) || null);
    });
  }),

  removeItem: jest.fn((key) => {
    return new Promise((resolve) => {
      AsyncStorage.data.delete(key);
      resolve(null);
    });
  }),

  clear: jest.fn(() => {
    return new Promise((resolve) => {
      AsyncStorage.data.clear();
      resolve(null);
    });
  }),

  getAllKeys: jest.fn(() => {
    return new Promise((resolve) => {
      resolve(Array.from(AsyncStorage.data.keys()));
    });
  }),

  // Helper method to clear mock data between tests
  _clearMockData: () => {
    AsyncStorage.data.clear();
  },
};

export default AsyncStorage; 