# Testing

This document outlines the testing strategy, tools, and processes used in the application.

## Testing Strategy

The application employs a comprehensive testing strategy:

1. **End-to-End Tests**: Test complete user flows using Playwright
2. **Component Tests**: Test individual UI components
3. **API Tests**: Test API endpoints and server functions
4. **Unit Tests**: Test individual functions and utilities

## Testing Tools

The application uses the following testing tools:

- **Playwright**: End-to-end testing
- **MSW (Mock Service Worker)**: API mocking
- **TypeScript**: Type checking

## Running Tests

### End-to-End Tests

To run end-to-end tests with Playwright:

```bash
# Run all tests
pnpm test

# Run tests in development mode (with UI)
pnpm exec playwright test --ui

# Run a specific test file
pnpm exec playwright test tests/example.spec.ts
```

### Test Configuration

The Playwright configuration is in `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

## Test Structure

### End-to-End Tests

End-to-end tests are located in the `/tests` directory. They test complete user flows:

```typescript
// Example E2E test for login
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');
  
  // Fill login form
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Verify redirect to chat page
  await expect(page).toHaveURL('/');
  
  // Verify user is logged in
  await expect(page.locator('.user-avatar')).toBeVisible();
});
```

### API Mocking

The application uses MSW to mock API responses during tests:

```typescript
// Example MSW handler
import { rest } from 'msw';

export const handlers = [
  rest.post('/api/chat', (req, res, ctx) => {
    return res(
      ctx.json({
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there! How can I help you today?' }
        ]
      })
    );
  }),
];
```

## Testing Environments

### Local Testing Environment

For local testing:

1. Ensure the database is running
2. Set up test environment variables in `.env.test`
3. Run tests with `pnpm test`

### CI/CD Testing Environment

The application is configured for CI/CD testing using GitHub Actions:

```yaml
# Example GitHub Actions workflow
name: Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm install -g pnpm
          pnpm install
      
      - name: Run migrations
        run: pnpm db:migrate
        env:
          POSTGRES_URL: postgresql://postgres:postgres@localhost:5432/test_db
          
      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps
      
      - name: Run tests
        run: pnpm test
        env:
          POSTGRES_URL: postgresql://postgres:postgres@localhost:5432/test_db
          NEXTAUTH_SECRET: test_secret
          NEXTAUTH_URL: http://localhost:3000
          OPENAI_API_KEY: sk-test-key
```

## Test Coverage

The application aims for comprehensive test coverage:

- Critical user flows (login, chat, artifact creation)
- Edge cases and error handling
- Mobile and desktop responsiveness
- Accessibility compliance

## Test Mocks

### Mock Data

Test mock data is located in the `/mocks` directory:

- Mock users
- Mock chat conversations
- Mock AI responses

### Mock Services

The application mocks external services during tests:

- AI providers
- Authentication
- Blob storage

## Testing Best Practices

### Writing Good Tests

1. **Isolation**: Tests should be independent of each other
2. **Readability**: Tests should be easy to understand
3. **Maintenance**: Tests should be easy to maintain
4. **Reliability**: Tests should be reliable and not flaky

### Test Naming Conventions

Tests follow a clear naming convention:

```
[feature].[scenario].[expected result]
```

Example: `auth.login.successful_login.spec.ts`

## Debugging Tests

### Debugging Playwright Tests

To debug Playwright tests:

```bash
# Run with UI
pnpm exec playwright test --ui

# Run with debugging
pnpm exec playwright test --debug

# Save trace for failed tests
pnpm exec playwright test --trace on
```

### Analyzing Test Results

Playwright generates HTML reports for test runs:

```bash
# Open the latest HTML report
pnpm exec playwright show-report
```

## Common Test Scenarios

### Authentication Testing

- User registration
- User login
- Password validation
- Session management
- Authorization checks

### Chat Interface Testing

- Sending messages
- Receiving AI responses
- Message rendering
- File uploads
- Chat history

### Artifact Testing

- Creating artifacts
- Viewing artifacts
- Editing artifacts
- Deleting artifacts

### Responsive Design Testing

- Mobile layout
- Desktop layout
- Tablet layout
- Responsive behavior

## Accessibility Testing

The application includes accessibility testing:

```typescript
// Example accessibility test
import { test, expect } from '@playwright/test';

test('page passes accessibility tests', async ({ page }) => {
  await page.goto('/');
  
  // Run axe accessibility tests
  const accessibilityScanResults = await page.evaluate(() => {
    return window.axe.run();
  });
  
  // Verify no critical accessibility violations
  expect(accessibilityScanResults.violations).toEqual([]);
});
``` 