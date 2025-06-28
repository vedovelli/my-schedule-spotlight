# Test Environment Setup

This directory contains the test configuration and utilities for the project.

## Configuration

### Vitest Setup

- **Framework**: Vitest with jsdom environment
- **Testing Library**: React Testing Library with jest-dom matchers
- **TypeScript**: Full TypeScript support with proper type definitions

### Files Structure

```
src/test/
├── README.md           # This documentation
├── setup.ts           # Vitest setup file with jest-dom configuration
├── test-utils.tsx     # Custom render function with providers
├── vitest.d.ts        # TypeScript definitions for Vitest + jest-dom
└── example.test.tsx   # Example test demonstrating the setup
```

## Available Scripts

- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:coverage` - Run tests with coverage report

## Usage

### Basic Testing

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/test-utils";
import { MyComponent } from "@/components/MyComponent";

describe("MyComponent", () => {
  it("should render correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

### Using Custom Test Utils

The `test-utils.tsx` file provides:

- Custom render function with React Router and React Query providers
- Optimized QueryClient for testing (no retries, no cache)
- Console error mocking utilities

### Mocking

Use Vitest's built-in mocking capabilities:

```tsx
import { vi } from "vitest";

// Mock a module
vi.mock("@/lib/api", () => ({
  fetchData: vi.fn(),
}));
```

## Features Configured

✅ Vitest with jsdom environment  
✅ React Testing Library  
✅ jest-dom matchers  
✅ TypeScript support  
✅ React Router provider in tests  
✅ React Query provider in tests  
✅ Console error mocking utilities  
✅ Optimized test configuration

## Next Steps

This setup provides the foundation for:

1. Unit tests for utility functions and hooks
2. Component tests with proper mocking
3. Integration tests for user flows
4. CI/CD pipeline integration
