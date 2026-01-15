import prisma from './prisma';

/**
 * Safe wrapper around Prisma queries that returns empty array on error
 * Prevents server component errors from crashing the page
 */
export async function safeGetUpcomingEvents() {
  try {
    // First check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not configured');
      return [];
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: today,
        },
      },
      orderBy: {
        date: 'asc',
      },
      take: 3,
    });

    return events || [];
  } catch (error) {
    // Log the error for debugging but don't throw
    console.error('Failed to fetch upcoming events:', {
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    
    // Return empty array to allow page to render
    return [];
  }
}

export async function safeGetAllBlogs() {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not configured');
      return [];
    }

    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return blogs || [];
  } catch (error) {
    console.error('Failed to fetch blogs:', {
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return [];
  }
}

export async function safeGetBlogById(id: string) {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not configured');
      return null;
    }

    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    return blog || null;
  } catch (error) {
    console.error('Failed to fetch blog:', {
      message: error instanceof Error ? error.message : String(error),
      id,
      timestamp: new Date().toISOString(),
    });
    return null;
  }
}

export async function safeGetAllEvents() {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not configured');
      return [];
    }

    const events = await prisma.event.findMany({
      orderBy: { date: 'desc' },
    });

    return events || [];
  } catch (error) {
    console.error('Failed to fetch events:', {
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return [];
  }
}

export async function safeGetEventById(id: string) {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not configured');
      return null;
    }

    const event = await prisma.event.findUnique({
      where: { id },
    });

    return event || null;
  } catch (error) {
    console.error('Failed to fetch event:', {
      message: error instanceof Error ? error.message : String(error),
      id,
      timestamp: new Date().toISOString(),
    });
    return null;
  }
}

export async function safeGetAllGalleries() {
  try {
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL not configured');
      return [];
    }

    const galleries = await prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return galleries || [];
  } catch (error) {
    console.error('Failed to fetch galleries:', {
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return [];
  }
}
