import { NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

// Ensure this route is treated as dynamic
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { userId, password } = body;

    if (!userId || !password) {
      return NextResponse.json(
        { message: 'User ID and password are required' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { userId },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User ID already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        userId,
        passwordHash,
      },
    });

    return NextResponse.json(
      { message: 'Registration successful', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
