import { act, fireEvent, render, screen } from "@/test/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import RecoverPassword from "@/pages/RecoverPassword";

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Link: ({
      to,
      children,
      className,
    }: {
      to: string;
      children: React.ReactNode;
      className?: string;
    }) => (
      <a href={to} className={className} data-testid="link">
        {children}
      </a>
    ),
  };
});

// Mock console.log para verificar tentativas de recuperação
const mockConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

describe("RecoverPassword Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render initial form correctly", () => {
    render(<RecoverPassword />);

    expect(screen.getByText("Recuperar senha")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Digite seu email para receber as instruções de recuperação"
      )
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Enviar instruções" })
    ).toBeInTheDocument();
    expect(screen.getByText("Voltar ao login")).toBeInTheDocument();
  });

  it("should update email input value when typing", () => {
    render(<RecoverPassword />);

    const emailInput = screen.getByLabelText("Email");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    expect(emailInput).toHaveValue("test@example.com");
  });

  it("should require email field", () => {
    render(<RecoverPassword />);

    const emailInput = screen.getByLabelText("Email");

    expect(emailInput).toBeRequired();
  });

  it("should handle form submission", () => {
    render(<RecoverPassword />);

    const emailInput = screen.getByLabelText("Email");
    const submitButton = screen.getByRole("button", {
      name: "Enviar instruções",
    });

    // Fill form
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    // Submit form
    act(() => {
      fireEvent.click(submitButton);
    });

    // Check loading state appears
    expect(screen.getByText("Enviando...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("should prevent form submission when email is empty", () => {
    render(<RecoverPassword />);

    const submitButton = screen.getByRole("button", {
      name: "Enviar instruções",
    });

    fireEvent.click(submitButton);

    // Form should not submit due to HTML5 validation
    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  it("should render correct links", () => {
    render(<RecoverPassword />);

    const backToLoginLink = screen.getByText("Voltar ao login");

    expect(backToLoginLink.closest("a")).toHaveAttribute("href", "/signin");
  });

  it("should have proper accessibility attributes", () => {
    render(<RecoverPassword />);

    const emailInput = screen.getByLabelText("Email");

    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("placeholder", "seu@email.com");
  });
});
