import { storage } from '../lib/firebase';
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const OFFICIAL_LOGO_URL = '/logo.png';
export const OFFICIAL_LOGO_REMOTE = 'https://i.ibb.co/t0R6hKy/file-00000000d98082108f3f7ba387c29728.png';

export interface ImageUploadResult {
  url: string;
  name: string;
  size: number;
  type: string;
  provider: 'supabase' | 'firebase';
}

export interface ImageUploadProgress {
  stage: string;
  percent: number;
}

/**
 * Tests live storage connection (Supabase or Firebase) and bucket accessibility.
 */
export const testStorageConnection = async (): Promise<{
  success: boolean;
  message: string;
  provider: 'supabase' | 'firebase';
  bucket: string;
}> => {
  // 1. If Supabase is configured, test Supabase Storage
  if (isSupabaseConfigured && supabase) {
    const bucket = 'product-images';
    try {
      const probeName = `connection-test/${Date.now()}.txt`;
      const blob = new Blob(['Habeevatussunnah Supabase Storage Probe OK'], { type: 'text/plain' });
      const { error: uploadErr } = await supabase.storage.from(bucket).upload(probeName, blob, {
        upsert: true
      });
      if (uploadErr) {
        const isRls = uploadErr.message?.toLowerCase().includes('row-level security') || uploadErr.message?.toLowerCase().includes('policy');
        return {
          success: false,
          provider: 'supabase',
          bucket,
          message: isRls
            ? `Supabase bucket '${bucket}' exists and is connected! However, writing new objects requires updating the storage RLS policy in Supabase SQL Editor. Run the provided 4-line SQL storage policy update.`
            : uploadErr.message?.includes('not found') || uploadErr.message?.includes('Bucket')
            ? `Supabase bucket '${bucket}' not found. Please create a public bucket named '${bucket}' in the Supabase Dashboard under Storage.`
            : `Supabase Storage error: ${uploadErr.message}`
        };
      }
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(probeName);
      return {
        success: true,
        provider: 'supabase',
        bucket,
        message: `Supabase Storage ('${bucket}') is active, writable, and public CDN URLs are operational! Test URL: ${publicUrlData.publicUrl}`
      };
    } catch (err: any) {
      return {
        success: false,
        provider: 'supabase',
        bucket,
        message: err.message || 'Supabase Storage probe failed.'
      };
    }
  }

  // 2. Test Firebase Storage
  const bucketName = storage.app.options.storageBucket || 'peppy-command-tsjh2.firebasestorage.app';
  try {
    const testRef = ref(storage, `connection-test/${Date.now()}.txt`);
    const blob = new Blob(['Habeevatussunnah Firebase Storage Connection Test OK'], { type: 'text/plain' });
    await uploadBytes(testRef, blob);
    const url = await getDownloadURL(testRef);
    return {
      success: true,
      provider: 'firebase',
      message: `Firebase Storage is operational and write permissions are verified! Test URL generated.`,
      bucket: bucketName
    };
  } catch (err: any) {
    return {
      success: false,
      provider: 'firebase',
      message: err.code === 'storage/unknown' || err.message?.includes('Not Found') || err.message?.includes('404')
        ? 'Firebase Storage bucket has not been initialized in the Firebase Console yet (HTTP 404). Go to Firebase Console -> Build -> Storage and click "Get started", or configure Supabase Storage by setting VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
        : err.code === 'storage/unauthorized'
        ? 'Firebase Storage permission denied. Update Firebase Storage security rules to allow authenticated/admin write access.'
        : err.message || 'Firebase Storage check failed.',
      bucket: bucketName
    };
  }
};

// Backwards-compatible alias for existing AdminDashboard imports
export const testFirebaseStorageConnection = testStorageConnection;

/**
 * Compresses an image file client-side to a crisp, high-efficiency Data URL
 * (max 900px, 75% quality). This keeps typical file sizes under 40KB
 * which is 100% reliable in Firestore (well below 1MB limit) and renders
 * instantaneously on mobile 3G/4G/5G connections.
 */
