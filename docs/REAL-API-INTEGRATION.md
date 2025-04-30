# API Integration Guide

This document explains how to integrate the chat application with the backend API.

## API Configuration

The application is configured to connect to the backend API at `http://159.223.110.52:3333`. You can customize this by creating a `.env.local` file with the following variable:

```
NEXT_PUBLIC_API_BASE_URL=http://159.223.110.52:3333
```

## API Endpoints

The application uses the following endpoints:

- `GET /api/chat/stream` - Server-Sent Events (SSE) endpoint for streaming chat responses

## Event Types

The backend API uses Server-Sent Events with the following event types:

- `delta` - Contains structured data with different message types:
  - `system_prompt` - System instructions to the AI
  - `user_message` - Echo of the user's input
  - `thinking` - AI's thinking process
  - `selected_tool` - Tools the AI is selecting
  - `tool_called` - When a tool is called by the AI
  - `tool_result` - Results from tool calls
  - `llm_streaming_response` - The actual AI response text
- `end` - Indicates the end of the streaming response

## Implementation Details

The API integration is implemented in `lib/services/api-service.ts`, with the primary functions:

- `sendMessage()` - Handles user message preparation
- `streamResponse()` - Connects to the SSE endpoint and processes events

## Testing the Integration

To test the API integration:

1. Ensure you have the correct API URL in your environment or use the default
2. Start the application with `npm run dev`
3. Try sending a chat message, for example "list of projects" to see the integration in action 