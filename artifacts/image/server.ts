import { apiService } from '@/lib/api';
import { createDocumentHandler } from '@/lib/artifacts/server';

export const imageDocumentHandler = createDocumentHandler<'image'>({
  kind: 'image',
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = '';

    // Use the API service to get an image based on the title
    await apiService.streamResponse(`Generate an image of: ${title}`, {
      onChunk: (chunk) => {
        if (typeof chunk !== 'string') {
          if (
            chunk.attachments?.length &&
            chunk.attachments[0].type === 'image'
          ) {
            // Extract image content or URL from the attachment
            const content =
              chunk.attachments[0].content || chunk.attachments[0].url || '';

            // Update the draft content
            draftContent = content;

            // Stream content to UI
            dataStream.writeData({
              type: 'image-delta',
              content: content,
            });
          }
        }
      },
      onFinish: () => {
        // Stream is complete
      },
      onError: (error) => {
        console.error('Error creating image:', error);
      },
    });

    return draftContent;
  },
  onUpdateDocument: async ({ description, dataStream }) => {
    let draftContent = '';

    // Use the API service to update the image based on the description
    await apiService.streamResponse(
      `Update this image with the following changes: ${description}`,
      {
        onChunk: (chunk) => {
          if (typeof chunk !== 'string') {
            if (
              chunk.attachments?.length &&
              chunk.attachments[0].type === 'image'
            ) {
              // Extract image content or URL from the attachment
              const content =
                chunk.attachments[0].content || chunk.attachments[0].url || '';

              // Update the draft content
              draftContent = content;

              // Stream content to UI
              dataStream.writeData({
                type: 'image-delta',
                content: content,
              });
            }
          }
        },
        onFinish: () => {
          // Stream is complete
        },
        onError: (error) => {
          console.error('Error updating image:', error);
        },
      },
    );

    return draftContent;
  },
});
