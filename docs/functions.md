# Functions and Key Modules

This document provides an overview of key functions, utilities, and modules in the application.

## Authentication Functions

### User Registration and Login

**Location**: `/app/(auth)/actions.ts`

```typescript
// Register a new user
export async function register(email: string, password: string, name?: string) {
  // Hash password, validate input, create user in database
}

// Login an existing user
export async function login(email: string, password: string) {
  // Validate credentials, create session, return session token
}

// Logout current user
export async function logout() {
  // Clear session from database and cookies
}
```

### Session Management

**Location**: `/app/(auth)/auth.ts`

```typescript
// Get current session
export async function getSession() {
  // Get session from request, validate token, return session data
}

// Validate session
export async function validateSession(token: string) {
  // Check if session exists and is not expired
}
```

## Chat Functions

### Chat Management

**Location**: `/app/(chat)/actions.ts`

```typescript
// Create a new chat
export async function createChat(userId: string) {
  // Create chat in database, return chat data
}

// Get chat by ID
export async function getChat(chatId: string) {
  // Get chat from database, include messages
}

// Update chat title
export async function updateChatTitle(chatId: string, title: string) {
  // Update chat title in database
}

// Delete chat
export async function deleteChat(chatId: string) {
  // Delete chat and associated messages from database
}
```

### Message Management

```typescript
// Add message to chat
export async function addMessage(chatId: string, content: string, role: string) {
  // Add message to database, return message data
}

// Get messages for chat
export async function getChatMessages(chatId: string) {
  // Get messages from database for specific chat
}
```

## AI Functions

### Model Management

**Location**: `/lib/ai/models.ts`

```typescript
// Get available models
export function getAvailableModels() {
  // Return list of available AI models
}

// Get model by ID
export function getModelById(modelId: string) {
  // Return model configuration
}
```

### Provider Configuration

**Location**: `/lib/ai/providers.ts`

```typescript
// Get provider configuration
export function getProviderConfig(providerId: string) {
  // Return provider-specific configuration
}

// Initialize provider
export function initializeProvider(providerId: string) {
  // Set up connection to provider API
}
```

### Chat Completion

```typescript
// Get chat completion
export async function getChatCompletion(messages: Message[], model: string) {
  // Send messages to AI model, get response
}

// Stream chat completion
export async function streamChatCompletion(messages: Message[], model: string) {
  // Stream response from AI model
}
```

## Database Functions

### Database Connection

**Location**: `/lib/db/index.ts`

```typescript
// Get database connection
export function getDb() {
  // Get or create database connection
}

// Run migration
export async function runMigration() {
  // Run database migrations
}
```

### Database Queries

```typescript
// Generic database query
export async function query<T>(sql: string, params: any[] = []) {
  // Execute SQL query, return results
}

// Transaction
export async function transaction<T>(callback: (tx: any) => Promise<T>) {
  // Execute callback in transaction, return result
}
```

## File Storage Functions

**Location**: `/lib/storage.ts`

```typescript
// Upload file
export async function uploadFile(file: File, userId: string) {
  // Upload file to blob storage, return URL
}

// Get file
export async function getFile(url: string) {
  // Get file from blob storage
}

// Delete file
export async function deleteFile(url: string) {
  // Delete file from blob storage
}
```

## Artifact Functions

**Location**: `/lib/artifacts/index.ts`

```typescript
// Create artifact
export async function createArtifact(
  content: string,
  type: string,
  userId: string,
  messageId?: string
) {
  // Create artifact in database and storage
}

// Get artifact
export async function getArtifact(artifactId: string) {
  // Get artifact from database
}

// Update artifact
export async function updateArtifact(artifactId: string, content: string) {
  // Update artifact in database and storage
}

// Delete artifact
export async function deleteArtifact(artifactId: string) {
  // Delete artifact from database and storage
}
```

## Utility Functions

### Text Processing

**Location**: `/lib/utils.ts`

```typescript
// Format code
export function formatCode(code: string, language: string) {
  // Format code with syntax highlighting
}

// Parse markdown
export function parseMarkdown(markdown: string) {
  // Parse markdown to HTML
}

// Sanitize HTML
export function sanitizeHtml(html: string) {
  // Remove potentially dangerous HTML
}
```

### Date Formatting

```typescript
// Format date
export function formatDate(date: Date, format: string) {
  // Format date according to specified format
}

// Get relative time
export function getRelativeTime(date: Date) {
  // Get time relative to now (e.g., "5 minutes ago")
}
```

### ID Generation

```typescript
// Generate unique ID
export function generateId(prefix?: string) {
  // Generate unique ID with optional prefix
}
```

## React Hooks

### Chat Hooks

**Location**: `/hooks/useChat.ts`

```typescript
// Use chat
export function useChat(chatId: string) {
  // Get chat data, messages, and functions to update
}

// Use chat list
export function useChatList() {
  // Get list of chats and functions to manage
}
```

### Authentication Hooks

**Location**: `/hooks/useAuth.ts`

```typescript
// Use authentication
export function useAuth() {
  // Get current user, session, and authentication functions
}
```

### UI Hooks

```typescript
// Use theme
export function useTheme() {
  // Get current theme and functions to update
}

// Use modal
export function useModal() {
  // Get modal state and functions to show/hide
}

// Use toast
export function useToast() {
  // Get toast functions to show notifications
}
```

## Important Middleware and Helpers

### Authentication Middleware

**Location**: `/middleware.ts`

```typescript
// Authentication middleware
export function authMiddleware(req: NextRequest) {
  // Check for valid session, redirect if needed
}
```

### API Route Handlers

```typescript
// API route handler
export async function apiHandler(req: NextRequest) {
  // Handle API request, validate session, process request
}
```

### Error Handling

```typescript
// Error handler
export function errorHandler(error: Error) {
  // Log error, format error message
}

// API error response
export function apiError(status: number, message: string) {
  // Return formatted API error response
}
```

## State Management Functions

```typescript
// Create chat store
export const useChatStore = create<ChatStore>((set) => ({
  // Chat state and update functions
}));

// Create user store
export const useUserStore = create<UserStore>((set) => ({
  // User state and update functions
}));
``` 