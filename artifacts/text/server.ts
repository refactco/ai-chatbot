import { apiService } from '@/lib/api';
import { createDocumentHandler } from '@/lib/artifacts/server';

export const textDocumentHandler = createDocumentHandler<'text'>({
  kind: 'text',
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = '';

    // Use the API service to get content based on title
    await apiService.streamResponse(`Create a text document about: ${title}`, {
      onChunk: (chunk) => {
        if (typeof chunk !== 'string') {
          if (
            chunk.attachments?.length &&
            chunk.attachments[0].type === 'text'
          ) {
            // Extract content from the attachment
            const content = chunk.attachments[0].content || '';

            // Update the draft content
            draftContent = content;

            // Stream content to UI
            dataStream.writeData({
              type: 'text-delta',
              content: content,
            });
          }
        }
      },
      onFinish: () => {
        // Stream is complete
      },
      onError: (error) => {
        console.error('Error creating text document:', error);
      },
    });

    return draftContent;
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = document.content || '';

    // Use the API service to update content based on description
    await apiService.streamResponse(
      `Update this text document with the following changes: ${description}\n\nCurrent content: ${draftContent}`,
      {
        onChunk: (chunk) => {
          if (typeof chunk !== 'string') {
            if (
              chunk.attachments?.length &&
              chunk.attachments[0].type === 'text'
            ) {
              // Extract content from the attachment
              const content = chunk.attachments[0].content || '';

              // Update the draft content
              draftContent = content;

              // Stream content to UI
              dataStream.writeData({
                type: 'text-delta',
                content: content,
              });
            }
          }
        },
        onFinish: () => {
          // Stream is complete
        },
        onError: (error) => {
          console.error('Error updating text document:', error);
        },
      },
    );

    return draftContent;
  },
});
