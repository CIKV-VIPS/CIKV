import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// GET a single blog by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error(`Error fetching blog ${id}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}

// UPDATE a blog by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ message: 'Database not configured' }, { status: 503 });
    }

    try {
      const { title, author, content, imageUrl } = await request.json();

      const blog = await prisma.blog.update({
        where: { id },
        data: {
          title,
          author,
          content,
          imageUrl,
        },
      });

      revalidatePath("/blogs");
      revalidatePath(`/blogs/${id}`);

      return NextResponse.json({ message: "Blog updated successfully", blog }, { status: 200 });
    } catch (dbError) {
      console.error(`Database error updating blog ${id}:`, dbError);
      return NextResponse.json({ message: "Failed to update blog" }, { status: 400 });
    }
  } catch (error) {
    console.error(`Error updating blog ${id}:`, error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE a blog by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ message: 'Database not configured' }, { status: 503 });
    }

    try {
      await prisma.blog.delete({
        where: { id },
      });

      revalidatePath("/blogs");

      return NextResponse.json(
        { message: "Blog deleted successfully" },
        { status: 200 }
      );
    } catch (dbError) {
      console.error(`Database error deleting blog ${id}:`, dbError);
      return NextResponse.json({ message: "Failed to delete blog" }, { status: 400 });
    }
  } catch (error) {
    console.error(`Error deleting blog ${id}:`, error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 }  error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
