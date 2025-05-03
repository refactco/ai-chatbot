/**
 * Default Chat Page Component
 *
 * This is the main entry point for the chat application.
 * It renders a Chat component with a static chat ID for demonstration purposes.
 *
 * Features:
 * - Initializes an empty chat session
 * - Uses a static ID for consistent chat state in demo environment
 * - Provides full read/write access to the chat
 */

import { Chat } from '@/components/chat';

export default function Page() {
  // Use a static chat ID for dev/demo purposes
  const id = 'dev-static-chat-id';
  return (
    <>
      <Chat key={id} id={id} initialMessages={[]} isReadonly={false} />
    </>
  );
}
