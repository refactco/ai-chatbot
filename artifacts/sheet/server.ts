/**
 * Sheet Artifact Server Implementation
 *
 * This file defines the server-side implementation of the sheet artifact type.
 * It handles spreadsheet generation and updates through the API service.
 *
 * Features:
 * - Spreadsheet creation from descriptions/titles
 * - Spreadsheet updating based on modification instructions
 * - Stream-based content updates for real-time UI feedback
 * - Error handling for API interactions
 *
 * This implementation connects the sheet artifact UI to the backend AI services
 * that generate and modify spreadsheet data based on user instructions.
 */

import { apiService } from '@/lib/api';
import { createDocumentHandler } from '@/lib/artifacts/server';

/**
 * Sheet Document Handler
 *
 * Creates a handler for sheet documents with create and update capabilities
 */
export const sheetDocumentHandler = createDocumentHandler<'sheet'>({
  kind: 'sheet',

  /**
   * Creates a new spreadsheet based on a title/description prompt
   * @param title - The topic to generate the spreadsheet about
   * @param dataStream - Stream for sending updates to the client
   * @returns The generated spreadsheet content as a string (usually CSV)
   */
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

  /**
   * Updates an existing spreadsheet based on a description of changes
   * @param document - The current document with existing content
   * @param description - The description of changes to make
   * @param dataStream - Stream for sending updates to the client
   * @returns The updated spreadsheet content as a string (usually CSV)
   */
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
