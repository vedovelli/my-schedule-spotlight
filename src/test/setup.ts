import "@testing-library/jest-dom";

import * as matchers from "@testing-library/jest-dom/matchers";

import { afterEach, expect } from "vitest";

import { cleanup } from "@testing-library/react";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
