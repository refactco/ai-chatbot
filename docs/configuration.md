# Configuration

This document outlines the configuration settings and environment variables used in the application.

## Environment Variables

The application uses the following environment variables for configuration:

### Database Configuration

```env
# PostgreSQL Database URL
POSTGRES_URL=postgresql://username:password@host:port/database

# Database connection parameters
POSTGRES_PRISMA_URL=postgresql://username:password@host:port/database?schema=public
POSTGRES_URL_NON_POOLING=postgresql://username:password@host:port/database
POSTGRES_HOST=host
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_DATABASE=database
```

### Authentication Configuration

```env
# Next Auth configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Optional OAuth providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
```

### AI Provider Configuration

```env
# OpenAI API configuration
OPENAI_API_KEY=your-openai-api-key
OPENAI_API_URL=https://api.openai.com/v1

# Anthropic API configuration
ANTHROPIC_API_KEY=your-anthropic-api-key

# Other AI providers
COHERE_API_KEY=your-cohere-api-key
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
AZURE_OPENAI_ENDPOINT=your-azure-openai-endpoint
```

### Storage Configuration

```env
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your-blob-read-write-token
```

### Application Configuration

```env
# Basic application configuration
NODE_ENV=development
APP_URL=http://localhost:3000

# Feature flags
ENABLE_UPLOADS=true
ENABLE_IMAGE_GENERATION=true
ENABLE_WEATHER_TOOLS=true
```

## Configuration Files

### Next.js Configuration (`next.config.ts`)

The main Next.js configuration file defines:

- Environment variable configuration
- Image optimization settings
- Webpack configuration
- Output export settings
- Redirects and rewrites
- API and page routing configuration

```typescript
const nextConfig = {
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Custom webpack configuration
    return config;
  },
  
  // Environment variables to expose to the browser
  env: {
    APP_URL: process.env.APP_URL,
    ENABLE_UPLOADS: process.env.ENABLE_UPLOADS,
  },
  
  // Image optimization
  images: {
    domains: ['localhost', 'vercel.com'],
  },
  
  // Experimental features
  experimental: {
    serverActions: true,
  },
};
```

### TypeScript Configuration (`tsconfig.json`)

Defines TypeScript compiler options:

- Target ECMAScript version
- Module system
- Type checking options
- Path aliases

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Tailwind CSS Configuration (`tailwind.config.ts`)

Configures Tailwind CSS:

- Custom colors
- Fonts
- Spacing
- Animations
- Plugins

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
      },
      fontFamily: {
        // Custom fonts
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
};

export default config;
```

### ESLint Configuration (`.eslintrc.json`)

Configures code linting:

- Rules
- Plugins
- Extensions

```json
{
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "plugins": [
    "tailwindcss"
  ],
  "rules": {
    // Custom rules
  }
}
```

### Drizzle ORM Configuration (`drizzle.config.ts`)

Configures database ORM:

- Database connection
- Schema location
- Migration settings

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema/*',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL!,
  },
} satisfies Config;
```

## Runtime Configuration

### Application Constants (`lib/constants.ts`)

Defines application-wide constants:

```typescript
// Application information
export const APP_NAME = 'AI Chatbot';
export const APP_VERSION = '3.0.6';

// Feature flags
export const FEATURES = {
  UPLOADS: process.env.ENABLE_UPLOADS === 'true',
  IMAGE_GENERATION: process.env.ENABLE_IMAGE_GENERATION === 'true',
  WEATHER_TOOLS: process.env.ENABLE_WEATHER_TOOLS === 'true',
};

// API endpoints
export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  AUTH: '/api/auth',
  FILES: '/api/files',
  ARTIFACTS: '/api/artifacts',
};

// Rate limiting
export const RATE_LIMITS = {
  MAX_REQUESTS_PER_MINUTE: 60,
  MAX_UPLOADS_PER_HOUR: 20,
};
```

## Configuration Management

The application manages configuration in several ways:

1. **Environment Variables**: For sensitive information and deployment-specific settings
2. **Configuration Files**: For static configuration that varies by environment
3. **Database Configuration**: For user preferences and settings
4. **Client-Side State**: For user interface preferences

## Configuration Security

The application implements several security measures for configuration:

1. **Environment Variables**: Sensitive information is stored in environment variables
2. **Build-Time vs. Runtime**: Sensitive information is only used at build time or server-side
3. **Validation**: Environment variables are validated at startup
4. **Defaults**: Sensible defaults are provided for missing configuration

## Customizing Configuration

To customize the application configuration:

1. Create a `.env.local` file with your environment variables
2. Modify the appropriate configuration files
3. Restart the development server or rebuild the application

Example `.env.local` file:

```env
# Database
POSTGRES_URL=postgresql://username:password@localhost:5432/mychatbot

# Authentication
NEXTAUTH_SECRET=my-custom-secret-key
NEXTAUTH_URL=http://localhost:3000

# AI Provider
OPENAI_API_KEY=your-openai-api-key
``` 