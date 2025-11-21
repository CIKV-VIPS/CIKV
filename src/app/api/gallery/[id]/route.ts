import { NextRequest, NextResponse } from 'next/server';


// UPDATE a gallery image by ID
export async function PUT(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    const { eventName, imageUrl } = await request.json();

    const image = await prisma.galleryImage.update({
      where: { id: parseInt(id, 10) },
      data: {
        eventName,
        imageUrl,
      },
    });

    return NextResponse.json({ message: 'Image updated successfully', image });
  } catch (error) {
    console.error(`Error updating gallery image ${id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE a gallery image by ID
export async function DELETE(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    await prisma.galleryImage.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting gallery image ${id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
