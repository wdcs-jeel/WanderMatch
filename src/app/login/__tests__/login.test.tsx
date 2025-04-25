import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginPage from '../page'; // adjust the import
// Mock the auth context
const mockUseAuth = jest.fn();
jest.mock('../../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock navigation
const mockUseNavigation = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockUseNavigation(),
}));

describe('LoginPage', () => {
  const mockNavigate = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    // (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate, goBack: jest.fn() });
    // (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });

    jest.clearAllMocks();
    
    // Setup default mock implementation
    mockUseAuth.mockReturnValue({
      register: mockLogin,
    });

    // Setup navigation mock
    mockUseNavigation.mockReturnValue({
      navigate: mockNavigate,
    });
  });

  it('renders email and password fields', () => {
    const { getByPlaceholderText } = render(<LoginPage />);
    expect(getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
  });

  it('shows validation errors for empty fields', async () => {
    const { getByText, getByRole } = render(<LoginPage />);
    // const signInButton = getByRole('button');

    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('shows validation error for invalid email', async () => {
    const { getByPlaceholderText, getByText, getByRole } = render(<LoginPage />);
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'invalid-email');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), '123456');

    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect(getByText('Please enter a valid email')).toBeTruthy();
    });
  });

  it('calls login function with valid inputs', async () => {
    mockLogin.mockResolvedValueOnce(true);

    const { getByPlaceholderText, getByText } = render(<LoginPage />);
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');

    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
      expect({ email: 'test@example.com', password: 'password123' });
    });
  });

  it('shows error if login fails', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginPage />);
    fireEvent.changeText(getByPlaceholderText('Enter your email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');

    fireEvent.press(getByText('Sign In'));

    await waitFor(() => {
        expect(getByText('Invalid email or password. Please try again.')).toBeTruthy();
      });
  });
});
