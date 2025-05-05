/**
 * Button Component Tests
 *
 * This file contains tests for a basic Button component.
 * It demonstrates simple rendering and interaction tests.
 *
 * Features:
 * - Basic rendering test
 * - Click event test
 * - Disabled state test
 */

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import React from 'react';

// A simple Button component to test
const Button = ({
  onClick,
  disabled = false,
  children,
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded ${disabled ? 'bg-gray-300' : 'bg-blue-500'}`}
      data-testid="test-button"
    >
      {children}
    </button>
  );
};

describe('Button Component', () => {
  test('renders correctly with text', () => {
    const { getByText } = render(<Button>Click Me</Button>);

    const buttonElement = getByText('Click Me');
    expect(buttonElement).toBeInTheDocument();
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    const { getByTestId } = render(
      <Button onClick={handleClick}>Click Me</Button>,
    );

    const buttonElement = getByTestId('test-button');
    buttonElement.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('can be disabled', () => {
    const { getByText } = render(<Button disabled>Click Me</Button>);

    const buttonElement = getByText('Click Me');
    expect(buttonElement).toBeDisabled();
  });
});
