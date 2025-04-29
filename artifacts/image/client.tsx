/**
 * Image Artifact Client Implementation
 *
 * This file defines the client-side implementation of the image artifact type.
 * It handles rendering, interaction, and state management for image documents.
 *
 * Features:
 * - Image display and editing capabilities
 * - Version history navigation
 * - Copy to clipboard functionality
 * - Real-time streaming updates
 *
 * The image artifact is used for AI-generated images with version control support,
 * allowing users to iterate on image generation with multiple versions.
 */

import { Artifact } from '@/components/create-artifact';
import { CopyIcon, RedoIcon, UndoIcon } from '@/components/icons';
import { ImageEditor } from '@/components/image-editor';
import { toast } from 'sonner';

/**
 * Image Artifact definition
 *
 * Creates a new image artifact type with specific behaviors and UI components
 */
export const imageArtifact = new Artifact({
  kind: 'image',
  description: 'Useful for image generation',

  /**
   * Handles streaming updates to the image artifact
   * Processes image content updates from the server
   */
  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === 'image-delta') {
      setArtifact((draftArtifact) => ({
        ...draftArtifact,
        content: streamPart.content as string,
        isVisible: true,
        status: 'streaming',
      }));
    }
  },

  /**
   * Renders the image artifact content
   * Uses the ImageEditor component to display the image
   */
  content: ImageEditor,

  /**
   * Action buttons displayed in the image artifact interface
   * Provides version navigation and clipboard functionality
   */
  actions: [
    {
      icon: <UndoIcon size={18} />,
      description: 'View Previous version',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('prev');
      },
      isDisabled: ({ currentVersionIndex }) => {
        if (currentVersionIndex === 0) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <RedoIcon size={18} />,
      description: 'View Next version',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('next');
      },
      isDisabled: ({ isCurrentVersion }) => {
        if (isCurrentVersion) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <CopyIcon size={18} />,
      description: 'Copy image to clipboard',
      onClick: ({ content }) => {
        // Create an image from the base64 content
        const img = new Image();
        img.src = `data:image/png;base64,${content}`;

        // When image loads, copy it to clipboard
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob }),
              ]);
            }
          }, 'image/png');
        };

        toast.success('Copied image to clipboard!');
      },
    },
  ],
  toolbar: [],
});
