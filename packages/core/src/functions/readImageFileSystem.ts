import fs from "node:fs";
import path from "node:path";

import { detectContentType } from "./detectContentType.js";

import type { ResponsePayload } from "../@types/ResponsePayload.js";

// A simple in-memory cache for faster repeated lookups
const cacheMap = new Map<string, {
  filePath: string;
  etag: string;
  maxAge: number;
  expireAt: number;
  contentType?: string;
}>();

// Cleanup expired cache entries periodically (every 10 minutes)
const CLEANUP_INTERVAL = 10 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cacheMap.entries()) {
    if (entry.expireAt < now) {
      cacheMap.delete(key);
    }
  }
}, CLEANUP_INTERVAL);

export const readImageFileSystem = async (
  cacheKey: string,
  cacheDirectory: string,
): Promise<ResponsePayload | null> => {
  const now = Date.now();

  // Check in-memory cache first
  const cachedInfo = cacheMap.get(cacheKey);
  if (cachedInfo && cachedInfo.expireAt > now) {
    try {
      // Fast path - use cached file info
      const buffer = await fs.promises.readFile(cachedInfo.filePath);
      return {
        buffer,
        etag: cachedInfo.etag,
        maxAge: cachedInfo.maxAge,
        contentType: cachedInfo.contentType || detectContentType(buffer),
      };
    } catch {
      // If file read fails, invalidate cache and continue to slow path
      cacheMap.delete(cacheKey);
    }
  }

  // Slow path - read directory and find matching file
  try {
    const requestedDirectory = path.join(cacheDirectory, cacheKey);
    const files = await fs.promises.readdir(requestedDirectory);

    // Sort files by mtime (oldest first) if we have more than one
    if (files.length > 1) {
      const fileStats = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(requestedDirectory, file);
          const stats = await fs.promises.stat(filePath);
          return { file, mtime: stats.mtime };
        })
      );
      files.sort((a, b) => {
        const statsA = fileStats.find(stat => stat.file === a);
        const statsB = fileStats.find(stat => stat.file === b);
        return (statsA?.mtime?.getTime() || 0) - (statsB?.mtime?.getTime() || 0);
      });
    }

    // Process files (oldest first, to clean up old ones before returning newer ones)
    const deletionPromises: Promise<void>[] = [];
    
    for (const file of files) {
      const [maxAgeString, expireAtString, etag, extension] = file.split(".");
      const filePath = path.join(requestedDirectory, file);
      const expireAt = Number(expireAtString);
      const maxAge = Number(maxAgeString);

      if (expireAt < now) {
        // Collect deletion promises but don't await them yet
        deletionPromises.push(fs.promises.rm(filePath).catch(() => {}));
        continue;
      }

      // Read the file
      try {
        const buffer = await fs.promises.readFile(filePath);
        const contentType = detectContentType(buffer);
        
        // Update the cache map with this file's info
        cacheMap.set(cacheKey, {
          filePath,
          etag,
          maxAge,
          expireAt,
          contentType: contentType || undefined
        });

        // Run deletions in background
        if (deletionPromises.length > 0) {
          Promise.all(deletionPromises).catch(() => {});
        }

        return {
          buffer,
          etag,
          maxAge,
          contentType,
        };
      } catch (err) {
        // If we can't read this file, try the next one
        continue;
      }
    }

    // Run any pending deletions
    if (deletionPromises.length > 0) {
      Promise.all(deletionPromises).catch(() => {});
    }
  } catch (err) {
    // Directory doesn't exist or can't be read
  }

  return null;
};
