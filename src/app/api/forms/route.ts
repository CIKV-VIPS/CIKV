import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET all forms
export async function GET() {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not configured');
      return NextResponse.json(
        { message: 'Database not configured', forms: [] },
        { status: 200 } // Return 200 with empty array instead of 500
      );
    }

    const forms = await prisma.form.findMany();
    return NextResponse.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    // Return empty array instead of 500 error
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
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
