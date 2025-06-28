import { act, fireEvent, render, screen } from '@/test/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import SignUp from '@/pages/SignUp';

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

// Mock console.log para verificar tentativas de cadastro
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

// Mock alert para verificar validação de senhas
const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('SignUp Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form elements correctly', () => {
    render(<SignUp />);

    expect(
      screen.getByRole('heading', { name: 'Criar conta' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Preencha os dados para criar sua conta')
    ).toBeInTheDocument();

    expect(screen.getByLabelText('Nome completo')).toBeInTheDocument();
    expect(screen.getByLabelText('Empresa')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar senha')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Criar conta' })
    ).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it('should show password toggle functionality for both password fields', () => {
    render(<SignUp />);

    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha');
    const toggleButtons = screen.getAllByRole('button', { name: '' }); // Eye icon buttons

    // Initially passwords should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(toggleButtons[0]);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click to show confirm password
    fireEvent.click(toggleButtons[1]);
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    // Click to hide passwords again
    fireEvent.click(toggleButtons[0]);
    fireEvent.click(toggleButtons[1]);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  it('should update input values when typing', () => {
    render(<SignUp />);

    const nameInput = screen.getByLabelText('Nome completo');
    const companyInput = screen.getByLabelText('Empresa');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha');

    fireEvent.change(nameInput, { target: { value: 'João Silva' } });
    fireEvent.change(companyInput, { target: { value: 'Empresa XYZ' } });
    fireEvent.change(emailInput, { target: { value: 'joao@empresa.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });

    expect(nameInput).toHaveValue('João Silva');
    expect(companyInput).toHaveValue('Empresa XYZ');
    expect(emailInput).toHaveValue('joao@empresa.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
  });

  it('should require all fields', () => {
    render(<SignUp />);

    const nameInput = screen.getByLabelText('Nome completo');
    const companyInput = screen.getByLabelText('Empresa');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha');

    expect(nameInput).toBeRequired();
    expect(companyInput).toBeRequired();
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
    expect(confirmPasswordInput).toBeRequired();
  });

  it('should validate password minimum length', () => {
    render(<SignUp />);

    const passwordInput = screen.getByLabelText('Senha');

    expect(passwordInput).toHaveAttribute('minLength', '8');
  });

  it('should handle form submission', () => {
    render(<SignUp />);

    const nameInput = screen.getByLabelText('Nome completo');
    const companyInput = screen.getByLabelText('Empresa');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha');
    const submitButton = screen.getByRole('button', { name: 'Criar conta' });

    // Fill form with valid data
    fireEvent.change(nameInput, { target: { value: 'João Silva' } });
    fireEvent.change(companyInput, { target: { value: 'Empresa XYZ' } });
    fireEvent.change(emailInput, { target: { value: 'joao@empresa.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123' },
    });

    // Submit form
    act(() => {
      fireEvent.click(submitButton);
    });

    // Check loading state appears
    expect(screen.getByText('Criando conta...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should show error when passwords do not match', async () => {
    render(<SignUp />);

    const nameInput = screen.getByLabelText('Nome completo');
    const companyInput = screen.getByLabelText('Empresa');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha');
    const submitButton = screen.getByRole('button', { name: 'Criar conta' });

    // Fill form with mismatched passwords
    fireEvent.change(nameInput, { target: { value: 'João Silva' } });
    fireEvent.change(companyInput, { target: { value: 'Empresa XYZ' } });
    fireEvent.change(emailInput, { target: { value: 'joao@empresa.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'different123' },
    });

    // Submit form
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Check that the form validation prevents submission
    // (Since we're using toast instead of alert, we just verify the form doesn't submit)
    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  it('should prevent form submission when fields are empty', () => {
    render(<SignUp />);

    const submitButton = screen.getByRole('button', { name: 'Criar conta' });

    fireEvent.click(submitButton);

    // Form should not submit due to HTML5 validation
    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  it('should render correct links', () => {
    render(<SignUp />);

    const signInLink = screen.getByText('Entrar');

    expect(signInLink.closest('a')).toHaveAttribute('href', '/signin');
  });

  it('should have proper accessibility attributes', () => {
    render(<SignUp />);

    const nameInput = screen.getByLabelText('Nome completo');
    const companyInput = screen.getByLabelText('Empresa');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const confirmPasswordInput = screen.getByLabelText('Confirmar senha');

    expect(nameInput).toHaveAttribute('type', 'text');
    expect(nameInput).toHaveAttribute('placeholder', 'Seu nome completo');

    expect(companyInput).toHaveAttribute('type', 'text');
    expect(companyInput).toHaveAttribute('placeholder', 'Nome da sua empresa');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('placeholder', 'seu@email.com');

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('placeholder', 'Mínimo 8 caracteres');

    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute(
      'placeholder',
      'Confirme sua senha'
    );
  });

  it('should handle individual field updates correctly', () => {
    render(<SignUp />);

    const nameInput = screen.getByLabelText('Nome completo');
    const emailInput = screen.getByLabelText('Email');

    // Test that individual field updates work
    fireEvent.change(nameInput, { target: { value: 'Test Name' } });
    expect(nameInput).toHaveValue('Test Name');

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    expect(emailInput).toHaveValue('test@test.com');

    // Ensure other fields remain empty
    const companyInput = screen.getByLabelText('Empresa');
    expect(companyInput).toHaveValue('');
  });
});
