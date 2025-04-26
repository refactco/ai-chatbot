# Troubleshooting & FAQ

This document provides solutions to common issues and answers to frequently asked questions.

## Common Issues

### Installation Issues

#### PNPM Installation Fails

**Problem**: Unable to install dependencies with PNPM.

**Solution**:
1. Ensure you have the correct PNPM version (9.12.3 or higher):
   ```bash
   npm install -g pnpm@9.12.3
   ```
2. Clear PNPM cache:
   ```bash
   pnpm store prune
   ```
3. Try again with verbose logging:
   ```bash
   pnpm install --verbose
   ```

#### Node.js Version Issues

**Problem**: Errors related to Node.js version compatibility.

**Solution**:
1. Ensure you have Node.js v18.0.0 or higher:
   ```bash
   node --version
   ```
2. Use NVM to install the correct version:
   ```bash
   nvm install 18
   nvm use 18
   ```

### Database Issues

#### Connection Errors

**Problem**: Unable to connect to the database.

**Solution**:
1. Ensure PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Ubuntu
   sudo service postgresql status
   ```
2. Verify your connection string in `.env.local`:
   ```
   POSTGRES_URL=postgresql://username:password@localhost:5432/ai_chatbot
   ```
3. Check database exists:
   ```bash
   psql -l
   ```
4. Create database if needed:
   ```bash
   createdb ai_chatbot
   ```

#### Migration Errors

**Problem**: Database migration fails.

**Solution**:
1. Check migration logs:
   ```bash
   pnpm db:migrate --verbose
   ```
2. Reset the database and try again:
   ```bash
   dropdb ai_chatbot
   createdb ai_chatbot
   pnpm db:migrate
   ```
3. Check for conflicting migrations and resolve manually if needed.

### Authentication Issues

#### Login Failures

**Problem**: Unable to log in to the application.

**Solution**:
1. Ensure you've set up the required environment variables:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   ```
2. Check database connectivity for session storage
3. Clear browser cookies and try again
4. For local development, try registering a new test account

#### Session Not Persisting

**Problem**: Session is lost after page refresh.

**Solution**:
1. Ensure `NEXTAUTH_URL` is set correctly
2. Check for cookie storage issues in your browser
3. Verify session data is being saved in the database

### AI Provider Issues

#### API Key Issues

**Problem**: AI provider integration not working.

**Solution**:
1. Verify your API key is correct and not expired
2. Ensure the API key is set in `.env.local`:
   ```env
   OPENAI_API_KEY=your-openai-api-key
   ```
3. Check the provider's service status
4. Check for rate limiting or quota issues

#### Response Streaming Issues

**Problem**: AI responses not streaming correctly.

**Solution**:
1. Ensure you're using a supported browser
2. Check that the AI provider supports streaming
3. Verify the correct streaming implementation:
   ```typescript
   // Check that your streaming implementation is similar to this
   const stream = await openai.chat.completions.create({
     model: "gpt-4",
     messages: messages,
     stream: true,
   });
   ```

### UI/UX Issues

#### Responsive Design Issues

**Problem**: UI doesn't display correctly on certain devices.

**Solution**:
1. Check browser compatibility
2. Verify the viewport meta tag is present in HTML head
3. Test with different screen sizes using browser developer tools
4. Check for CSS conflicts or specificity issues

#### Performance Issues

**Problem**: UI is slow or unresponsive.

**Solution**:
1. Check for memory leaks in React components
2. Verify large data sets are properly paginated
3. Ensure proper use of React's useMemo and useCallback hooks
4. Implement virtualization for long lists

### Deployment Issues

#### Vercel Deployment Failures

**Problem**: Unable to deploy to Vercel.

**Solution**:
1. Check build logs for specific errors
2. Ensure all environment variables are set in Vercel project settings
3. Verify your project structure follows Next.js conventions
4. Check for unsupported dependencies or API usage

#### Database Connection Issues in Production

**Problem**: Application can't connect to the database in production.

**Solution**:
1. Verify database connection string is correct in Vercel environment variables
2. Ensure database server allows connections from Vercel's IP range
3. Check if you're using the right connection pool settings
4. Verify SSL requirements for database connections

## FAQ

### General Questions

#### How do I add a new AI model?

To add a new AI model:

1. Add the model configuration in `/lib/ai/models.ts`:
   ```typescript
   export const models = [
     // Add your new model here
     {
       id: 'new-model',
       name: 'New Model',
       description: 'Description of the new model',
       provider: 'provider-id',
     },
     // ...existing models
   ];
   ```

2. Update the provider configuration in `/lib/ai/providers.ts` if needed.

#### How do I customize the chat interface?

The chat interface can be customized by:

1. Modifying the components in `/components/chat.tsx` and related files
2. Updating the UI theme in Tailwind configuration
3. Adding or modifying CSS variables in `/app/globals.css`

#### How do I add a new feature?

To add a new feature:

1. Create a new branch for the feature
2. Implement the feature following the project's coding standards
3. Add tests for the new feature
4. Update documentation
5. Submit a pull request

### Database Questions

#### How do I add a new database table?

To add a new database table:

1. Define the table schema in `/lib/db/schema/`:
   ```typescript
   import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
   
   export const newTable = pgTable('new_table', {
     id: uuid('id').primaryKey().defaultRandom(),
     name: text('name').notNull(),
     createdAt: timestamp('created_at').defaultNow(),
     // Add more columns as needed
   });
   ```

2. Create a migration:
   ```bash
   pnpm db:generate
   ```

3. Apply the migration:
   ```bash
   pnpm db:migrate
   ```

#### How do I query data from the database?

Example of querying data:

```typescript
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { users } from '@/lib/db/schema';

// Get a user by email
const user = await db.query.users.findFirst({
  where: eq(users.email, 'user@example.com'),
});
```

### Authentication Questions

#### How do I change the authentication provider?

To change the authentication provider:

1. Update the Next Auth configuration in `/app/(auth)/auth.config.ts`
2. Add the new provider's required environment variables
3. Update the UI components if needed

#### How do I implement role-based access control?

To implement role-based access control:

1. Add a role field to the users table
2. Update authentication logic to include role information in sessions
3. Create middleware to check roles for protected routes

### AI Integration Questions

#### How do I change the system prompt?

To change the system prompt:

1. Update the prompt templates in `/lib/ai/prompts.ts`:
   ```typescript
   export const defaultSystemPrompt = `You are an AI assistant that is helpful, harmless, and honest.
   // Your new system prompt here
   `;
   ```

#### How do I implement a custom AI tool?

To implement a custom AI tool:

1. Define the tool in `/lib/ai/tools/`:
   ```typescript
   export const customTool = {
     name: 'custom_tool',
     description: 'Description of what the tool does',
     parameters: {
       type: 'object',
       properties: {
         // Define your parameters here
       },
       required: ['param1'],
     },
   };
   ```

2. Implement the tool handler function
3. Register the tool in the appropriate provider configuration

### Development Questions

#### How do I run tests for a specific component?

To run tests for a specific component:

```bash
pnpm exec playwright test tests/component-name.spec.ts
```

#### How do I debug server-side code?

To debug server-side code:

1. Add `console.log()` statements for basic debugging
2. Use the Node.js inspector with the `--inspect` flag:
   ```bash
   NODE_OPTIONS='--inspect' pnpm dev
   ```
3. Connect to the debugger using Chrome DevTools or VS Code

#### How do I profile performance?

To profile performance:

1. Use the React DevTools Profiler
2. Use the Performance tab in Chrome DevTools
3. Add performance monitoring with `console.time()` and `console.timeEnd()` 