import Image, { ImageProps } from 'next/image';

const getPlaceholderImage = (text?: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect fill='%236D2828' width='600' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='%23FFFBEB' text-anchor='middle' dominant-baseline='middle'%3E${encodeURIComponent(text || 'Image')}%3C/text%3E%3C/svg%3E`;

const isValidImageSrc = (src?: string | null) => {
  if (!src || typeof src !== 'string') return false;
  const trimmed = src.trim();
  return /^https?:\/\//i.test(trimmed) || /^data:/i.test(trimmed) || trimmed.startsWith('/');
};

export default function SafeImage(props: ImageProps) {
  const { src, alt, ...rest } = props as any;
  let srcStr = '';

  if (typeof src === 'string') srcStr = src;
  else if (src && typeof src === 'object' && typeof src.src === 'string') srcStr = src.src;

  const safeSrc = isValidImageSrc(srcStr) ? srcStr : getPlaceholderImage(typeof alt === 'string' ? alt : undefined);

  // Use unoptimized for external images to avoid 400 errors
  const unoptimized = /^https?:\/\//.test(safeSrc) && !safeSrc.startsWith('data:');

  // Ensure we don't re-spread `src` or `alt` into the Image component —
  // cast `rest` to omit them so TypeScript doesn't consider `src` duplicated.
  return <Image src={safeSrc} alt={alt as string} unoptimized={unoptimized} {...(rest as Omit<ImageProps, 'src' | 'alt'>)} />;
}
