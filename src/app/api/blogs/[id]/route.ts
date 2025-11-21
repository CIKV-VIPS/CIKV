import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET a single blog by ID
export async function GET(request: NextRequest, context: any) {
  const { id } = context.params;
  console.log(`Fetching blog with id: ${id}`);
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: parseInt(id, 10) },
    });

    console.log('Found blog:', blog);

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error(`Error fetching blog ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Internal server error', error: errorMessage }, { status: 500 });
  }
}

// UPDATE a blog by ID
export async function PUT(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    const { title, author, content, imageUrl } = await request.json();

    const blog = await prisma.blog.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        author,
        content,
        imageUrl,
      },
    });

    revalidatePath('/blogs');
    revalidatePath(`/blogs/${id}`);

    return NextResponse.json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    console.error(`Error updating blog ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Internal server error', error: errorMessage }, { status: 500 });
  }
}

// DELETE a blog by ID
export async function DELETE(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    await prisma.blog.delete({
      where: { id: parseInt(id, 10) },
    });

    revalidatePath('/blogs');

    return NextResponse.json({ message: 'Blog deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting blog ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Internal server error', error: errorMessage }, { status: 500 });
  }
}
