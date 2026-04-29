import { createMMKV } from 'react-native-mmkv';

/**
 * High-performance MMKV storage instance using Nitro (v4.x).
 */
let storage;

try {
  // In MMKV 4.x, we use createMMKV() instead of new MMKV()
  storage = createMMKV({
    id: 'cooksense-storage'
  });
  console.log('MMKV Nitro Storage initialized successfully');
} catch (error) {
  console.warn('MMKV Nitro module not found, using memory fallback:', error);
  
  const memoryCache = {};
  storage = {
    set: (key, value) => { memoryCache[key] = value; },
    getString: (key) => memoryCache[key] || null,
    getNumber: (key) => memoryCache[key] || 0,
    getBoolean: (key) => memoryCache[key] || false,
    delete: (key) => { delete memoryCache[key]; },
    clearAll: () => { Object.keys(memoryCache).forEach(k => delete memoryCache[k]); },
  };
}

/**
 * Persistence adapter for redux-persist
 */
export const reduxStorage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

export { storage };