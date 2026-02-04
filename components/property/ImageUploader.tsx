'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, GripVertical, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro no upload');
      }

      const data = await res.json();
      return data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no upload');
      return null;
    }
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remaining = maxImages - images.length;

      if (remaining <= 0) {
        setError(`Maximo de ${maxImages} fotos.`);
        return;
      }

      const toUpload = fileArray.slice(0, remaining);
      setError(null);
      setUploading(true);

      const results = await Promise.all(toUpload.map(uploadFile));
      const newUrls = results.filter((url): url is string => url !== null);

      if (newUrls.length > 0) {
        onChange([...images, ...newUrls]);
      }

      setUploading(false);
    },
    [images, maxImages, onChange, uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOverItem = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const newImages = [...images];
    const [moved] = newImages.splice(dragIndex, 1);
    newImages.splice(index, 0, moved);
    onChange(newImages);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = '';
          }}
          className="hidden"
        />

        <Upload size={32} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600 font-medium">
          {uploading ? 'Enviando...' : 'Arraste fotos aqui ou clique para selecionar'}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          JPG, PNG ou WebP. Max 5MB cada. Ate {maxImages} fotos.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div
              key={url}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOverItem(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                dragIndex === index
                  ? 'border-primary-500 opacity-50'
                  : 'border-gray-200'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>

                <div className="absolute top-2 left-2 p-1 bg-white/80 rounded text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                  <GripVertical size={14} />
                </div>
              </div>

              {/* Badge primeira foto */}
              {index === 0 && (
                <span className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                  Capa
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">
        {images.length}/{maxImages} fotos. Arraste para reordenar. A primeira sera a capa.
      </p>
    </div>
  );
}
