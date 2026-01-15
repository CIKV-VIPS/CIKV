import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// UPDATE a gallery image by ID
export async function PUT(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ message: 'Database not configured' }, { status: 503 });
    }

    try {
      const { eventName, imageUrl } = await request.json();

      const image = await prisma.galleryImage.update({
        where: { id: parseInt(id, 10) },
        data: {
          eventName,
          imageUrl,
        },
      });

      revalidatePath('/gallery');
      if (eventName) {
        revalidatePath(`/gallery/${eventName}`);
      }

      return NextResponse.json({ message: 'Image updated successfully', image }, { status: 200 });
    } catch (dbError) {
      console.error(`Database error updating gallery image ${id}:`, dbError);
      return NextResponse.json({ message: 'Failed to update image' }, { status: 400 });
    }
  } catch (error) {
    console.error(`Error updating gallery image ${id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE a gallery image by ID
export async function DELETE(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ message: 'Database not configured' }, { status: 503 });
    }

    try {
      const image = await prisma.galleryImage.findUnique({
          where: { id: parseInt(id, 10) },
      });

      await prisma.galleryImage.delete({
        where: { id: parseInt(id, 10) },
      });

      revalidatePath('/gallery');
      if (image && image.eventName) {
          revalidatePath(`/gallery/${image.eventName}`);
      }

      return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
    } catch (dbError) {
      console.error(`Database error deleting gallery image ${id}:`, dbError);
      return NextResponse.json({ message: 'Failed to delete image' }, { status: 400 });
    }
  } catch (error) {
    console.error(`Error deleting gallery image ${id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
