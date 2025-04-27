# Setup & Deployment

This document provides instructions for setting up the project locally and deploying it to production.

## Local Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **PNPM**: v9.12.3 or higher (package manager)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Next Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-at-least-32-chars-long

# AI Provider (at least one is required)
OPENAI_API_KEY=your-openai-api-key
# ANTHROPIC_API_KEY=your-anthropic-api-key

# Mock API Configuration (optional)
# MOCK_API_DELAY=500 # milliseconds
```

### Installation Steps

1. **Clone the repository**:

```bash
git clone https://github.com/yourusername/ai-chatbot.git
cd ai-chatbot
```

2. **Install dependencies**:

```bash
pnpm install
```

3. **Start the development server**:

```bash
pnpm dev
```

4. **Access the application**:

Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Mock API System

The application uses a mock API system for frontend development instead of a database.

### Mock API Features

- **Local Storage Persistence**: User data, chats, and messages are stored in the browser's localStorage
- **Simulated API Delays**: Configurable delays to simulate network latency
- **Type-Safe API Interface**: Matches expected backend API responses

### Working with Mock Data

- All data is stored locally in the browser
- Clearing browser cache/localStorage will reset all mock data
- The mock system automatically creates initial sample data on first run

## Configuration Options

### Feature Flags

You can enable or disable features by setting environment variables:

```env
# Enable file uploads
ENABLE_UPLOADS=true

# Enable image generation
ENABLE_IMAGE_GENERATION=true

# Enable weather tools
ENABLE_WEATHER_TOOLS=true
```

### AI Providers

The application supports multiple AI providers:

- **OpenAI**:
```env
OPENAI_API_KEY=your-openai-api-key
```

- **Anthropic**:
```env
ANTHROPIC_API_KEY=your-anthropic-api-key
```

- **Azure OpenAI**:
```env
AZURE_OPENAI_API_KEY=your-azure-openai-api-key
AZURE_OPENAI_ENDPOINT=your-azure-openai-endpoint
```

## Production Deployment

### Vercel Deployment

The easiest way to deploy the application is using Vercel:

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Install Vercel CLI**:

```bash
npm install -g vercel
```

3. **Deploy to Vercel**:

```bash
vercel
```

4. **Set up environment variables**:

In the Vercel dashboard, navigate to your project's settings and add the environment variables from your `.env.local` file.

5. **Deploy with production settings**:

```bash
vercel --prod
```

### Docker Deployment

You can also deploy using Docker:

1. **Build Docker image**:

```bash
docker build -t ai-chatbot .
```

2. **Run Docker container**:

```bash
docker run -p 3000:3000 --env-file .env.production ai-chatbot
```

## Troubleshooting

### Common Issues

1. **Authentication errors**:
   - Ensure `NEXTAUTH_SECRET` is set
   - Check that `NEXTAUTH_URL` matches your application URL

2. **AI provider issues**:
   - Verify API keys are correct
   - Check API key permissions and quotas
   
3. **Mock API issues**:
   - If data appears corrupted, clear localStorage in your browser
   - Check browser console for any mock API errors
   - Verify mock API initialization in the console logs

### Getting Help

If you encounter issues:

1. Check the [GitHub repository issues](https://github.com/yourusername/ai-chatbot/issues)
2. Review the application logs
3. Consult the Next.js documentation

## Maintenance

### Updates

To update the application:

1. **Pull latest changes**:

```bash
git pull origin main
```

2. **Install dependencies**:

```bash
pnpm install
``` 