import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Disable caching for fresh data
export const revalidate = 0;

// GET all gallery images
export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not configured');
      return NextResponse.json([], { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        }
      });
    }

    try {
      const images = await prisma.galleryImage.findMany({
        orderBy: {
          uploadedAt: 'desc',
        },
      });
      return NextResponse.json(images || [], { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        }
      });
    } catch (dbError) {
      console.error('Database error fetching gallery:', dbError);
      return NextResponse.json([], { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
        }
      });
    }
  } catch (error) {
    console.error('Error in gallery GET:', error);
    return NextResponse.json([], { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      }
    });
  }
}

// CREATE a new gallery image
export async function POST(request: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ message: 'Database not configured' }, { status: 503 });
    }

    try {
      const { eventName, imageUrl } = await request.json();

      if (!eventName || !imageUrl) {
        return NextResponse.json({ message: 'Event name and image URL are required' }, { status: 400 });
      }

      const image = await prisma.galleryImage.create({
        data: {
          eventName,
          imageUrl,
        },
      });

      revalidatePath('/');
      revalidatePath('/gallery');

      return NextResponse.json({ message: 'Image added successfully', image }, { status: 201 });
    } catch (dbError) {
      console.error('Database error creating gallery image:', dbError);
      return NextResponse.json({ message: 'Failed to add image' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
