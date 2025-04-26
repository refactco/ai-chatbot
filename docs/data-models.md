# Data Models

This document outlines the database schema, data models, and relationships in the application.

## Database Technology

The application uses:

- **PostgreSQL**: Primary database (via Vercel Postgres)
- **Drizzle ORM**: Object-Relational Mapping layer
- **Migrations**: Managed through Drizzle Kit

## Schema Overview

Let's explore the core data models and their relationships:

## User Model

**Table**: `users`

Stores user account information:

| Field           | Type      | Description                      |
|-----------------|-----------|----------------------------------|
| id              | UUID      | Primary key                      |
| name            | Text      | User's display name              |
| email           | Text      | User's email address (unique)    |
| emailVerified   | Timestamp | When email was verified          |
| image           | Text      | User's profile image URL         |
| password        | Text      | Hashed password                  |
| createdAt       | Timestamp | Account creation timestamp       |
| updatedAt       | Timestamp | Account update timestamp         |

## Session Model

**Table**: `sessions`

Stores user session data:

| Field         | Type      | Description                   |
|---------------|-----------|-------------------------------|
| id            | UUID      | Primary key                   |
| userId        | UUID      | Foreign key to users          |
| expiresAt     | Timestamp | Session expiration timestamp  |
| sessionToken  | Text      | Unique session token          |

## Chat Model

**Table**: `chats`

Stores chat conversations:

| Field         | Type      | Description                   |
|---------------|-----------|-------------------------------|
| id            | UUID      | Primary key                   |
| userId        | UUID      | Foreign key to users          |
| title         | Text      | Chat title                    |
| createdAt     | Timestamp | Creation timestamp            |
| updatedAt     | Timestamp | Update timestamp              |
| path          | Text      | URL path to the chat          |
| messages      | JSON      | Chat messages (or relation)   |
| sharePath     | Text      | Path for shared chats         |
| isShared      | Boolean   | Whether chat is shared        |

## Message Model

**Table**: `messages`

Stores individual chat messages:

| Field         | Type      | Description                   |
|---------------|-----------|-------------------------------|
| id            | UUID      | Primary key                   |
| chatId        | UUID      | Foreign key to chats          |
| content       | Text      | Message content               |
| role          | Text      | Message role (user/assistant) |
| createdAt     | Timestamp | Creation timestamp            |
| updatedAt     | Timestamp | Update timestamp              |
| artifacts     | JSON      | Associated artifacts (or relation) |
| attachments   | JSON      | Message attachments           |

## Artifact Model

**Table**: `artifacts`

Stores user-generated artifacts:

| Field         | Type      | Description                   |
|---------------|-----------|-------------------------------|
| id            | UUID      | Primary key                   |
| userId        | UUID      | Foreign key to users          |
| messageId     | UUID      | Foreign key to messages       |
| title         | Text      | Artifact title                |
| type          | Text      | Artifact type                 |
| content       | Text      | Artifact content              |
| url           | Text      | URL to stored artifact        |
| createdAt     | Timestamp | Creation timestamp            |
| updatedAt     | Timestamp | Update timestamp              |

## Attachment Model

**Table**: `attachments`

Stores files attached to messages:

| Field         | Type      | Description                   |
|---------------|-----------|-------------------------------|
| id            | UUID      | Primary key                   |
| messageId     | UUID      | Foreign key to messages       |
| type          | Text      | Attachment type               |
| url           | Text      | URL to stored file            |
| name          | Text      | Original filename             |
| size          | Integer   | File size in bytes            |
| createdAt     | Timestamp | Creation timestamp            |

## Relationship Diagram

```
Users
  ├── has many → Sessions
  ├── has many → Chats
  └── has many → Artifacts

Chats
  ├── belongs to → Users
  └── has many → Messages

Messages
  ├── belongs to → Chats
  ├── has many → Artifacts
  └── has many → Attachments

Artifacts
  ├── belongs to → Users
  └── belongs to → Messages (optional)

Attachments
  └── belongs to → Messages
```

## Data Access Patterns

The application uses the following data access patterns:

### User Authentication

```typescript
// Find user by email
const user = await db.query.users.findFirst({
  where: eq(users.email, email)
});

// Create session
const session = await db.insert(sessions).values({
  userId: user.id,
  sessionToken: token,
  expiresAt: expiryDate
});
```

### Chat Management

```typescript
// Get user's chats
const userChats = await db.query.chats.findMany({
  where: eq(chats.userId, userId),
  orderBy: [desc(chats.updatedAt)]
});

// Get chat with messages
const chat = await db.query.chats.findFirst({
  where: eq(chats.id, chatId),
  with: {
    messages: {
      orderBy: [asc(messages.createdAt)]
    }
  }
});
```

### Message Management

```typescript
// Add message to chat
const newMessage = await db.insert(messages).values({
  chatId: chat.id,
  role: 'user',
  content: messageText
});

// Get messages with attachments
const messagesWithAttachments = await db.query.messages.findMany({
  where: eq(messages.chatId, chatId),
  with: {
    attachments: true
  }
});
```

### Artifact Management

```typescript
// Create artifact
const artifact = await db.insert(artifacts).values({
  userId: user.id,
  messageId: message.id,
  title: artifactTitle,
  type: artifactType,
  content: artifactContent,
  url: artifactUrl
});

// Get user's artifacts
const userArtifacts = await db.query.artifacts.findMany({
  where: eq(artifacts.userId, userId)
});
```

## Data Validation

The application uses Zod for data validation:

```typescript
// User schema
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional()
});

// Chat schema
const chatSchema = z.object({
  title: z.string(),
  messages: z.array(messageSchema)
});

// Message schema
const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  attachments: z.array(attachmentSchema).optional()
});
```

## Migration Strategy

The application uses Drizzle Kit for migrations:

1. Define schema changes in schema files
2. Generate migrations using `drizzle-kit generate`
3. Apply migrations using `db:migrate` script
4. Version control migration files

## Data Security

The application implements several data security measures:

1. **Password Hashing**: User passwords are hashed using bcrypt
2. **Input Sanitization**: User input is sanitized to prevent SQL injection
3. **Access Control**: Data access is controlled through authentication
4. **Data Encryption**: Sensitive data is encrypted at rest
5. **Rate Limiting**: API endpoints are rate limited to prevent abuse 