/**
 * Storage Service
 *
 * This service provides file storage functionality using the mock storage API.
 * It's designed to be easily replaceable with a real storage service in the future.
 */

import { storageApi } from '../mockApi';
import type { StoredFile } from '../mockApi/storageApi';

// File upload options
export interface UploadOptions {
  folder?: string;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

// Storage service implementation
export const storageService = {
  // Upload a file
  uploadFile: async (
    file: File,
    options?: UploadOptions,
  ): Promise<StoredFile> => {
    // Validate file size if maxSizeMB is specified
    if (options?.maxSizeMB && file.size > options.maxSizeMB * 1024 * 1024) {
      throw new Error(
        `File size exceeds the maximum limit of ${options.maxSizeMB}MB`,
      );
    }

    // Validate file type if acceptedTypes is specified
    if (options?.acceptedTypes && options.acceptedTypes.length > 0) {
      const fileType = file.type.toLowerCase();
      const isAccepted = options.acceptedTypes.some(
        (type) =>
          fileType === type.toLowerCase() ||
          fileType.startsWith(`${type.toLowerCase()}/`),
      );

      if (!isAccepted) {
        throw new Error(
          `File type ${file.type} is not accepted. Allowed types: ${options.acceptedTypes.join(', ')}`,
        );
      }
    }

    // Upload the file using the mock storage API
    const response = await storageApi.uploadFile(file, {
      folder: options?.folder,
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data;
  },

  // Get file metadata by URL
  getFile: async (url: string): Promise<StoredFile> => {
    const response = await storageApi.getFile(url);

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data;
  },

  // Get file data (as data URL) by URL
  getFileData: async (url: string): Promise<string> => {
    const response = await storageApi.getFileData(url);

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data;
  },

  // Delete a file by URL
  deleteFile: async (url: string): Promise<void> => {
    const response = await storageApi.deleteFile(url);

    if (response.error) {
      throw new Error(response.error);
    }
  },

  // List files in a folder
  listFiles: async (folderPath?: string): Promise<StoredFile[]> => {
    const response = await storageApi.listFiles(folderPath);

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data;
  },

  // Create a file URL from a storage URL (for display in the browser)
  getDisplayUrl: (url: string): string => {
    // In the real implementation, this might transform a storage URL to a CDN URL
    // For the mock implementation, we'll return the original URL
    return url;
  },
};

export default storageService;
