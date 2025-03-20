import { AVIF, GIF, JPEG, PNG, SVG, WEBP } from "../constants/mimeTypes.js";

// Type signatures for more efficient comparison
const JPEG_SIG = [0xff, 0xd8, 0xff];
const PNG_SIG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const GIF_SIG = [0x47, 0x49, 0x46, 0x38];
const WEBP_SIG = [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50];
const SVG_SIG = [0x3c, 0x3f, 0x78, 0x6d, 0x6c];
const AVIF_SIG = [0, 0, 0, 0, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66];

// Create a content type detection cache (using first 16 bytes as key)
const typeCache = new Map<string, string | null>();

export const detectContentType = (buffer: Buffer): string | null => {
  // Ensure buffer is not empty
  if (!buffer || buffer.length === 0) {
    return null;
  }

  // Use first 16 bytes as cache key
  const bytesToCheck = Math.min(16, buffer.length);
  const cacheKey = Array.from(buffer.slice(0, bytesToCheck)).toString();
  
  // Check cache first
  if (typeCache.has(cacheKey)) {
    return typeCache.get(cacheKey) || null;
  }
  
  let result: string | null = null;

  // First check for JPEG (most common format) with early return if match
  if (buffer.length >= 3 && 
      buffer[0] === JPEG_SIG[0] && 
      buffer[1] === JPEG_SIG[1] && 
      buffer[2] === JPEG_SIG[2]) {
    result = JPEG;
  }
  // PNG check
  else if (buffer.length >= PNG_SIG.length && 
      PNG_SIG.every((b, i) => buffer[i] === b)) {
    result = PNG;
  }
  // GIF check
  else if (buffer.length >= GIF_SIG.length && 
      GIF_SIG.every((b, i) => buffer[i] === b)) {
    result = GIF;
  }
  // WEBP check - special handling for wildcard bytes
  else if (buffer.length >= WEBP_SIG.length && 
      WEBP_SIG.every((b, i) => b === 0 || buffer[i] === b)) {
    result = WEBP;
  }
  // SVG check
  else if (buffer.length >= SVG_SIG.length && 
      SVG_SIG.every((b, i) => buffer[i] === b)) {
    result = SVG;
  }
  // AVIF check - special handling for wildcard bytes
  else if (buffer.length >= AVIF_SIG.length && 
      AVIF_SIG.every((b, i) => b === 0 || buffer[i] === b)) {
    result = AVIF;
  }

  // Cache the result
  typeCache.set(cacheKey, result);
  
  // Limit cache size to prevent memory leaks
  if (typeCache.size > 1000) {
    const firstKey = typeCache.keys().next().value;
    if (firstKey) {
      typeCache.delete(firstKey);
    }
  }
  
  return result;
};
