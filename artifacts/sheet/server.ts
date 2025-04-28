import { apiService } from '@/lib/api';
import { createDocumentHandler } from '@/lib/artifacts/server';

export const sheetDocumentHandler = createDocumentHandler<'sheet'>({
  kind: 'sheet',
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = '';

    // Use the API service to get spreadsheet content based on the title
    await apiService.streamResponse(`Create a spreadsheet about: ${title}`, {
      onChunk: (chunk) => {
        if (typeof chunk !== 'string') {
          if (
            chunk.attachments?.length &&
            chunk.attachments[0].type === 'sheet'
          ) {
            // Extract content from the attachment
            const content = chunk.attachments[0].content || '';

            // Update the draft content
            draftContent = content;

            // Stream content to UI
            dataStream.writeData({
              type: 'sheet-delta',
              content: content,
            });
          }
        }
      },
      onFinish: () => {
        // Stream is complete
      },
      onError: (error) => {
        console.error('Error creating spreadsheet:', error);
      },
    });

    return draftContent;
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = document.content || '';

    // Use the API service to update spreadsheet content based on the description
    await apiService.streamResponse(
      `Update this spreadsheet with the following changes: ${description}\n\nCurrent content: ${draftContent}`,
      {
        onChunk: (chunk) => {
          if (typeof chunk !== 'string') {
            if (
              chunk.attachments?.length &&
              chunk.attachments[0].type === 'sheet'
            ) {
              // Extract content from the attachment
              const content = chunk.attachments[0].content || '';

              // Update the draft content
              draftContent = content;

              // Stream content to UI
              dataStream.writeData({
                type: 'sheet-delta',
                content: content,
              });
            }
          }
        },
        onFinish: () => {
          // Stream is complete
        },
        onError: (error) => {
          console.error('Error updating spreadsheet:', error);
        },
      },
    );

    return draftContent;
  },
});
