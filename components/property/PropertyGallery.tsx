'use client';

import { Maximize } from 'lucide-react';
import ImageWithFallback from '@/components/ImageWithFallback';

interface PropertyGalleryProps {
  mainPhoto: string | null;
  thumbPhotos: string[];
  title: string;
}

export default function PropertyGallery({ mainPhoto, thumbPhotos, title }: PropertyGalleryProps) {
  if (!mainPhoto) {
    return (
      <div className="aspect-[16/9] rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-300 dark:text-gray-600">
        <Maximize size={64} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      <div className="md:col-span-3 aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        <ImageWithFallback
          src={mainPhoto}
          alt={title}
          className="w-full h-full object-cover"
          fallbackClassName="w-full h-full"
          iconSize={64}
        />
      </div>
      {thumbPhotos.length > 0 && (
        <div className="hidden md:flex flex-col gap-3">
          {thumbPhotos.map((photo, i) => (
            <div
              key={i}
              className="flex-1 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800"
            >
              <ImageWithFallback
                src={photo}
                alt={`Foto ${i + 2}`}
                className="w-full h-full object-cover"
                fallbackClassName="w-full h-full"
                iconSize={32}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
