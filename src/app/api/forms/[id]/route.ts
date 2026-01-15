import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET a single form by ID
export async function GET(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    const form = await prisma.form.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!form) {
      return NextResponse.json({ message: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error(`Error fetching form ${id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// UPDATE a form by ID (protected route, logic to be added in middleware)
export async function PUT(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { message: 'Database not configured' },
        { status: 503 }
      );
    }

    const { title, googleFormLink, status } = await request.json();

    try {
      const form = await prisma.form.update({
        where: { id: parseInt(id, 10) },
        data: {
          title,
          googleFormLink,
          status,
        },
      });

      revalidatePath('/forms');

      return NextResponse.json(
        { message: 'Form updated successfully', form },
        { status: 200 }
      );
    } catch (dbError) {
      console.error(`Database error updating form ${id}:`, dbError);
      return NextResponse.json(
        { message: 'Failed to update form' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(`Error updating form ${id}:`, error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE a form by ID (protected route, logic to be added in middleware)
export async function DELETE(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { message: 'Database not configured' },
        { status: 503 }
      );
    }

    try {
      await prisma.form.delete({
        where: { id: parseInt(id, 10) },
      });

      revalidatePath('/forms');

      return NextResponse.json(
        { message: 'Form deleted successfully' },
        { status: 200 }
      );
    } catch (dbError) {
      console.error(`Database error deleting form ${id}:`, dbError);
      return NextResponse.json(
        { message: 'Failed to delete form' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(`Error deleting form ${id}:`, error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
