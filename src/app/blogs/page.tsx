export const dynamic = "force-dynamic";

import prisma from '@/lib/prisma';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';

const getPlaceholderImage = (title: string) => {
  return `https://placehold.co/600x400/6D2828/FFFBEB?text=${encodeURIComponent(title)}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

const PageBanner = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <section 
      className="relative bg-cover bg-center h-[30vh]" 
      style={{ backgroundImage: `url(/assets/cikv_banner2.png)` }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="container relative z-10 mx-auto px-6 h-full flex flex-col justify-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white font-serif shadow-sm">
          {title}
        </h1>
        {subtitle && (
          <p className="text-2xl text-white mt-2 shadow-sm">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

const BlogCard = ({ blog }: { blog: any }) => {
  const { id, title, author, content, imageUrl, createdAt } = blog;

  return (
    <div className="bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105">
      <SafeImage
        src={imageUrl || getPlaceholderImage(title)}
        alt={title}
        width={600}
        height={400}
        className="w-full h-48 object-cover"
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-semibold text-amber-900 mb-3 font-serif">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          By <span className="font-medium text-amber-800">{author}</span> | {formatDate(createdAt)}
        </p>
        <p className="text-sm leading-relaxed mb-5 flex-grow">
          {content.substring(0, 120)}...
        </p>
        <Link
          href={`/blogs/${id}`}
          className="mt-auto inline-block text-amber-800 hover:text-amber-600 font-bold self-start"
        >
          Read More &rarr;
        </Link>
      </div>
    </div>
  );
};

async function getBlogs() {
  const blogs = await prisma.blog.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return blogs;
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <main className="bg-[#FFFBEB]">
      <PageBanner title="CIKV Blog" subtitle="Reflections, Teachings, and Insights" />

      <section className="container mx-auto px-6 py-20">
        {blogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-700 text-center">
            No blog posts have been published yet. Please check back soon!
          </p>
        )}
      </section>
    </main>
  );
}
