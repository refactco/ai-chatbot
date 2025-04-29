/**
 * Mock Data
 *
 * This file contains sample data used by the mock API handlers.
 * It provides predefined content for different artifact types.
 *
 * Features:
 * - Sample image data in base64 format
 * - Sample text content with markdown formatting
 * - Sample spreadsheet data in CSV format
 * - Consistent document titles for each artifact type
 *
 * This data is used to simulate content for different artifact types
 * when using the mock API during development and testing.
 */

/**
 * Base64 encoded sample image
 * A simple colored square used for testing image artifacts
 */
export const SAMPLE_IMAGE_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAnElEQVR42u3RAQ0AAAgDoM/0qQFrHN4Egmh3pgkCQIAAAQJEgAABAgQIECBAgAABAgQIECBAgAABAgQIECBABAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQAQIECBAgAABAgQIECBAgAABAgQIEA+xMnAAD0KOdQ4AAAAASUVORK5CYII=';

/**
 * Document titles for each artifact type
 * Used for consistent naming of mock documents
 */
export const DOCUMENT_TITLES = {
  TEXT: 'Comprehensive Research Document',
  SHEET: 'Sales Data Analysis',
  IMAGE: 'AI-Generated Visual Output',
};

/**
 * Sample text document content with markdown formatting
 * Used for text artifact mock data
 */
export const SAMPLE_TEXT = `# Sample Text Document

This is a sample text document for testing the text artifact viewer. You can edit this text to test the document editing capabilities.

## Features
- Supports Markdown formatting
- Real-time editing
- Version history

## Next Steps
1. Try editing this document
2. Create a new version
3. Check the version history`;

/**
 * Sample spreadsheet content in CSV format
 * Used for sheet artifact mock data
 */
export const SAMPLE_SHEET = `Name,Age,City,Occupation
John Doe,32,New York,Engineer
Jane Smith,28,San Francisco,Designer
Michael Johnson,45,Chicago,Manager
Linda Williams,39,Boston,Doctor
Robert Brown,24,Seattle,Developer`;
