/**
 * Chat Detail Page Component
 *
 * This component handles displaying an individual chat session based on its ID.
 * Features:
 * - Fetches chat and message data for the specified chat ID
 * - Displays loading state while fetching data
 * - Shows error message if chat is not found
 * - Renders the Chat component with the fetched messages
 * - Initializes a data stream handler for real-time updates
 *
 * The component uses the API service to retrieve chat data and supports error handling.
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Chat } from '@/components/chat';
import { DataStreamHandler } from '@/components/data-stream-handler';
import type { Message } from '@/lib/schema';
import type { UIMessage } from '@/lib/api/types';
import { apiService } from '@/lib/services/api-service';

// Mock user session for authentication bypass
// Note: This will be replaced with proper Google OAuth later
const mockSession = {
  user: {
    id: 'admin',
    email: 'admin@admin.com',
    name: 'Admin',
  },
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days from now
};

export default function Page() {
  // Extract chat ID from URL parameters
  const params = useParams();
  if (!params?.id) {
    return (
      <div className="flex items-center justify-center h-full">
        Invalid chat ID
      </div>
    );
  }
  const id = params.id as string;

  // State for storing chat data, messages, and loading status
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch chat data when component mounts or ID changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch chat and messages from API
        const chatData = await apiService.chat.getChatById(id);
        setChat(chatData.chat);
        setMessages(chatData.messages);
      } catch (error) {
        console.error('Error fetching chat data:', error);
        setChat(null); // Explicitly set chat to null on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Convert API message format to UI message format
  function convertToUIMessages(messages: Array<Message>): Array<UIMessage> {
    return messages.map((message) => ({
      id: message.id,
      role: message.role as UIMessage['role'],
      content: message.content,
      createdAt: new Date(message.createdAt),
    }));
  }

  // Display loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  // Display error if chat not found
  if (!chat) {
    return (
      <div className="flex items-center justify-center h-full">
        Chat not found
      </div>
    );
  }

  // Render chat with messages and data stream handler
  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={convertToUIMessages(messages)}
        isReadonly={false} // Always set readonly to false
      />
      <DataStreamHandler id={id} />
    </>
  );
}
