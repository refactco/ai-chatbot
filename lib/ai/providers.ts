import { mockApiService } from '../services/mock-api-service';

// Export a single AI provider implementation
export const provider = {
  // Chat method for conversation
  chat: async ({ messages, model, stream, ...options }: any) => {
    console.log('Chat request with model:', model);
    console.log('Messages:', messages);
    console.log('Options:', options);

    // Extract the last user message
    const lastUserMessage = messages.findLast(
      (msg: any) => msg.role === 'user',
    );

    if (!lastUserMessage) {
      throw new Error('No user message found');
    }

    if (stream) {
      // For streaming mode, return a readable stream of responses
      return {
        status: 200,
        body: {
          getReader: () => {
            let isFinished = false;
            let streamController: any = null;

            // Start streaming the response
            mockApiService.streamResponse(
              lastUserMessage.content,
              options.attachments || [],
              {
                onChunk: (chunk) => {
                  if (streamController) {
                    streamController.enqueue(
                      new TextEncoder().encode(
                        JSON.stringify({
                          type: 'text-delta',
                          textDelta: chunk,
                        }),
                      ),
                    );
                  }
                },
                onFinish: () => {
                  if (streamController && !isFinished) {
                    isFinished = true;
                    streamController.enqueue(
                      new TextEncoder().encode(
                        JSON.stringify({ type: 'finish' }),
                      ),
                    );
                    streamController.close();
                  }
                },
                onError: (error) => {
                  if (streamController && !isFinished) {
                    isFinished = true;
                    streamController.error(error);
                  }
                },
              },
            );

            return {
              read: () => {
                if (isFinished) {
                  return Promise.resolve({ done: true });
                }

                return new Promise((resolve) => {
                  streamController = {
                    enqueue: (value: any) => {
                      resolve({ value, done: false });
                    },
                    close: () => {
                      resolve({ done: true });
                    },
                    error: (error: any) => {
                      console.error('Stream error:', error);
                      resolve({ done: true });
                    },
                  };
                });
              },
              cancel: () => {
                isFinished = true;
              },
            };
          },
        },
      };
    } else {
      // For non-streaming mode, return a single response
      return {
        status: 200,
        text: async () => {
          return new Promise((resolve, reject) => {
            let fullResponse = '';

            mockApiService.streamResponse(
              lastUserMessage.content,
              options.attachments || [],
              {
                onChunk: (chunk) => {
                  fullResponse += chunk;
                },
                onFinish: (message) => {
                  resolve(message.content);
                },
                onError: (error) => {
                  reject(error);
                },
              },
            );
          });
        },
      };
    }
  },

  // Language model method (simplified for our needs)
  languageModel: async ({ model }: any) => {
    console.log('Language model request with model:', model);
    return { model };
  },

  // Image model method (simplified for our needs)
  imageModel: async ({ model }: any) => {
    console.log('Image model request with model:', model);
    return { model };
  },
};
