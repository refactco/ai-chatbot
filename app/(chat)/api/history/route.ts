import { auth } from '@/app/(auth)/auth';
import { NextRequest } from 'next/server';
import { getChatsByUserId } from '@/lib/db/queries';

// Mock user session for authentication bypass
const mockSession = {
  user: {
    id: 'admin',
    email: 'admin@admin.com',
    name: 'Admin'
  },
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString() // 7 days from now
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const limit = parseInt(searchParams.get('limit') || '10');
  const startingAfter = searchParams.get('starting_after');
  const endingBefore = searchParams.get('ending_before');

  if (startingAfter && endingBefore) {
    return Response.json(
      'Only one of starting_after or ending_before can be provided!',
      { status: 400 },
    );
  }

  // Use mock session instead of real auth
  // const session = await auth();
  const session = mockSession;

  // Comment out auth check - we always have a session now
  // if (!session?.user?.id) {
  //   return Response.json('Unauthorized!', { status: 401 });
  // }

  try {
    const chats = await getChatsByUserId({
      id: session.user.id,
      limit,
      startingAfter,
      endingBefore,
    });

    return Response.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return Response.json('Failed to fetch chats!', { status: 500 });
  }
}
