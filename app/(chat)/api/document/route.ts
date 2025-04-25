import { auth } from '@/app/(auth)/auth';
import type { ArtifactKind } from '@/components/artifact';
import {
  deleteDocumentsByIdAfterTimestamp,
  getDocumentsById,
  saveDocument,
} from '@/lib/db/queries';

// Mock user session for authentication bypass
const mockSession = {
  user: {
    id: 'admin',
    email: 'admin@admin.com',
    name: 'Admin'
  },
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString() // 7 days from now
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  // Use mock session instead of real auth
  // const session = await auth();
  const session = mockSession;

  // Comment out auth check - we always have a session now
  // if (!session?.user?.id) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  const documents = await getDocumentsById({ id });

  const [document] = documents;

  if (!document) {
    return new Response('Not found', { status: 404 });
  }

  // Comment out user check - allow access to all documents
  // if (document.userId !== session.user.id) {
  //   return new Response('Forbidden', { status: 403 });
  // }

  return Response.json(documents, { status: 200 });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  // Use mock session instead of real auth
  // const session = await auth();
  const session = mockSession;

  // Comment out auth check - we always have a session now
  // if (!session?.user?.id) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  const {
    content,
    title,
    kind,
  }: { content: string; title: string; kind: ArtifactKind } =
    await request.json();

  const documents = await getDocumentsById({ id });

  if (documents.length > 0) {
    const [document] = documents;

    // Comment out user check - allow access to all documents
    // if (document.userId !== session.user.id) {
    //   return new Response('Forbidden', { status: 403 });
    // }
  }

  const document = await saveDocument({
    id,
    content,
    title,
    kind,
    userId: session.user.id,
  });

  return Response.json(document, { status: 200 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const timestamp = searchParams.get('timestamp');

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  if (!timestamp) {
    return new Response('Missing timestamp', { status: 400 });
  }

  // Use mock session instead of real auth
  // const session = await auth();
  const session = mockSession;

  // Comment out auth check - we always have a session now
  // if (!session?.user?.id) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  const documents = await getDocumentsById({ id });

  const [document] = documents;

  // Comment out user check - allow access to all documents
  // if (document.userId !== session.user.id) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  const documentsDeleted = await deleteDocumentsByIdAfterTimestamp({
    id,
    timestamp: new Date(timestamp),
  });

  return Response.json(documentsDeleted, { status: 200 });
}
