"use client";

import { useState, useCallback, useRef } from "react";
import {
  Upload,
  X,
  GripVertical,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [touchStartIndex, setTouchStartIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro no upload");
      }

      const data = await res.json();
      return data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no upload");
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
      setUploadProgress(0);

      const newUrls: string[] = [];
      for (let i = 0; i < toUpload.length; i++) {
        const url = await uploadFile(toUpload[i]);
        if (url) newUrls.push(url);
        setUploadProgress(Math.round(((i + 1) / toUpload.length) * 100));
      }

      if (newUrls.length > 0) {
        onChange([...images, ...newUrls]);
      }

      setUploading(false);
      setUploadProgress(0);
    },
    [images, maxImages, onChange, uploadFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);

      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const newImages = [...images];
    const [moved] = newImages.splice(from, 1);
    newImages.splice(to, 0, moved);
    onChange(newImages);
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOverItem = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    moveImage(dragIndex, index);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  // Touch support for mobile reordering
  const handleTouchStart = (index: number) => {
    setTouchStartIndex(index);
  };

  const handleTouchEnd = () => {
    setTouchStartIndex(null);
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
            ? "border-primary-500 bg-primary-50 dark:bg-primary-950"
            : "border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = "";
          }}
          className="hidden"
        />

        {uploading ? (
          <>
            <Loader2
              size={32}
              className="mx-auto text-primary-500 mb-3 animate-spin"
            />
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              Enviando... {uploadProgress}%
            </p>
            <div className="w-48 mx-auto mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </>
        ) : (
          <>
            <Upload size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              Arraste fotos aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-400 mt-1">
              JPG, PNG ou WebP. Max 5MB cada. Ate {maxImages} fotos.
            </p>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 dark:bg-red-950 p-3 rounded-lg">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
        >
          {images.map((url, index) => (
            <div
              key={url}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOverItem(e, index)}
              onDragEnd={handleDragEnd}
              onTouchStart={() => handleTouchStart(index)}
              onTouchEnd={handleTouchEnd}
              className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                dragIndex === index
                  ? "border-primary-500 opacity-50 scale-95"
                  : touchStartIndex === index
                    ? "border-primary-400 ring-2 ring-primary-300"
                    : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Drag handle indicator (top-left) */}
              <div className="absolute top-2 left-2 p-1 bg-black/50 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={14} />
              </div>

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Move Left */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveImage(index, index - 1);
                    }}
                    className="p-1.5 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                    title="Mover para esquerda"
                  >
                    <ChevronLeft size={16} />
                  </button>
                )}

                {/* Remove */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Remover foto"
                >
                  <X size={16} />
                </button>

                {/* Move Right */}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveImage(index, index + 1);
                    }}
                    className="p-1.5 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                    title="Mover para direita"
                  >
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>

              {/* Badge primeira foto */}
              {index === 0 && (
                <span className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
                  📷 Capa
                </span>
              )}

              {/* Position badge */}
              <span className="absolute top-2 right-2 bg-black/60 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500">
        {images.length}/{maxImages} fotos. Arraste para reordenar. A primeira
        sera a capa.
      </p>
    </div>
  );
}
