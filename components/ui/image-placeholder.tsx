'use client';

import { cn } from '@/lib/utils';
import { Image as ImageIcon } from 'lucide-react';

interface ImagePlaceholderProps {
  aspectRatio?: 'square' | 'video' | 'wide' | 'portrait';
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const aspectRatios = {
  square: 'aspect-square',
  video: 'aspect-video',
  wide: 'aspect-[21/9]',
  portrait: 'aspect-[3/4]',
};

const sizes = {
  sm: 'h-6 w-6',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
};

export function ImagePlaceholder({
  aspectRatio = 'video',
  label,
  className,
  size = 'md',
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center rounded-lg bg-muted/50 border-2 border-dashed border-muted-foreground/25',
        aspectRatios[aspectRatio],
        className
      )}
    >
      <ImageIcon className={cn('text-muted-foreground/40', sizes[size])} />
      {label && (
        <span className="mt-2 text-xs text-muted-foreground/60 text-center px-4">{label}</span>
      )}
    </div>
  );
}
