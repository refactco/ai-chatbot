/**
 * Environment Variable Type Declarations
 *
 * This file provides TypeScript type declarations for environment variables
 * used in the application. It ensures proper type checking when accessing
 * environment variables.
 */

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * Flag to determine whether to use the real API or mock data
     */
    NEXT_PUBLIC_USE_REAL_API: string;

    /**
     * Base URL for the real chat API
     */
    NEXT_PUBLIC_API_BASE_URL: string;

    /**
     * JWT token for authentication with the real API
     */
    NEXT_PUBLIC_API_TOKEN: string;

    /**
     * Flag to enable/disable API mocking with MSW
     */
    NEXT_PUBLIC_API_MOCKING: string;
  }
}
