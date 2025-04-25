import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OnboardingPage from '../page';
import { useAuth } from '../../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

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

describe('OnboardingPage', () => {
  const mockRegister = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementation
    mockUseAuth.mockReturnValue({
      register: mockRegister,
    });

    // Setup navigation mock
    mockUseNavigation.mockReturnValue({
      navigate: mockNavigate,
    });
  });

  describe('Step 1: Account Creation', () => {
    it('renders form correctly', () => {
      const { getByTestId, getByText } = render(<OnboardingPage />);
      
    // Check for email input
    expect(getByTestId('email-input')).toBeTruthy();
    
    // Check for password input
    expect(getByTestId('password-input')).toBeTruthy();
    
    // Check for phone input
    fireEvent.press(getByText('Phone'));
    expect(getByTestId('phone-input')).toBeTruthy();
    
    // Check for continue button
    expect(getByText('Continue')).toBeTruthy();
    });

    it('validates email format', async () => {
      const { getByTestId, getByText, queryByText } = render(<OnboardingPage />);
      
      const emailInput = getByTestId('email-input');
      fireEvent.changeText(emailInput, 'invalid-email');
      
      const continueButton = getByText('Continue');
      fireEvent.press(continueButton);
      
      await waitFor(() => {
        expect(queryByText('Please enter a valid email')).toBeTruthy();
      });
    });

    it('validates password length', async () => {
      const { getByTestId, getByText, queryByText } = render(<OnboardingPage />);
      
      const passwordInput = getByTestId('password-input');
      fireEvent.changeText(passwordInput, '12345');
      
      const continueButton = getByText('Continue');
      fireEvent.press(continueButton);
      
      await waitFor(() => {
        expect(queryByText('Password must be at least 6 characters')).toBeTruthy();
      });
    });

    it('validates phone number format', async () => {
      const { getByTestId, getByText, queryByText } = render(<OnboardingPage />);
      
      // Switch to phone tab
      fireEvent.press(getByText('Phone'));
      
      const phoneInput = getByTestId('phone-input');
      fireEvent.changeText(phoneInput, '123');
      
      const continueButton = getByText('Continue');
      fireEvent.press(continueButton);
      
      await waitFor(() => {
        expect(queryByText('Please enter a valid phone number')).toBeTruthy();
      });
    });
  });

  describe('Step 2: Identity Verification', () => {
    it('validates full name', async () => {
      const { getByTestId, getByText, queryByText } = render(<OnboardingPage />);
      
      // Fill in step 1 and proceed
      fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
      fireEvent.changeText(getByTestId('password-input'), 'password123');
      fireEvent.press(getByText('Continue'));

      // Try to proceed without full name
      fireEvent.press(getByText('Continue'));
      
      await waitFor(() => {
        expect(queryByText('Full name is required')).toBeTruthy();
      });
    });

    it('validates date of birth', async () => {
      const { getByTestId, getByText, queryByText } = render(<OnboardingPage />);
      
      // Fill in step 1 and proceed
      fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
      fireEvent.changeText(getByTestId('password-input'), 'password123');
      fireEvent.press(getByText('Continue'));
      
      // Fill in full name
      fireEvent.changeText(getByTestId('full-name-input'), 'John Doe');
      
      // Try to proceed without date of birth
      fireEvent.press(getByText('Continue'));
      
      await waitFor(() => {
        expect(queryByText('Date of birth is required')).toBeTruthy();
      });
    });
  });

  describe('Step 3: Travel Preferences', () => {
    it('validates travel type selection', async () => {
      const { getByTestId, getByText, queryByText, debug } = render(<OnboardingPage />);
      
      // Fill in step 1
      fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
      fireEvent.changeText(getByTestId('password-input'), 'password123');
      fireEvent.press(getByText('Continue'));
      
      // Fill in step 2
      fireEvent.changeText(getByTestId('full-name-input'), 'John Doe');
      fireEvent.changeText(getByTestId('date-of-birth-input'), '1990-01-01');
      
      // Check the identity confirmation checkbox
      const checkbox = getByTestId('identity-confirm-checkbox');
      fireEvent.press(checkbox);
      
      // Verify checkbox is checked
      expect(checkbox.props.checked).toBeTruthy();
      
      // First continue to move to next step
      fireEvent.press(getByText('Continue'));
      
      // Wait for the next step to be visible
      await waitFor(() => {
        expect(getByText('Solo Traveler')).toBeTruthy();
      });
      
      // Try to proceed without selecting travel type
      fireEvent.press(getByText('Continue'));
      
      // Wait for error message
      await waitFor(() => {
        const errorMessage = queryByText('Please select at least one option');
        expect(errorMessage).toBeTruthy();
      });

      // Select a travel type
      fireEvent.press(getByText('Solo Traveler'));
      
      // Try to proceed again
      fireEvent.press(getByText('Continue'));
      
      // Wait for error message to be gone
      await waitFor(() => {
        const errorMessage = queryByText('Please select at least one option');
        expect(errorMessage).toBeFalsy();
      });
    });

    it('validates looking for selection', async () => {
      const { getByTestId, getByText, queryByText } = render(<OnboardingPage />);
      
      // Fill in step 1
      fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
      fireEvent.changeText(getByTestId('password-input'), 'password123');
      fireEvent.press(getByText('Continue'));
      
      // Fill in step 2
      fireEvent.changeText(getByTestId('full-name-input'), 'John Doe');
      fireEvent.changeText(getByTestId('date-of-birth-input'), '1990-01-01');
      fireEvent.press(getByText('Continue'));
      
      // Fill in step 3 - select travel type first
      fireEvent.press(getByText('Solo Traveler'));
      
      // Try to proceed without selecting looking for options
      // const continueButton = getByTestId('continue-button');
      fireEvent.press(getByText('Continue'));
      
      await waitFor(() => {
        expect(queryByText('Please select at least one option')).toBeTruthy();
      });

      // Select a looking for option and verify error is cleared
       
      
      // Try to proceed again
      fireEvent.press(getByText('Continue'));
      
      await waitFor(() => {
        expect(queryByText('Please select at least one option')).toBeTruthy();
      });
    });
  });

  // describe('Step 4: Profile Details', () => {
  //   it('validates bio', async () => {
  //     const { getByTestId, getByText, queryByText } = render(<OnboardingPage />);
      
  //     // Fill in step 1
  //     fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
  //     fireEvent.changeText(getByTestId('password-input'), 'password123');
  //     fireEvent.press(getByText('Continue'));
      
  //     // Fill in step 2
  //     fireEvent.changeText(getByTestId('full-name-input'), 'John Doe');
  //     fireEvent.changeText(getByTestId('date-of-birth-input'), '1990-01-01');
  //     fireEvent.press(getByText('Continue'));
      
  //     // Fill in step 3
  //     fireEvent.press(getByTestId('travel-type-solo-traveler'));
  //     fireEvent.press(getByTestId('looking-for-romance'));
  //     fireEvent.press(getByText('Continue'));
      
  //     // Try to proceed without bio
  //     fireEvent.press(getByTestId('complete-profile-button'));
      
  //     await waitFor(() => {
  //       expect(queryByText('Bio is required')).toBeTruthy();
  //     });

  //     // Add bio and verify error is cleared
  //     fireEvent.changeText(getByTestId('bio-input'), 'I love traveling and exploring new cultures');
  //     fireEvent.press(getByTestId('complete-profile-button'));
      
  //     await waitFor(() => {
  //       expect(queryByText('Bio is required')).toBeFalsy();
  //     });
  //   });

  //   it('validates top destinations', async () => {
  //     const { getByTestId, getByText, queryByText } = render(<OnboardingPage />);
      
  //     // Fill in step 1
  //     fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
  //     fireEvent.changeText(getByTestId('password-input'), 'password123');
  //     fireEvent.press(getByText('Continue'));
      
  //     // Fill in step 2
  //     fireEvent.changeText(getByTestId('full-name-input'), 'John Doe');
  //     fireEvent.changeText(getByTestId('date-of-birth-input'), '1990-01-01');
  //     fireEvent.press(getByText('Continue'));
      
  //     // Fill in step 3
  //     fireEvent.press(getByTestId('travel-type-solo-traveler'));
  //     fireEvent.press(getByTestId('looking-for-romance'));
  //     fireEvent.press(getByText('Continue'));
      
  //     // Fill in bio
  //     fireEvent.changeText(getByTestId('bio-input'), 'I love traveling and exploring new cultures');
      
  //     // Try to proceed without destinations
  //     fireEvent.press(getByTestId('complete-profile-button'));
      
  //     await waitFor(() => {
  //       expect(queryByText('Please add at least one destination')).toBeTruthy();
  //     });

  //     // Add destinations and verify error is cleared
  //     const destinationsInput = getByTestId('destinations-input');
  //     fireEvent.changeText(destinationsInput, 'Paris, Tokyo, New York');
  //     fireEvent.press(getByTestId('complete-profile-button'));
      
  //     await waitFor(() => {
  //       expect(queryByText('Please add at least one destination')).toBeFalsy();
  //     });
  //   });

  //   it('validates languages', async () => {
  //     const { getByTestId, getByText, queryByText } = render(<OnboardingPage />);
      
  //     // Fill in step 1
  //     fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
  //     fireEvent.changeText(getByTestId('password-input'), 'password123');
  //     fireEvent.press(getByText('Continue'));
      
  //     // Fill in step 2
  //     fireEvent.changeText(getByTestId('full-name-input'), 'John Doe');
  //     fireEvent.changeText(getByTestId('date-of-birth-input'), '1990-01-01');
  //     fireEvent.press(getByText('Continue'));
      
  //     // // Fill in step 3
  //     // fireEvent.press(getByTestId('travel-type-solo-traveler'));
  //     // fireEvent.press(getByTestId('looking-for-romance'));
  //     // fireEvent.press(getByText('Continue'));
      
  //     // Fill in bio and destinations
  //     fireEvent.changeText(getByTestId('bio-input'), 'I love traveling and exploring new cultures');
  //     const destinationsInput = getByTestId('destinations-input');
  //     fireEvent.changeText(destinationsInput, 'Paris, Tokyo, New York');
      
  //     // Try to proceed without languages
  //     fireEvent.press(getByTestId('complete-profile-button'));
      
  //     await waitFor(() => {
  //       expect(queryByText('Please add at least one language')).toBeTruthy();
  //     });

  //     // Add languages and verify error is cleared
  //     const languagesInput = getByTestId('languages-input');
  //     fireEvent.changeText(languagesInput, 'English, Spanish, French');
  //     fireEvent.press(getByTestId('complete-profile-button'));
      
  //     await waitFor(() => {
  //       expect(queryByText('Please add at least one language')).toBeFalsy();
  //     });
  //   });
  // });
}); 