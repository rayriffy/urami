import fs from "node:fs";
import path from "node:path";
import { getExtension } from "./getExtension.js";

// Cache extension lookups
const extensionCache = new Map<string, string>();

// Track pending writes to avoid directory contention
const pendingDirectories = new Set<string>();

/**
 * Optimized function to write image data to filesystem cache
 */
export const writeImageToFileSystem = async (
  cacheKey: string,
  contentType: string,
  maxAge: number,
  etag: string,
  buffer: Buffer,
  cacheDirectory: string,
): Promise<void> => {
  // Get file extension by content type (with caching)
  let extension = extensionCache.get(contentType);
  if (!extension) {
    extension = getExtension(contentType) || 'bin'; // Fallback to binary extension
    extensionCache.set(contentType, extension);
  }

  // Build final file path
  const targetDirectory = path.join(cacheDirectory, cacheKey);
  const expireAt = maxAge + Date.now();
  const targetFileName = `${maxAge}.${expireAt}.${etag}.${extension}`;
  const targetFilePath = path.join(targetDirectory, targetFileName);

  // Acquire directory lock
  if (pendingDirectories.has(targetDirectory)) {
    // Wait for other writes to complete
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  pendingDirectories.add(targetDirectory);
  
  try {
    // Use directory creation with concurrent safety
    await fs.promises.mkdir(targetDirectory, { recursive: true });
    
    // Clean up expired files (don't await - let it happen in background)
    cleanExpiredFiles(targetDirectory).catch(() => {});
    
    // Write current file
    await fs.promises.writeFile(targetFilePath, buffer);
    
    return;
  } catch (err) {
    // If write fails, clean up
    try {
      await fs.promises.access(targetFilePath);
      await fs.promises.rm(targetFilePath);
    } catch {
      // File doesn't exist or can't be deleted, ignore
    }
    
    // Log error but don't fail the request
    console.error("Cache write error:", err);
  } finally {
    // Release directory lock
    pendingDirectories.delete(targetDirectory);
  }
};

/**
 * Helper to clean up expired files in a directory
 */
async function cleanExpiredFiles(directory: string): Promise<void> {
  try {
    const now = Date.now();
    const files = await fs.promises.readdir(directory);
    
    // Process at most 10 files to avoid blocking
    const filesToProcess = files.slice(0, 10);
    
    const deletionPromises = filesToProcess.map(async (file) => {
      try {
        // Extract expiration time from filename (second segment)
        const expireAtString = file.split(".")[1];
        const expireAt = Number(expireAtString);
        
        if (isNaN(expireAt) || expireAt < now) {
          // Delete expired or invalid files
          await fs.promises.rm(path.join(directory, file));
        }
      } catch {
        // Ignore errors for individual files
      }
    });
    
    await Promise.all(deletionPromises);
  } catch {
    // Ignore directory errors
  }
}