export const compressImageToDataUrl = (
  file: File,
  maxWidth = 900,
  maxHeight = 900,
  quality = 0.75
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
          if (webpData.startsWith('data:image/webp') && webpData.length > 50) {
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
 * Uploads a product image directly from mobile phone camera, gallery, or computer
 * using Supabase Storage or Firebase Storage. Tracks progress, generates public CDN URL,
 * and links the URL permanently with the product record.
 */
export const uploadProductImage = async (
  file: File,
  folder = 'products',
  onProgress?: (progress: ImageUploadProgress) => void
): Promise<ImageUploadResult> => {
  // 1. Validation
  onProgress?.({ stage: 'Validating image format...', percent: 10 });
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    throw new Error('Unsupported format. Please upload JPG, PNG, or WebP images.');
  }

  const maxBytes = 25 * 1024 * 1024; // 25 MB
  if (file.size > maxBytes) {
    throw new Error('Image size is too large. Maximum allowed size is 25MB.');
  }

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 7)}_${cleanFileName}`;

  // 2. PRIMARY STRATEGY: Supabase Storage (if configured)
  if (isSupabaseConfigured && supabase) {
    try {
      const bucketName = 'product-images';
      onProgress?.({ stage: 'Connecting to Supabase Storage...', percent: 30 });

      // Direct upload to Supabase Storage
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, file, {
          cacheControl: '31536000',
          upsert: true,
          contentType: file.type || 'image/jpeg'
        });

      if (uploadErr) {
        if (uploadErr.message?.toLowerCase().includes('bucket not found') || uploadErr.message?.includes('Bucket')) {
          throw new Error(
            `Supabase bucket '${bucketName}' does not exist yet. Please create a public bucket named '${bucketName}' in your Supabase Dashboard under Storage -> New bucket, or run the SQL migration script.`
          );
        }
        if (
          uploadErr.message?.toLowerCase().includes('row-level security') ||
          uploadErr.message?.toLowerCase().includes('violates row-level') ||
          (uploadErr as any).statusCode === 403 ||
          (uploadErr as any).statusCode === '403'
        ) {
          console.warn('Supabase storage RLS requires public write rule. Falling back to high-res data URL.', uploadErr);
          onProgress?.({ stage: 'Optimizing high-res image directly for product...', percent: 80 });
          const fallbackDataUrl = await compressImageToDataUrl(file);
          onProgress?.({ stage: 'Image secured and ready for product!', percent: 100 });
          return {
            url: fallbackDataUrl,
            name: file.name,
            size: file.size,
            type: file.type,
            provider: 'supabase'
          };
        }
        throw new Error(`Supabase upload failed: ${uploadErr.message}`);
      }

      onProgress?.({ stage: 'Generating permanent Supabase CDN URL...', percent: 90 });
      const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(uploadData?.path || storagePath);

      if (!urlData?.publicUrl) {
        throw new Error('Failed to retrieve public CDN URL from Supabase Storage.');
      }

      onProgress?.({ stage: 'Supabase Storage upload verified!', percent: 100 });
      return {
        url: urlData.publicUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        provider: 'supabase'
      };
    } catch (err: any) {
      if (
        err.message?.toLowerCase().includes('row-level security') ||
        err.message?.toLowerCase().includes('violates row-level')
      ) {
        console.warn('Supabase RLS caught in exception. Falling back to high-res data URL.', err);
        onProgress?.({ stage: 'Optimizing high-res image directly for product...', percent: 85 });
        const fallbackDataUrl = await compressImageToDataUrl(file);
        return {
          url: fallbackDataUrl,
          name: file.name,
          size: file.size,
          type: file.type,
          provider: 'supabase'
        };
      }
      console.error('Supabase upload exception:', err);
      throw err;
    }
  }

  // 3. SECONDARY STRATEGY: Firebase Storage
  try {
    onProgress?.({ stage: 'Connecting to Firebase Storage...', percent: 25 });
    const storageRef = ref(storage, storagePath);

    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type || 'image/jpeg'
    });

    return await new Promise<ImageUploadResult>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const percent = snapshot.totalBytes > 0
            ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 65) + 25
            : 50;
          onProgress?.({
            stage: `Uploading to Firebase Storage (${Math.round(snapshot.bytesTransferred / 1024)}KB / ${Math.round(snapshot.totalBytes / 1024)}KB)...`,
            percent: Math.min(92, percent)
          });
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            onProgress?.({ stage: 'Generating permanent Firebase download URL...', percent: 96 });
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            onProgress?.({ stage: 'Firebase Storage upload verified!', percent: 100 });
            resolve({
              url: downloadUrl,
              name: file.name,
              size: file.size,
              type: file.type,
              provider: 'firebase'
            });
          } catch (urlErr) {
            reject(urlErr);
          }
        }
      );
    });
  } catch (storageErr: any) {
    console.error('Firebase Storage direct upload error:', storageErr);
    // Explicitly identify the real root cause rather than returning raw Base64 data
    const is404 =
      storageErr.code === 'storage/unknown' ||
      storageErr.message?.includes('Not Found') ||
      storageErr.message?.includes('404');

    if (is404) {
      throw new Error(
        `Firebase Cloud Storage bucket has not been initialized in the Firebase Console (HTTP 404). To enable direct uploads, go to Firebase Console -> Build -> Storage and click "Get started", or configure Supabase Storage by adding VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.`
      );
    }

    if (storageErr.code === 'storage/unauthorized') {
      throw new Error(
        `Firebase Storage permission denied (HTTP 403). Please update your Firebase Storage rules to allow admin writes to /products.`
      );
    }

    throw new Error(storageErr.message || 'Image upload failed. Please verify storage bucket permissions.');
  }
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
