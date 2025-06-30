import { act, fireEvent, render, screen } from '@/test/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import SignIn from '@/pages/SignIn';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
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

// Mock console.log para verificar tentativas de login
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('SignIn Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form elements correctly', () => {
    render(<SignIn />);

    expect(screen.getByText('Entrar na sua conta')).toBeInTheDocument();
    expect(
      screen.getByText('Digite seu email e senha para acessar')
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
    expect(screen.getByText('Esqueceu a senha?')).toBeInTheDocument();
    expect(screen.getByText('Cadastre-se')).toBeInTheDocument();
  });

  it('should show password toggle functionality', () => {
    render(<SignIn />);

    const passwordInput = screen.getByLabelText('Senha');
    const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button

    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click to hide password again
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should update input values when typing', () => {
    render(<SignIn />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('should require email and password fields', () => {
    render(<SignIn />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it('should handle form submission', () => {
    render(<SignIn />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByRole('button', { name: 'Entrar' });

    // Fill form
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit form
    act(() => {
      fireEvent.click(submitButton);
    });

    // Check loading state appears
    expect(screen.getByText('Entrando...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should prevent form submission when fields are empty', () => {
    render(<SignIn />);

    const submitButton = screen.getByRole('button', { name: 'Entrar' });

    fireEvent.click(submitButton);

    // Form should not submit due to HTML5 validation
    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  it('should render correct links', () => {
    render(<SignIn />);

    const forgotPasswordLink = screen.getByText('Esqueceu a senha?');
    const signUpLink = screen.getByText('Cadastre-se');

    expect(forgotPasswordLink.closest('a')).toHaveAttribute(
      'href',
      '/recover-password'
    );
    expect(signUpLink.closest('a')).toHaveAttribute('href', '/signup');
  });

  it('should have proper accessibility attributes', () => {
    render(<SignIn />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('placeholder', 'seu@email.com');

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('placeholder', 'Sua senha');
  });
});
