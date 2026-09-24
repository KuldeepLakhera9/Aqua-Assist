import "@testing-library/jest-dom";
import { expect, vi } from "vitest";
import { toHaveNoViolations } from "jest-axe";

// Global jest compatibility alias for Vitest
globalThis.jest = vi;

// Extend expect with jest-axe accessibility matcher
expect.extend(toHaveNoViolations);

// Mock window.matchMedia for Vitest / JSDOM
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  });
}

// Vitest provides describe/it/expect globals; eslint may still flag them if config missing.
// If needed, add a local eslint env override comment:
/* eslint-env jest */

