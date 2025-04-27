'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Chat } from '@/components/chat';
import { DataStreamHandler } from '@/components/data-stream-handler';
import type { Message } from '@/lib/schema';
import type { UIMessage } from '@/lib/ai/types';
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
  const params = useParams();
  const id = params.id as string;

  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch chat and messages
        const chatData = await apiService.chat.getChatById(id);
        setChat(chatData.chat);
        setMessages(chatData.messages);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  function convertToUIMessages(messages: Array<Message>): Array<UIMessage> {
    return messages.map((message) => ({
      id: message.id,
      role: message.role as UIMessage['role'],
      content: message.content,
      createdAt: new Date(message.createdAt),
    }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-full">
        Chat not found
      </div>
    );
  }

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
