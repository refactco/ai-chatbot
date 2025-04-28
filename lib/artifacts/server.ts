import { imageDocumentHandler } from '@/artifacts/image/server';
import { sheetDocumentHandler } from '@/artifacts/sheet/server';
import { textDocumentHandler } from '@/artifacts/text/server';
import type { ArtifactKind } from '@/components/artifact';
import type { DataStreamWriter } from '@/lib/api/types';
import type { Document } from '../schema';

export interface SaveDocumentProps {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}

export interface Session {
  user?: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
  };
  expires: string;
}

export interface CreateDocumentCallbackProps {
  id: string;
  title: string;
  dataStream: DataStreamWriter<any>;
  session: Session;
}

export interface UpdateDocumentCallbackProps {
  document: Document;
  description: string;
  dataStream: DataStreamWriter<any>;
  session: Session;
}

export interface DocumentHandler<T = ArtifactKind> {
  kind: T;
  onCreateDocument: (args: CreateDocumentCallbackProps) => Promise<void>;
  onUpdateDocument: (args: UpdateDocumentCallbackProps) => Promise<void>;
}

// Client-side implementation to save document
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

export function createDocumentHandler<T extends ArtifactKind>(config: {
  kind: T;
  onCreateDocument: (params: CreateDocumentCallbackProps) => Promise<string>;
  onUpdateDocument: (params: UpdateDocumentCallbackProps) => Promise<string>;
}): DocumentHandler<T> {
  return {
    kind: config.kind,
    onCreateDocument: async (args: CreateDocumentCallbackProps) => {
      const draftContent = await config.onCreateDocument({
        id: args.id,
        title: args.title,
        dataStream: args.dataStream,
        session: args.session,
      });

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
      const draftContent = await config.onUpdateDocument({
        document: args.document,
        description: args.description,
        dataStream: args.dataStream,
        session: args.session,
      });

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

/*
 * Use this array to define the document handlers for each artifact kind.
 */
export const documentHandlersByArtifactKind: Array<DocumentHandler> = [
  textDocumentHandler,
  imageDocumentHandler,
  sheetDocumentHandler,
];

export const artifactKinds = ['text', 'image', 'sheet'] as const;
