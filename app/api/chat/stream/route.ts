/**
 * Chat Stream Proxy API Route
 * 
 * This file implements a proxy to the backend chat API,
 * handling CORS issues and forwarding requests to the actual backend.
 */

import { NextRequest, NextResponse } from 'next/server';

// Backend API configuration - same as in api-service.ts
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://159.223.110.52:3333',
  ENDPOINTS: {
    CHAT_STREAM: '/api/chat/stream',
  }
};

/**
 * This function handles GET requests to /api/chat/stream
 * It forwards the requests to the actual backend API and streams the response back
 */
export async function GET(request: NextRequest) {
  try {
    // Get the message query parameter
    const { searchParams } = new URL(request.url);
    const message = searchParams.get('message');
    
    if (!message) {
      return NextResponse.json({ error: 'Message parameter is required' }, { status: 400 });
    }
    
    // Build the URL for the backend API
    const backendUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHAT_STREAM}?message=${encodeURIComponent(message)}`;
    
    // Forward the request to the backend
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
      },
    });
    
    // Check if the response is OK
    if (!response.ok) {
      return NextResponse.json(
        { error: `Error from backend: ${response.statusText}` }, 
        { status: response.status }
      );
    }
    
    // Create a new ReadableStream that forwards the response from the backend
    const reader = response.body?.getReader();
    const encoder = new TextEncoder();
    
    if (!reader) {
      return NextResponse.json({ error: 'Failed to read response stream' }, { status: 500 });
    }
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              controller.close();
              break;
            }
            
            // Forward the chunk to the client
            controller.enqueue(value);
          }
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      }
    });
    
    // Return the response with the appropriate headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
    
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to backend' }, 
      { status: 500 }
    );
  }
} 