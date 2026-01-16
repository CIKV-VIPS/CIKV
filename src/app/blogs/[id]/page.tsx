// Force dynamic rendering - no static caching
export const revalidate = 0;
export const dynamic = "force-dynamic";

import { safeGetBlogById } from '@/lib/safe-prisma';
import SafeImage from '@/components/SafeImage';
import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi';

const getPlaceholderImage = (title: string) => {
  return `https://placehold.co/1200x600/6D2828/FFFBEB?text=${encodeURIComponent(title)}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

async function getBlog(id: string) {
  const blog = await safeGetBlogById(id);
  return blog;
}

interface BlogPageProps {
  params: any;
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const blog = await getBlog(params.id);

  if (!blog) {
    return (
      <main className="bg-[#FFFBEB] min-h-screen py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold text-red-600">Blog post not found.</h2>
          <Link
            href="/blogs"
            className="mt-6 inline-flex items-center text-lg text-amber-800 hover:text-amber-600 font-semibold"
          >
            <HiArrowLeft className="mr-2" />
            Back to all posts
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FFFBEB] py-12 md:py-20">
      <div className="container mx-auto px-6">
        <Link
          href="/blogs"
          className="mb-8 inline-flex items-center text-lg text-amber-800 hover:text-amber-600 font-semibold"
        >
          <HiArrowLeft className="mr-2" />
          Back to all posts
        </Link>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
          <SafeImage
            src={blog.imageUrl || getPlaceholderImage(blog.title)}
            alt={blog.title}
            width={1200}
            height={600}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="p-6 md:p-10">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4 font-serif">
              {blog.title}
            </h1>

            <div className="mb-6 text-gray-600 text-lg">
              By <span className="font-semibold text-amber-800">{blog.author}</span> on {formatDate(blog.createdAt.toISOString())}
            </div>
            
            <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
