/**
 * Text Artifact Server Implementation
 *
 * This file defines the server-side implementation of the text artifact type.
 * It handles document creation and updates through the API service.
 *
 * Features:
 * - Document creation with AI-generated initial content
 * - Document updating based on user descriptions
 * - Stream-based content updates for real-time UI feedback
 * - Error handling for API interactions
 *
 * This implementation connects the text artifact UI to the backend services
 * that generate and modify content based on user instructions.
 */

import { apiService } from '@/lib/api';
import { createDocumentHandler } from '@/lib/artifacts/server';

/**
 * Text Document Handler
 *
 * Creates a handler for text documents with create and update capabilities
 */
export const textDocumentHandler = createDocumentHandler<'text'>({
  kind: 'text',

  /**
   * Creates a new text document based on a title prompt
   * @param title - The title/prompt to generate content from
   * @param dataStream - Stream for sending updates to the client
   * @returns The generated document content as a string
   */
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

  /**
   * Updates an existing text document based on a description
   * @param document - The current document with existing content
   * @param description - The description of changes to make
   * @param dataStream - Stream for sending updates to the client
   * @returns The updated document content as a string
   */
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
