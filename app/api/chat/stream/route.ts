/**
 * Chat Stream API Route
 *
 * This file implements a stream API that can either return mock data or
 * proxy requests to the real API based on environment configuration.
 *
 * Features:
 * - Proxies to real API when NEXT_PUBLIC_USE_REAL_API is true
 * - Falls back to mock data for development without a real backend
 * - Maintains the same event structure for both implementations
 */

import { NextRequest } from 'next/server';

// Check if we should use the real API (from environment variables)
const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === 'true';
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333';

// Mock data from the sample stream (used when real API is disabled)
const mockStreamData = [
  {
    event: 'delta',
    data: {
      role: 'user',
      content:
        'I had a call with Sandbox client, they asked me to add a new feature for their magazine, create the tasks for it',
      id: '0',
    },
  },
  {
    event: 'delta',
    data: {
      role: 'assistant',
      content:
        "You're asking me to create tasks for a new feature for Sandbox's magazine, do they mentioned a specific deadline?",
      id: '1',
    },
  },
  {
    event: 'delta',
    data: {
      role: 'user',
      content: 'They want it for next week',
      id: '2',
    },
  },
  {
    event: 'delta',
    data: {
      role: 'assistant',
      content: "OK, I'm looking for Sandbox project first...",
      id: '3',
    },
  },
  {
    event: 'delta',
    data: {
      role: 'assistant',
      content: "I'm creating these tasks in Sandbox project:",
      tool_calls: {
        type: 'request',
        title: "I'm creating these tasks in Sandbox project:",
        items: [
          {
            name: 'Design UI of new feature',
          },
        ],
      },
      id: '4',
    },
  },
];

export async function GET(request: NextRequest) {
  // Get the message from the query parameters
  const searchParams = request.nextUrl.searchParams;
  const message = searchParams.get('message') || '';
  const token = searchParams.get('token');

  if (USE_REAL_API) {
    // Proxy to the real API
    try {
      console.log(
        'Proxying to real API:',
        `${API_BASE_URL}/api/chat/stream?message=${encodeURIComponent(message)}&token=${token}`,
      );

      // Forward the request to the real API
      const response = await fetch(
        `${API_BASE_URL}/api/chat/stream?message=${encodeURIComponent(message)}&token=${token}`,
        {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
          },
        },
      );

      // If the real API request fails, fall back to mock data
      if (!response.ok) {
        console.error(
          'Error from real API:',
          response.status,
          response.statusText,
        );
        return createMockResponse();
      }

      // Stream the response directly from the real API
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    } catch (error) {
      console.error('Error proxying to real API:', error);
      // Fall back to mock data on error
      return createMockResponse();
    }
  } else {
    // Use the mock implementation
    return createMockResponse();
  }
}

// Helper function to create a mock streaming response
function createMockResponse() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Add a small delay to simulate network latency
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Stream the mock data events
        for (const event of mockStreamData) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          controller.enqueue(
            encoder.encode(
              `event: ${event.event}\ndata: ${JSON.stringify(event.data)}\n\n`,
            ),
          );
        }

        // Send a done event
        controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
