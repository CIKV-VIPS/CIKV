import { NextRequest, NextResponse } from 'next/server';


// GET a single form by ID
export async function GET(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    const form = await prisma.form.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!form) {
      return NextResponse.json({ message: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error(`Error fetching form ${id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// UPDATE a form by ID (protected route, logic to be added in middleware)
export async function PUT(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    const { title, googleFormLink, status } = await request.json();

    const form = await prisma.form.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        googleFormLink,
        status,
      },
    });

    return NextResponse.json({ message: 'Form updated successfully', form });
  } catch (error) {
    console.error(`Error updating form ${id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE a form by ID (protected route, logic to be added in middleware)
export async function DELETE(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    await prisma.form.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ message: 'Form deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting form ${id}:`, error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
