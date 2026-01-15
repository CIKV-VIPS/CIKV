import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET all forms
export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not configured');
      return NextResponse.json([], { status: 200 });
    }

    try {
      const forms = await prisma.form.findMany();
      return NextResponse.json(forms || [], { status: 200 });
    } catch (dbError) {
      console.error('Database error fetching forms:', dbError);
      return NextResponse.json([], { status: 200 });
    }
  } catch (error) {
    console.error('Error in forms GET:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// CREATE a new form (protected route, logic to be added in middleware)
export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { message: 'Database not configured' },
        { status: 503 }
      );
    }

    const { title, googleFormLink, status } = await request.json();

    if (!title || !googleFormLink) {
      return NextResponse.json(
        { message: 'Title and Google Form link are required' },
        { status: 400 }
      );
    }

    try {
      const form = await prisma.form.create({
        data: {
          title,
          googleFormLink,
          status,
        },
      });

      revalidatePath('/forms');

      return NextResponse.json(
        { message: 'Form created successfully', form },
        { status: 201 }
      );
    } catch (dbError) {
      console.error('Database error creating form:', dbError);
      return NextResponse.json(
        { message: 'Failed to create form' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
