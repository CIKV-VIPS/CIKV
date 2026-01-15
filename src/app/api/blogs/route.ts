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

    const blogs = await prisma.blog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// CREATE a new blog
export async function POST(request: Request) {
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
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
