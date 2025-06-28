import React from "react";
import { vi } from "vitest";

// Mock do react-router-dom
export const mockNavigate = vi.fn();
export const mockUseNavigate = vi.fn(() => mockNavigate);

interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export const Link = ({ to, children, className, ...props }: LinkProps) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

export const useNavigate = mockUseNavigate;

export const BrowserRouter = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="browser-router">{children}</div>
);

// Reset mocks helper
export const resetMocks = () => {
  mockNavigate.mockClear();
  mockUseNavigate.mockClear();
};
