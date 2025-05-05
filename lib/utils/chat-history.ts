import { mutate } from 'swr';

export const CHAT_HISTORY_KEY = 'chatHistory';

export const refreshChatHistory = () => {
  mutate(CHAT_HISTORY_KEY);
};
