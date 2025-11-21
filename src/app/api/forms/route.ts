import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET all forms
export async function GET() {
  try {
    const forms = await prisma.form.findMany();
    return NextResponse.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// CREATE a new form (protected route, logic to be added in middleware)
export async function POST(request: Request) {
  try {
    const { title, googleFormLink, status } = await request.json();

    if (!title || !googleFormLink) {
      return NextResponse.json({ message: 'Title and Google Form link are required' }, { status: 400 });
    }

    const form = await prisma.form.create({
      data: {
        title,
        googleFormLink,
        status,
      },
    });

    revalidatePath('/forms');

    return NextResponse.json({ message: 'Form created successfully', form }, { status: 201 });
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
