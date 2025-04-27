/**
 * Mock Storage API
 *
 * This file simulates a file storage service (like Vercel Blob)
 * for handling file uploads and downloads.
 */

import type { MockResponse } from './utils';
import { mockSuccess, mockError, generateId, simulateDelay } from './utils';

// Interface for a stored file
export interface StoredFile {
  url: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

// Store files in memory for demo purposes
const fileStore = new Map<string, StoredFile>();

// Mock URL prefix for stored files
const STORAGE_URL_PREFIX = 'mock-storage://';

// Helper to generate a data URL from a file
const createDataURL = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
};

// Upload a file
export const uploadFile = async (
  file: File,
  options?: { folder?: string },
): Promise<MockResponse<StoredFile>> => {
  // Validate the file
  if (!file) {
    return mockError('No file provided', 400);
  }

  try {
    // Simulate network delay
    await simulateDelay(1000);

    // Generate a unique ID for the file
    const fileId = generateId();

    // Create a folder path if provided
    const folderPath = options?.folder ? `${options.folder}/` : '';

    // Generate a mock URL for the file
    const url = `${STORAGE_URL_PREFIX}${folderPath}${fileId}-${encodeURIComponent(file.name)}`;

    // Convert file to data URL for demonstration purposes
    const dataUrl = await createDataURL(file);

    // Create a stored file record
    const storedFile: StoredFile = {
      url,
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date(),
    };

    // Store the file in memory
    fileStore.set(url, storedFile);

    // Also store the data URL in localStorage for persistence
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`mock_file_${url}`, dataUrl);
    }

    return mockSuccess(storedFile);
  } catch (error) {
    return mockError(
      `File upload failed: ${error instanceof Error ? error.message : String(error)}`,
      500,
    );
  }
};

// Get a file by URL
export const getFile = async (
  url: string,
): Promise<MockResponse<StoredFile>> => {
  // Simulate network delay
  await simulateDelay(300);

  // Check if the file exists
  const storedFile = fileStore.get(url);

  if (!storedFile) {
    return mockError('File not found', 404);
  }

  return mockSuccess(storedFile);
};

// Get a file's data URL by URL
export const getFileData = async (
  url: string,
): Promise<MockResponse<string>> => {
  // Simulate network delay
  await simulateDelay(500);

  // Check if the file exists in memory
  const storedFile = fileStore.get(url);

  if (!storedFile) {
    return mockError('File not found', 404);
  }

  // Get the data URL from localStorage
  if (typeof localStorage !== 'undefined') {
    const dataUrl = localStorage.getItem(`mock_file_${url}`);

    if (dataUrl) {
      return mockSuccess(dataUrl);
    }
  }

  return mockError('File data not found', 404);
};

// Delete a file
export const deleteFile = async (
  url: string,
): Promise<MockResponse<{ success: boolean }>> => {
  // Simulate network delay
  await simulateDelay(500);

  // Check if the file exists
  if (!fileStore.has(url)) {
    return mockError('File not found', 404);
  }

  // Delete the file from memory
  fileStore.delete(url);

  // Delete from localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(`mock_file_${url}`);
  }

  return mockSuccess({ success: true });
};

// List files in a folder
export const listFiles = async (
  folderPath?: string,
): Promise<MockResponse<StoredFile[]>> => {
  // Simulate network delay
  await simulateDelay(800);

  // Filter files by folder path
  const files: StoredFile[] = [];

  fileStore.forEach((file) => {
    if (
      !folderPath ||
      file.url.includes(`${STORAGE_URL_PREFIX}${folderPath}/`)
    ) {
      files.push(file);
    }
  });

  return mockSuccess(files);
};
