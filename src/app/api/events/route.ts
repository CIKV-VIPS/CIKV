import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET all events
export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not configured');
      return NextResponse.json(
        { message: 'Database not configured' },
        { status: 500 }
      );
    }

    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Error in events GET:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: errorMessage },
      { status: 500 }
    );
  }
}

// CREATE a new event
export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { message: 'Database not configured' },
        { status: 503 }
      );
    }

    const { title, description, date, category, imageUrl } = await request.json();

    if (!title || !description || !date) {
      return NextResponse.json(
        { message: 'Title, description, and date are required' },
        { status: 400 }
      );
    }

    try {
      const event = await prisma.event.create({
        data: {
          title,
          description,
          date: new Date(date),
          category,
          imageUrl,
        },
      });

      revalidatePath('/events');

      return NextResponse.json(
        { message: 'Event created successfully', event },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('Database error creating event:', dbError);
      return NextResponse.json(
        { message: 'Failed to create event' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
