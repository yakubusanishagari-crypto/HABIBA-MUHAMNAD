import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Star,
  RefreshCw,
  Plus,
  Link as LinkIcon,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { uploadProductImage } from '../utils/imageUpload';

interface ProductImageUploaderProps {
  images: string[];
  mainImage: string;
  onChange: (images: string[], mainImage: string) => void;
  maxImages?: number;
}

export const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  images,
  mainImage,
  onChange,
  maxImages = 8
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // Normalize image list ensuring mainImage is present
  const allImages = React.useMemo(() => {
    const list = [...images];
    if (mainImage && !list.includes(mainImage)) {
      list.unshift(mainImage);
    }
    return list;
  }, [images, mainImage]);

  // Handle direct file uploads (from computer or mobile phone)
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(file => uploadProductImage(file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(r => r.url);

      const combined = [...allImages, ...newUrls].slice(0, maxImages);
      const newMain = mainImage || combined[0] || '';

      onChange(combined, newMain);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setUploadError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle image replacement
  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || replacingIndex === null) return;
    setUploadError(null);
    setIsUploading(true);

    try {
      const result = await uploadProductImage(files[0]);
      const updated = [...allImages];
      const oldUrl = updated[replacingIndex];
      updated[replacingIndex] = result.url;

      const newMain = mainImage === oldUrl ? result.url : mainImage;
      onChange(updated, newMain);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to replace image.');
    } finally {
      setIsUploading(false);
      setReplacingIndex(null);
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  // Set as primary image
  const handleSetPrimary = (url: string) => {
    const updated = [url, ...allImages.filter(u => u !== url)];
    onChange(updated, url);
  };

  // Remove image
  const handleRemove = (index: number) => {
    const targetUrl = allImages[index];
    const updated = allImages.filter((_, i) => i !== index);
    const newMain = targetUrl === mainImage ? (updated[0] || '') : mainImage;
    onChange(updated, newMain);
  };

  // Add manual URL
  const handleAddManualUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    const url = manualUrl.trim();
    if (!allImages.includes(url)) {
      const updated = [...allImages, url].slice(0, maxImages);
      const newMain = mainImage || updated[0];
      onChange(updated, newMain);
    }
    setManualUrl('');
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        multiple
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleReplaceFile}
      />

      {/* Upload Zone / Drop Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group ${
          isUploading
            ? 'border-emerald-400 bg-emerald-50/50'
            : 'border-emerald-200 hover:border-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/70'
        }`}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white shadow-md border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div>
            <p className="text-sm font-bold text-slate-800">
              {isUploading ? (
                <span className="text-emerald-700">Uploading & Optimizing image...</span>
              ) : (
                <>
                  <span className="text-emerald-700 underline font-black">Click to upload from phone or computer</span>{' '}
                  or drag & drop
                </>
              )}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports <strong className="text-slate-700">JPG, PNG, WebP</strong> up to 12MB. You can select multiple photos at once.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Direct Phone Camera & Gallery
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-amber-600" />
              Auto-Persistent
            </span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {uploadError && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Action utilities bar: Add URL fallback, image counter */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700">
          Product Images ({allImages.length}/{maxImages})
        </span>

        <button
          type="button"
          onClick={() => setShowUrlInput(prev => !prev)}
          className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3.5 h-3.5" />
          {showUrlInput ? 'Hide URL input' : 'Or paste image link'}
        </button>
      </div>

      {/* Manual URL Input dropdown */}
      {showUrlInput && (
        <form onSubmit={handleAddManualUrl} className="flex gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <input
            type="url"
            value={manualUrl}
            onChange={e => setManualUrl(e.target.value)}
            placeholder="Paste direct image link (e.g. https://... or Unsplash)"
            className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Add Link
          </button>
        </form>
      )}

      {/* Image Previews Gallery Grid */}
      {allImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {allImages.map((imgUrl, index) => {
            const isPrimary = imgUrl === mainImage || (index === 0 && !mainImage);

            return (
              <div
                key={`${imgUrl}-${index}`}
                className={`relative group rounded-xl overflow-hidden border-2 bg-slate-900 transition-all ${
                  isPrimary
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
                    : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                {/* Thumbnail */}
                <div className="aspect-square w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                  <img
                    src={imgUrl}
                    alt={`Product preview ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                </div>

                {/* Primary Tag */}
                {isPrimary ? (
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1 z-10">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Primary</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(imgUrl)}
                    className="absolute top-2 left-2 bg-slate-900/80 hover:bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                    title="Set as main display image"
                  >
                    Set Primary
                  </button>
                )}

                {/* Overlay actions (Replace, Delete) */}
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10">
                  <button
                    type="button"
                    onClick={() => {
                      setReplacingIndex(index);
                      replaceInputRef.current?.click();
                    }}
                    className="p-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-md text-[11px] font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                    title="Replace with another image"
                  >
                    <RefreshCw className="w-3 h-3 text-slate-700" />
                    <span className="text-[10px]">Replace</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-md shadow-sm transition-colors cursor-pointer"
                    title="Remove this image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <p className="text-xs text-slate-500 font-medium">
            No images uploaded yet. Upload at least one product photo so customers can view it in the storefront.
          </p>
        </div>
      )}
    </div>
  );
};
