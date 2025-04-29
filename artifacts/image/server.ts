/**
 * Image Artifact Server Implementation
 *
 * This file defines the server-side implementation of the image artifact type.
 * It handles image generation and updates through the API service.
 *
 * Features:
 * - Image creation from text descriptions
 * - Image updating based on modification instructions
 * - Stream-based content updates for real-time UI feedback
 * - Error handling for API interactions
 *
 * This implementation connects the image artifact UI to the backend AI services
 * that generate and modify images based on user instructions.
 */

import { apiService } from '@/lib/api';
import { createDocumentHandler } from '@/lib/artifacts/server';

/**
 * Image Document Handler
 *
 * Creates a handler for image documents with create and update capabilities
 */
export const imageDocumentHandler = createDocumentHandler<'image'>({
  kind: 'image',

  /**
   * Creates a new image based on a title/description prompt
   * @param title - The description to generate the image from
   * @param dataStream - Stream for sending updates to the client
   * @returns The generated image content (usually base64 encoded)
   */
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

  /**
   * Updates an existing image based on a description of changes
   * @param description - The description of changes to make to the image
   * @param dataStream - Stream for sending updates to the client
   * @returns The updated image content (usually base64 encoded)
   */
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
