import React from 'react';
import { render } from '@testing-library/react-native';
import ExploreScreen from '../page';

describe('ExploreScreen', () => {
  it('renders the correct text', () => {
    const { getByText } = render(<ExploreScreen />);
    expect(getByText('ExploreScreen')).toBeTruthy();
  });
});


