// Helper function to generate a dummy password for testing
export const generateDummyPassword = () => {
  return `dummy-password-${Math.random().toString(36).substring(2, 15)}`;
};

export const isProductionEnvironment = process.env.NODE_ENV === 'production';

export const isTestEnvironment = Boolean(
  process.env.PLAYWRIGHT_TEST_BASE_URL ||
    process.env.PLAYWRIGHT ||
    process.env.CI_PLAYWRIGHT,
);

export const DUMMY_PASSWORD = generateDummyPassword();
