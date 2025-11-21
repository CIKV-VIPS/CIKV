import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET a single event by ID
export async function GET(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// UPDATE an event by ID
export async function PUT(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    const { title, description, date, category, imageUrl } = await request.json();

    const event = await prisma.event.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        category,
        imageUrl,
      },
    });

    revalidatePath('/events');
    revalidatePath(`/events/${id}`);

    return NextResponse.json({ message: 'Event updated successfully', event });
  } catch (error) {
    console.error(`Error updating event ${id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE an event by ID
export async function DELETE(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    await prisma.event.delete({
      where: { id: parseInt(id, 10) },
    });

    revalidatePath('/events');
    revalidatePath(`/events/${id}`);

    return NextResponse.json({ message: 'Event deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting event ${id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
