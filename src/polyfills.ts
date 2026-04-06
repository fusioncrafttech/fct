// Buffer and process polyfills for browser environment
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

// Process polyfill
if (typeof window !== 'undefined' && !(window as any).process) {
  (window as any).process = {
    env: {},
    version: '',
    platform: 'browser',
    nextTick: (fn: Function) => setTimeout(fn, 0),
  };
}

// Also make available in global scope for compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = Buffer;
  (globalThis as any).process = (globalThis as any).process || {
    env: {},
    version: '',
    platform: 'browser',
    nextTick: (fn: Function) => setTimeout(fn, 0),
  };
}

export default Buffer;
