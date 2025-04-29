/**
 * Artifact Server Framework
 *
 * This file provides the core framework for handling server-side artifact operations.
 * It defines interfaces, utilities, and handlers for creating and updating artifacts.
 *
 * Features:
 * - Document handler registration system
 * - Generic interfaces for artifact operations
 * - Local storage persistence implementation
 * - Handler factory with consistent patterns
 * - Support for multiple artifact types
 *
 * This server-side framework connects UI components with the backend storage
 * and processing for different types of artifacts (text, image, sheet).
 */

import { imageDocumentHandler } from '@/artifacts/image/server';
import { sheetDocumentHandler } from '@/artifacts/sheet/server';
import { textDocumentHandler } from '@/artifacts/text/server';
import type { ArtifactKind } from '@/components/artifact';
import type { DataStreamWriter } from '@/lib/api/types';
import type { Document } from '../schema';

/**
 * Properties required for saving a document
 * Used when persisting document changes
 */
export interface SaveDocumentProps {
  id: string; // Unique document identifier
  title: string; // Document title
  kind: ArtifactKind; // Type of artifact (text, image, sheet)
  content: string; // Document content
  userId: string; // Owner of the document
}

/**
 * User session information
 * Contains authentication and identity data
 */
export interface Session {
  user?: {
    id: string; // User identifier
    name?: string; // User display name
    email?: string; // User email
    image?: string; // User profile image
  };
  expires: string; // Session expiration timestamp
}

/**
 * Properties passed to document creation callbacks
 * Provides context for creating a new document
 */
export interface CreateDocumentCallbackProps {
  id: string; // New document ID
  title: string; // Initial document title
  dataStream: DataStreamWriter<any>; // Stream for sending updates to client
  session: Session; // User session information
}

/**
 * Properties passed to document update callbacks
 * Provides context for updating an existing document
 */
export interface UpdateDocumentCallbackProps {
  document: Document; // Existing document to update
  description: string; // Description of changes to make
  dataStream: DataStreamWriter<any>; // Stream for sending updates to client
  session: Session; // User session information
}

/**
 * Document handler interface
 * Defines the contract for artifact-specific document handlers
 */
export interface DocumentHandler<T = ArtifactKind> {
  kind: T; // Artifact type this handler manages
  onCreateDocument: (args: CreateDocumentCallbackProps) => Promise<void>; // Create document handler
  onUpdateDocument: (args: UpdateDocumentCallbackProps) => Promise<void>; // Update document handler
}

/**
 * Saves a document to storage
 * Currently implements localStorage persistence
 *
 * @param props - Document properties to save
 * @returns Promise that resolves when save is complete
 */
export async function saveDocument(props: SaveDocumentProps): Promise<void> {
  if (typeof window === 'undefined') return;

  const { id, title, kind, content, userId } = props;

  // Get existing documents from localStorage
  const storedDocs = localStorage.getItem('documents');
  const documents: Document[] = storedDocs ? JSON.parse(storedDocs) : [];

  // Check if document already exists
  const existingDocIndex = documents.findIndex((doc) => doc.id === id);

  const now = new Date();

  if (existingDocIndex >= 0) {
    // Update existing document
    documents[existingDocIndex] = {
      ...documents[existingDocIndex],
      title,
      content,
      updatedAt: now,
    };
  } else {
    // Create new document
    documents.push({
      id,
      userId,
      title,
      content,
      kind,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Save to localStorage
  localStorage.setItem('documents', JSON.stringify(documents));
}

/**
 * Factory function for creating document handlers
 * Standardizes handler implementation with consistent patterns
 *
 * @param config - Handler configuration with kind-specific implementations
 * @returns A fully implemented document handler
 */
export function createDocumentHandler<T extends ArtifactKind>(config: {
  kind: T;
  onCreateDocument: (params: CreateDocumentCallbackProps) => Promise<string>;
  onUpdateDocument: (params: UpdateDocumentCallbackProps) => Promise<string>;
}): DocumentHandler<T> {
  return {
    kind: config.kind,
    onCreateDocument: async (args: CreateDocumentCallbackProps) => {
      // Call the provided handler to generate content
      const draftContent = await config.onCreateDocument({
        id: args.id,
        title: args.title,
        dataStream: args.dataStream,
        session: args.session,
      });

      // Save the generated content if user is authenticated
      if (args.session?.user?.id) {
        await saveDocument({
          id: args.id,
          title: args.title,
          content: draftContent,
          kind: config.kind,
          userId: args.session.user.id,
        });
      }

      return;
    },
    onUpdateDocument: async (args: UpdateDocumentCallbackProps) => {
      // Call the provided handler to update content
      const draftContent = await config.onUpdateDocument({
        document: args.document,
        description: args.description,
        dataStream: args.dataStream,
        session: args.session,
      });

      // Save the updated content if user is authenticated
      if (args.session?.user?.id) {
        await saveDocument({
          id: args.document.id,
          title: args.document.title,
          content: draftContent,
          kind: config.kind,
          userId: args.session.user.id,
        });
      }

      return;
    },
  };
}

/**
 * Registry of all available document handlers
 * Used to manage different artifact types in the system
 */
export const documentHandlersByArtifactKind: Array<DocumentHandler> = [
  textDocumentHandler,
  imageDocumentHandler,
  sheetDocumentHandler,
];

/**
 * List of supported artifact kinds
 * Defines the valid types of artifacts in the system
 */
export const artifactKinds = ['text', 'image', 'sheet'] as const;
