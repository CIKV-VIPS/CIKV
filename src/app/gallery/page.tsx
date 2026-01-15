export const dynamic = "force-dynamic";

import { safeGetAllGalleries } from '@/lib/safe-prisma';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';

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

const AlbumCard = ({ eventName, images }: { eventName: string; images: any[] }) => {
  const coverImage = images[0]?.imageUrl;
  const imageCount = images.length;
  
  const placeholder = `https://placehold.co/600x400/6D2828/FFFBEB?text=${encodeURIComponent(eventName)}`;

  return (
    <Link href={`/gallery/${encodeURIComponent(eventName)}`} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105 cursor-pointer">
      <SafeImage
        src={coverImage || placeholder}
        alt={eventName}
        width={600}
        height={400}
        className="w-full h-56 object-cover"
      />
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-amber-900 mb-2 font-serif">
          {eventName}
        </h3>
        <p className="text-gray-600">
          {imageCount} {imageCount === 1 ? 'Photo' : 'Photos'}
        </p>
      </div>
    </Link>
  );
};

async function getAlbums() {
  const images = await safeGetAllGalleries();

  const albums = images.reduce((acc, image: any) => {
    const key = image.eventName;
    if (!acc.has(key)) {
      acc.set(key, []);
    }
    acc.get(key).push(image);
    return acc;
  }, new Map());

  return albums;
}

export default async function GalleryPage() {
  const albums = await getAlbums();

  return (
    <main className="bg-[#FFFBEB]">
      <PageBanner title="CIKV Gallery" subtitle="Moments from Our Workshops, Seminars, and Events" />

      <section className="container mx-auto px-6 py-20">
        {albums.size > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from(albums.entries()).map(([eventName, images]) => (
              <AlbumCard
                key={eventName}
                eventName={eventName}
                images={images}
              />
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-700 text-center">
            No images have been added to the gallery yet.
          </p>
        )}
      </section>
    </main>
  );
}
