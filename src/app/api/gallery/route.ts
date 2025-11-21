import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET all gallery images
export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: {
        uploadedAt: 'desc',
      },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// CREATE a new gallery image
export async function POST(request: Request) {
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

    revalidatePath('/gallery');

    return NextResponse.json({ message: 'Image added successfully', image }, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
