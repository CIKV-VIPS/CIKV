import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET all events
export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not configured');
      return NextResponse.json([], { status: 200 });
    }

    const events = await prisma.event.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// CREATE a new event
export async function POST(request: Request) {
  try {
    const { title, description, date, category, imageUrl } = await request.json();

    if (!title || !description || !date) {
      return NextResponse.json({ message: 'Title, description, and date are required' }, { status: 400 });
    }

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

    return NextResponse.json({ message: 'Event created successfully', event }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
