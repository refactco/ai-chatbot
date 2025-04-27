import { Chat } from '@/components/chat';

export default function Page() {
  // Use a static chat ID for dev/demo purposes
  const id = 'dev-static-chat-id';
  return <Chat key={id} id={id} initialMessages={[]} isReadonly={false} />;
}
