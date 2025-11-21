import Image, { ImageProps } from 'next/image';

const getPlaceholderImage = (text?: string) =>
  `https://placehold.co/600x400/6D2828/FFFBEB?text=${encodeURIComponent(text || 'Image')}`;

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

  // Ensure we don't re-spread `src` or `alt` into the Image component —
  // cast `rest` to omit them so TypeScript doesn't consider `src` duplicated.
  return <Image src={safeSrc} alt={alt as string} {...(rest as Omit<ImageProps, 'src' | 'alt'>)} />;
}
