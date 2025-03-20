import sharp from "sharp";

import { AVIF, JPEG, PNG, WEBP } from "../constants/mimeTypes.js";

// Create a singleton sharp instance for metadata extraction
// to avoid repeated initialization costs
let sharpInstance: sharp.Sharp | null = null;

// Cache metadata by buffer hash (for repeatedly processed images)
const metadataCache = new Map<string, sharp.Metadata>();

// Helper for getting image metadata efficiently
const getImageMetadata = async (buffer: Buffer, bufferHash: string): Promise<sharp.Metadata> => {
  // Check cache first
  const cachedMetadata = metadataCache.get(bufferHash);
  if (cachedMetadata) return cachedMetadata;
  
  // Get metadata
  if (!sharpInstance) {
    sharpInstance = sharp(buffer);
  } else {
    sharpInstance.removeAlpha().withMetadata();
    sharpInstance = sharp(buffer);
  }
  
  const metadata = await sharpInstance.metadata();
  
  // Cache metadata
  metadataCache.set(bufferHash, metadata);
  
  // Limit cache size to 1000 entries to prevent memory leaks
  if (metadataCache.size > 1000) {
    const firstKey = metadataCache.keys().next().value;
    if (firstKey) {
      metadataCache.delete(firstKey);
    }
  }
  
  return metadata;
};

export const optimizeImage = async (
  buffer: Buffer,
  contentType: string,
  quality: number,
  width: number,
  height?: number,
  bufferHash?: string, // Pass in hash if already calculated
) => {
  try {
    // Begin sharp transformation logic
    const transformer = sharp(buffer, {
      failOnError: false, // More resilient to slightly corrupted images
    });

    transformer.rotate();

    // Only check metadata if we need to
    if (!height && width > 0) {
      const metadata = await getImageMetadata(buffer, bufferHash || "");
      
      // Only resize if needed - this prevents unnecessary processing
      if (metadata.width && metadata.width > width) {
        transformer.resize(width);
      }
    } else if (height && width) {
      transformer.resize(width, height);
    }

    // Dynamically apply the right format
    switch (contentType) {
      case AVIF:
        if (transformer.avif) {
          const avifQuality = quality - 15;
          transformer.avif({
            quality: Math.max(avifQuality, 0),
            chromaSubsampling: "4:2:0", // same as webp
          });
        } else {
          transformer.webp({ quality });
        }
        break;
      case WEBP:
        transformer.webp({ quality });
        break;
      case PNG:
        transformer.png({ quality });
        break;
      case JPEG:
      default:
        transformer.jpeg({ quality });
        break;
    }

    return transformer.toBuffer();
  } catch (err) {
    console.error("Image optimization failed:", err);
    return null;
  }
};
