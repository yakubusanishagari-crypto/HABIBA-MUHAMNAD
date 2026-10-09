import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const OFFICIAL_LOGO_URL = '/logo.png';
export const OFFICIAL_LOGO_REMOTE = 'https://i.ibb.co/t0R6hKy/file-00000000d98082108f3f7ba387c29728.png';

export interface ImageUploadResult {
  url: string;
  name: string;
  size: number;
  type: string;
}

/**
 * Compresses an image file client-side to an optimized base64 Data URL
 * to guarantee instantaneous, 100% reliable local persistence even if
 * Supabase storage is not yet provisioned or network is intermittent.
 */
export const compressImageToDataUrl = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try webp first if supported, fallback to jpeg
        try {
          const webpData = canvas.toDataURL('image/webp', quality);
          if (webpData.startsWith('data:image/webp')) {
            resolve(webpData);
            return;
          }
        } catch {
          // fallback
        }

        const jpegData = canvas.toDataURL('image/jpeg', quality);
        resolve(jpegData);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads a product image directly from mobile phone or computer.
 * Attempts upload to Supabase Storage first; if Supabase is unconfigured
 * or bucket is unavailable, seamlessly falls back to persistent client-side data URL.
 */
export const uploadProductImage = async (
  file: File,
  folder = 'products'
): Promise<ImageUploadResult> => {
  // 1. Validation
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    throw new Error('Unsupported format. Please upload JPG, PNG, or WebP images.');
  }

  const maxBytes = 12 * 1024 * 1024; // 12 MB
  if (file.size > maxBytes) {
    throw new Error('Image size is too large. Maximum allowed size is 12MB.');
  }

  // 2. Try Firebase Storage first
  try {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 7)}_${cleanFileName}`;
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file, { contentType: file.type });
    const downloadUrl = await getDownloadURL(storageRef);
    if (downloadUrl) {
      return {
        url: downloadUrl,
        name: file.name,
        size: file.size,
        type: file.type
      };
    }
  } catch (fbErr) {
    console.warn('Firebase Storage upload notice, checking alternative store:', fbErr);
  }

  // 3. Try Supabase Storage if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 7)}_${cleanFileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(data.path);

        if (publicUrlData?.publicUrl) {
          return {
            url: publicUrlData.publicUrl,
            name: file.name,
            size: file.size,
            type: file.type
          };
        }
      } else {
        console.warn('Supabase storage upload returned error, falling back to local persistent store:', error);
      }
    } catch (err) {
      console.warn('Supabase storage exception, falling back to local persistent store:', err);
    }
  }

  // 3. Fallback: Compress and convert to persistent high-quality Data URL
  const compressedDataUrl = await compressImageToDataUrl(file);
  return {
    url: compressedDataUrl,
    name: file.name,
    size: file.size,
    type: file.type
  };
};

/**
 * Loads an image from a URL or relative path and returns base64 Data URL for jsPDF
 */
export const loadImageAsDataUrl = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If already data URL, resolve immediately
    if (src.startsWith('data:')) {
      resolve(src);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      try {
        const dataUrl = canvas.toDataURL('image/png');
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error(`Failed to load image from ${src}`));
    img.src = src;
  });
};
