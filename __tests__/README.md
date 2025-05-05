# Testing Guide

This document provides an overview of the testing setup for the AI Chatbot project.

## Test Structure

- `__tests__/`: Root directory for all tests
  - `components/`: Tests for React components
  - `utils/`: Tests for utility functions
  - `test-utils.tsx`: Common testing utilities

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Test Structure

Tests are organized by type:

1. **Component Tests**: Test React components rendering and interactions
2. **Utility Tests**: Test pure functions and utilities
3. **Integration Tests**: Test combinations of components working together

## Testing Tools

- **Jest**: Test runner and assertion library
- **React Testing Library**: DOM testing utilities for React components
- **jest-environment-jsdom**: DOM environment for running tests

## Writing Tests

### Components

```tsx
import { render } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Utilities

```tsx
import { myUtilFunction } from '../lib/utils';

describe('myUtilFunction', () => {
  test('returns expected output', () => {
    expect(myUtilFunction('input')).toBe('expected output');
  });
});
```

### Using Mocks

```tsx
// Mocking a function
const mockFn = jest.fn().mockReturnValue('mocked value');

// Mocking a module
jest.mock('../path/to/module', () => ({
  functionName: jest.fn().mockReturnValue('mocked value'),
}));
```

## Best Practices

1. Test behavior, not implementation details
2. Write focused tests that test one thing at a time
3. Use descriptive test names in the format "it should..."
4. Use `data-testid` attributes for elements that don't have clear text content
5. Write tests that are resilient to implementation changes

## Examples

Check the existing tests for examples:

- `__tests__/components/Button.test.tsx`: Simple component testing
- `__tests__/utils/formatters.test.ts`: Utility function testing with mocks
