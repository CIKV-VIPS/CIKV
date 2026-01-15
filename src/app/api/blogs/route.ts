import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET all blogs
export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not configured');
      return NextResponse.json([], { status: 200 });
    }

    try {
      const blogs = await prisma.blog.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      return NextResponse.json(blogs || [], { status: 200 });
    } catch (dbError) {
      console.error('Database error fetching blogs:', dbError);
      return NextResponse.json([], { status: 200 });
    }
  } catch (error) {
    console.error('Error in blogs GET:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// CREATE a new blog
export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ message: 'Database not configured' }, { status: 503 });
    }

    try {
      const { title, author, content, imageUrl } = await request.json();

      if (!title || !author || !content) {
        return NextResponse.json({ message: 'Title, author, and content are required' }, { status: 400 });
      }

      const blog = await prisma.blog.create({
        data: {
          title,
          author,
          content,
          imageUrl,
        },
      });

      revalidatePath('/blogs');

      return NextResponse.json({ message: 'Blog created successfully', blog }, { status: 201 });
    } catch (dbError) {
      console.error('Database error creating blog:', dbError);
      return NextResponse.json({ message: 'Failed to create blog' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
