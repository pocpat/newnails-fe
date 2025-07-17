import React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';

describe('Example Test', () => {
  it('renders text correctly', () => {
    const { getByText } = render(<View><Text>Hello World</Text></View>);
    expect(getByText('Hello World')).toBeTruthy();
  });
});
