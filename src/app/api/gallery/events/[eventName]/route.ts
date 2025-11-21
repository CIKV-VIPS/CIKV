import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET images by event name
export async function GET(request: NextRequest, context: any) {
  const { eventName } = context.params;
  try {
    const images = await prisma.galleryImage.findMany({
      where: {
        eventName: eventName,
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error(`Error fetching images for event ${eventName}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
