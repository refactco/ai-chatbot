# Setup & Deployment

This document provides instructions for setting up the project locally and deploying it to production.

## Local Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **PNPM**: v9.12.3 or higher (package manager)
- **PostgreSQL**: v14 or higher

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
POSTGRES_URL=postgresql://username:password@localhost:5432/ai_chatbot
POSTGRES_URL_NON_POOLING=postgresql://username:password@localhost:5432/ai_chatbot

# Next Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-at-least-32-chars-long

# AI Provider (at least one is required)
OPENAI_API_KEY=your-openai-api-key
# ANTHROPIC_API_KEY=your-anthropic-api-key

# Blob Storage (optional)
# BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
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

3. **Set up the database**:

```bash
# Create the database
createdb ai_chatbot

# Run migrations
pnpm db:migrate
```

4. **Start the development server**:

```bash
pnpm dev
```

5. **Access the application**:

Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

### Local PostgreSQL Setup

1. **Install PostgreSQL** (if not already installed):

- macOS: `brew install postgresql`
- Ubuntu: `sudo apt install postgresql`
- Windows: Download from [postgresql.org](https://www.postgresql.org/download/windows/)

2. **Create a database**:

```bash
createdb ai_chatbot
```

3. **Run database migrations**:

```bash
pnpm db:migrate
```

### Database Schema Management

The application uses Drizzle ORM for database schema management:

- **Generate migrations**:

```bash
pnpm db:generate
```

- **Apply migrations**:

```bash
pnpm db:migrate
```

- **View database in Studio UI**:

```bash
pnpm db:studio
```

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

5. **Set up PostgreSQL database**:

You can use Vercel Postgres by adding it as an integration in your Vercel project.

6. **Deploy with production settings**:

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

1. **Database connection issues**:
   - Ensure PostgreSQL is running
   - Check your connection string in the environment variables
   - Verify database user has correct permissions

2. **Authentication errors**:
   - Ensure `NEXTAUTH_SECRET` is set
   - Check that `NEXTAUTH_URL` matches your application URL

3. **AI provider issues**:
   - Verify API keys are correct
   - Check API key permissions and quotas

### Getting Help

If you encounter issues:

1. Check the [GitHub repository issues](https://github.com/yourusername/ai-chatbot/issues)
2. Review the application logs
3. Consult the Next.js and Drizzle ORM documentation

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

3. **Apply migrations**:

```bash
pnpm db:migrate
```

4. **Restart the server**:

```bash
pnpm dev
```

### Backups

For database backups:

```bash
# Create a backup
pg_dump ai_chatbot > backup.sql

# Restore from backup
psql ai_chatbot < backup.sql
```

## Monitoring

For production deployments, consider setting up:

- **Error tracking**: Sentry, LogRocket
- **Performance monitoring**: Vercel Analytics
- **User analytics**: Google Analytics, Plausible

## Scaling

For high-traffic deployments:

- Use a managed PostgreSQL service (AWS RDS, GCP Cloud SQL)
- Set up a caching layer (Redis, Vercel Edge Cache)
- Deploy to multiple regions using Vercel's global deployment 