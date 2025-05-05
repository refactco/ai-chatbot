/**
 * Chat Stream API Route
 *
 * This file now acts as a proxy for the real chat API stream endpoint.
 * It forwards requests to the external API and streams the response back.
 */

import { NextRequest } from 'next/server';

// Real API configuration
const REAL_API_BASE_URL = 'http://localhost:3333';
const REAL_API_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVlMGZhMDk1LWQyNjctNGFlYy05NjMxLTJiMzRhODVjNzM2MyIsImVtYWlsIjoiZGV2QHJlZmFjdC5jbyIsImV4cCI6NDg5OTU5OTk4MywiaWF0IjoxNzQ1OTk5OTgzfQ.0pDb3MuRpaO-9N8C92ugzDmsq5pnMxL78c1Wz77hpJ4';

/**
 * GET handler for the chat stream API
 * Proxies requests to the real API and forwards the response
 */
export async function GET(request: NextRequest) {
  try {
    // Extract the message from the query parameters
    const { searchParams } = new URL(request.url);
    const message = searchParams.get('message');

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Construct the real API URL
    const apiUrl = `${REAL_API_BASE_URL}/api/chat/stream?message=${encodeURIComponent(message)}&token=${REAL_API_TOKEN}`;

    console.log('Proxying request to real API:', apiUrl);

    // Forward the request to the real API
    const apiResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/event-stream',
      },
    });

    // Check if the response is successful
    if (!apiResponse.ok) {
      console.error('API error:', apiResponse.status, apiResponse.statusText);
      return new Response(
        JSON.stringify({
          error: 'Failed to get response from API',
          status: apiResponse.status,
          statusText: apiResponse.statusText,
        }),
        {
          status: apiResponse.status,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    // Return the streaming response with appropriate headers
    return new Response(apiResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Stream API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to stream chat response' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
