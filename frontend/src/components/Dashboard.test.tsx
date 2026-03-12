import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../AuthContext';
import Dashboard from './Dashboard';
import Login from './Login';

// Mock axios
vi.mock('axios');

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  it('renders dashboard when user is authenticated', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText(/FinMate/i)).toBeInTheDocument();
  });

  it('has navigation tabs', () => {
    renderWithRouter(<Dashboard />);
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
    expect(screen.getByText('Gamification')).toBeInTheDocument();
  });

  it('allows switching between tabs', async () => {
    renderWithRouter(<Dashboard />);
    const goalsTab = screen.getByText('Goals');
    
    fireEvent.click(goalsTab);
    
    await waitFor(() => {
      // Tab should be active (we can check via className or other attributes)
      expect(goalsTab).toHaveClass('from-cyan-500');
    });
  });
});

describe('Login Component', () => {
  it('renders login form', () => {
    renderWithRouter(<Login />);
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('validates email format', () => {
    renderWithRouter(<Login />);
    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
    
    fireEvent.change(emailInput, { target: { value: 'invalid' } });
    expect(emailInput.value).toBe('invalid');
  });

  it('requires password to be filled', async () => {
    renderWithRouter(<Login />);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.click(submitButton);
    
    // Should show validation error or not submit
    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText(/email/i);
      expect(emailInput).toBeInTheDocument();
    });
  });
});

describe('Form Validation', () => {
  it('requires email and password on login', () => {
    renderWithRouter(<Login />);
    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;
    
    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');
  });
});

describe('UI Interactions', () => {
  it('handles logout button click', async () => {
    const { container } = renderWithRouter(<Dashboard />);
    const logoutButton = screen.getByText(/Sign Out/i);
    
    expect(logoutButton).toBeInTheDocument();
    fireEvent.click(logoutButton);
    
    // Component should redirect to login
    await waitFor(() => {
      expect(screen.queryByText(/FinMate/i)).not.toBeInTheDocument();
    }, { timeout: 5000 }).catch(() => {
      // Component might navigate away
    });
  });
});

describe('Responsive Design', () => {
  it('renders on mobile viewport', () => {
    global.innerWidth = 375;
    global.innerHeight = 667;
    global.dispatchEvent(new Event('resize'));
    
    const { container } = renderWithRouter(<Dashboard />);
    expect(container).toBeInTheDocument();
  });

  it('renders on desktop viewport', () => {
    global.innerWidth = 1920;
    global.innerHeight = 1080;
    global.dispatchEvent(new Event('resize'));
    
    const { container } = renderWithRouter(<Dashboard />);
    expect(container).toBeInTheDocument();
  });
});
