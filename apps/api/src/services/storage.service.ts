import { supabaseClient, BUCKET_NAME } from '../config/supabase';
import { AppError } from '../middleware/error-handler';
import sharp from 'sharp';
import path from 'path';

export interface UploadResult {
  url: string;
  thumbnailUrl: string;
  originalSize: number;
  compressedSize: number;
}

export class StorageService {
  private bucketChecked = false;

  /**
   * Ensures the storage bucket exists in Supabase and is configured with public access.
   */
  private async ensureBucketExists(): Promise<void> {
    if (this.bucketChecked || !supabaseClient || !BUCKET_NAME) return;

    try {
      const { data: bucket, error } = await supabaseClient.storage.getBucket(BUCKET_NAME);

      if (error || !bucket) {
        console.warn(`[StorageService] Bucket "${BUCKET_NAME}" not found in Supabase. Creating public bucket...`);
        const { error: createError } = await supabaseClient.storage.createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: 10 * 1024 * 1024,
        });

        if (createError) {
          console.error(`[StorageService] Failed to create bucket "${BUCKET_NAME}":`, createError.message);
        } else {
          console.log(`[StorageService] Successfully created public bucket "${BUCKET_NAME}".`);
        }
      } else if (!bucket.public) {
        console.warn(`[StorageService] Bucket "${BUCKET_NAME}" is private. Updating to public...`);
        await supabaseClient.storage.updateBucket(BUCKET_NAME, { public: true }).catch(() => {});
      }

      this.bucketChecked = true;
    } catch (err: any) {
      console.error('[StorageService] Error verifying storage bucket:', err?.message || err);
    }
  }

  /**
   * Resizes and compresses an image buffer using Sharp before uploading to Supabase Storage.
   * Exposes only public image URLs and file metrics without leaking internal storage keys/paths.
   */
  async uploadImage(file: Express.Multer.File, folder: string = 'cars'): Promise<UploadResult> {
    if (!file) {
      throw new AppError('No image file provided', 400, 'NO_FILE_PROVIDED');
    }

    const originalSize = file.buffer ? file.buffer.length : 0;
    const isSvg = file.mimetype === 'image/svg+xml';

    if (!supabaseClient || !BUCKET_NAME) {
      throw new AppError(
        'Supabase storage is not configured. Please set SUPABASE_URL, SUPABASE_KEY, and SUPABASE_STORAGE_BUCKET in your .env file.',
        500,
        'STORAGE_NOT_CONFIGURED'
      );
    }

    // Automatically check and create/update bucket in Supabase if missing
    await this.ensureBucketExists();

    try {
      let mainBuffer: Buffer = file.buffer;
      let thumbBuffer: Buffer = file.buffer;
      let contentType = file.mimetype;
      let fileExt = '.webp';

      if (!isSvg) {
        // Compress and resize main image (Max 1920x1080, quality 85)
        mainBuffer = await sharp(file.buffer)
          .resize(1920, 1080, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 85, effort: 4 })
          .toBuffer();

        // Generate thumbnail (Max 480x270, quality 80)
        thumbBuffer = await sharp(file.buffer)
          .resize(480, 270, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 80, effort: 4 })
          .toBuffer();

        contentType = 'image/webp';
      } else {
        fileExt = '.svg';
      }

      const fileBaseName = path.basename(file.originalname, path.extname(file.originalname)).replace(/[^a-zA-Z0-9]/g, '_');
      const timestamp = Date.now();
      const fileName = `${folder}/${timestamp}_${fileBaseName}${fileExt}`;
      const thumbFileName = `${folder}/thumbnails/thumb_${timestamp}_${fileBaseName}${fileExt}`;

      // Upload main compressed image
      const { data: mainData, error: mainError } = await supabaseClient.storage
        .from(BUCKET_NAME)
        .upload(fileName, mainBuffer, {
          contentType,
          upsert: true,
        });

      if (mainError) {
        console.error('[StorageService Upload Error]:', mainError.message);
        throw new AppError(`Failed to upload image to Supabase: ${mainError.message}`, 500, 'STORAGE_UPLOAD_ERROR');
      }

      // Upload thumbnail
      const { data: thumbData } = await supabaseClient.storage
        .from(BUCKET_NAME)
        .upload(thumbFileName, thumbBuffer, {
          contentType,
          upsert: true,
        });

      const { data: mainPublicUrlData } = supabaseClient.storage
        .from(BUCKET_NAME)
        .getPublicUrl(mainData.path);

      const thumbPublicUrl = thumbData
        ? supabaseClient.storage.from(BUCKET_NAME).getPublicUrl(thumbData.path).data.publicUrl
        : mainPublicUrlData.publicUrl;

      return {
        url: mainPublicUrlData.publicUrl,
        thumbnailUrl: thumbPublicUrl,
        originalSize,
        compressedSize: mainBuffer.length,
      };
    } catch (err: any) {
      if (err instanceof AppError) throw err;
      console.error('[StorageService Image Processing Error]:', err?.message || err);
      throw new AppError('Failed to process image file', 500, 'IMAGE_PROCESSING_ERROR');
    }
  }

  /**
   * Helper to extract the relative storage path from a full Supabase public URL or relative path string.
   */
  extractPathFromUrl(urlOrPath: string): string | null {
    if (!urlOrPath) return null;

    if (!urlOrPath.startsWith('http://') && !urlOrPath.startsWith('https://')) {
      return urlOrPath;
    }

    try {
      const parsedUrl = new URL(urlOrPath);
      if (BUCKET_NAME) {
        const marker = `/object/public/${BUCKET_NAME}/`;
        const index = parsedUrl.pathname.indexOf(marker);
        if (index !== -1) {
          return parsedUrl.pathname.substring(index + marker.length);
        }
      }

      const altMarker = '/object/public/';
      const altIndex = parsedUrl.pathname.indexOf(altMarker);
      if (altIndex !== -1) {
        const segments = parsedUrl.pathname.substring(altIndex + altMarker.length).split('/');
        segments.shift(); // remove bucket name segment
        return segments.join('/');
      }
    } catch {
      // Ignore URL parse error
    }

    return null;
  }

  /**
   * Deletes an image and its corresponding thumbnail from the Supabase storage bucket.
   */
  async deleteImage(filePathOrUrl: string): Promise<boolean> {
    if (!supabaseClient || !BUCKET_NAME || !filePathOrUrl) return false;

    const filePath = this.extractPathFromUrl(filePathOrUrl);
    if (!filePath) return false;

    try {
      const { error } = await supabaseClient.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        console.error('[StorageService Delete Error]:', error.message);
      }

      // Also attempt to delete corresponding thumbnail file
      const fileName = path.basename(filePath);
      const dirName = path.dirname(filePath);
      const thumbPath = `${dirName}/thumbnails/thumb_${fileName}`;

      await supabaseClient.storage
        .from(BUCKET_NAME)
        .remove([thumbPath])
        .catch(() => {});

      return !error;
    } catch (err: any) {
      console.error('[StorageService Delete Exception]:', err?.message || err);
      return false;
    }
  }
}
