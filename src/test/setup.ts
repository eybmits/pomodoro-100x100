import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";

function createStorageMock() {
  let store: Record<string, string> = {};

  return {
    get length() {
      return Object.keys(store).length;
    },
    clear() {
      store = {};
    },
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    key(index: number) {
      return Object.keys(store)[index] ?? null;
    },
    removeItem(key: string) {
      delete store[key];
    },
    setItem(key: string, value: string) {
      store[key] = String(value);
    }
  };
}

Object.defineProperty(window, "localStorage", {
  value: createStorageMock(),
  configurable: true
});

beforeEach(() => {
  window.localStorage.clear();
  window.location.hash = "#/";
});

afterEach(() => {
  cleanup();
});
