import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


// GET all blogs
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
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

    return NextResponse.json({ message: 'Blog created successfully', blog }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
