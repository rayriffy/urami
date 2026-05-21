import path from "node:path";
import { URL } from "node:url";
import isAnimated from "is-animated";
import { defineCacheInstance } from "@rayriffy/filesystem";

import { AVIF, JPEG, WEBP } from "./constants/mimeTypes.js";
import { animateableTypes } from "./constants/animateableTypes.js";
import { defaultConfig } from "./constants/defaultConfig.js";
import { vectorTypes } from "./constants/vectorTypes.js";

import { detectContentType } from "./functions/detectContentType.js";
import { error } from "./functions/error.js";
import { getExtension } from "./functions/getExtension.js";
import { getHash } from "./functions/getHash.js";
import { getMaxAge } from "./functions/getMaxAge.js";
import { optimizeImage } from "./functions/optimizeImage.js";
import { sendResponse } from "./functions/sendResponse.js";

import type { Config } from "./@types/Config.js";
import type { ResponsePayload } from "./@types/ResponsePayload.js";
import type { RequestHandler } from "./@types/RequestHandler.js";

export const createRequestHandler =
  (config: Partial<Config> = {}): RequestHandler => {
    // build general config
    const mergedConfig = {
      ...defaultConfig,
      ...config,
    };
    const targetCacheDirectory = path.join(
      process.cwd(),
      mergedConfig.storePath,
    );

    const cache = defineCacheInstance({
      cacheDirectory: targetCacheDirectory,
    });

    return async (request) => {
      // Get If-None-Match header early for consistent use
      const ifNoneMatch = request.headers.get("If-None-Match");

      try {
        // parse variables
        const fullRequestUrl = new URL(request.url);
        let url = fullRequestUrl.searchParams.get("url") ?? "";
        let width = Number(fullRequestUrl.searchParams.get("w") ?? "");
        const quality = Number(fullRequestUrl.searchParams.get("q") ?? "");
        const format = fullRequestUrl.searchParams.get("format") ?? "";

        // Ensure width is within the allowed sizes to prevent DOS attacks
        if (width > 0) {
          const allSizes = [
            16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048,
            3840,
          ];
          width = allSizes.find((p) => p >= width) || allSizes[allSizes.length - 1];
        }

        // Get URL target domain from referer or config
        let targetUrl: URL;
        let targetDomain: string | null = null;
        
        try {
          // Try to parse as an absolute URL first
          targetUrl = new URL(url);
        } catch {
          // If not absolute, construct using defaultDomain or referer
          targetDomain = mergedConfig.defaultDomain ?? request.headers.get("referer");
          if (!targetDomain) throw error(400, "missing url");
          
          try {
            targetUrl = new URL(url, targetDomain);
          } catch {
            throw error(400, "invalid url");
          }
        }
        
        // Normalize URL for consistent caching
        url = targetUrl.toString();
        const hostname = targetUrl.hostname;

        // Check domain permissions in one step
        const remoteDomainAllowed = !mergedConfig.remoteDomains || 
                                    mergedConfig.remoteDomains.includes(hostname);
        
        if (!remoteDomainAllowed) {
          throw error(403, "not allowed to optimize");
        }

        // Check referer permissions if in production
        if (process.env.NODE_ENV === "production" && mergedConfig.allowedDomains) {
          const referer = request.headers.get("referer");
          let refererHost = "localhost";
          
          try {
            if (referer) {
              refererHost = new URL(referer).hostname;
            }
          } catch {
            // Use default localhost if referer parsing fails
          }
          
          if (!mergedConfig.allowedDomains.includes(refererHost)) {
            throw error(403, "not allowed to access");
          }
        }

        // Determine target content type once
        let targetContentType: string;
        if (format === "webp") {
          targetContentType = WEBP;
        } else if (format === "avif") {
          targetContentType = AVIF;
        } else if (format === "jpg" || format === "jpeg") {
          targetContentType = JPEG;
        } else if (format === "png") {
          targetContentType = "image/png";
        } else {
          targetContentType = "";
        }

        // Generate cache key once
        const cacheKeys = [url, width, quality, targetContentType];

        // Try to get cached response first
        const cacheResponse = await cache.read<Omit<ResponsePayload, "buffer"> & { buffer: { type: "Buffer", data: number[] } }>(cacheKeys);

        // If cache hit, check ETag and return appropriate response
        if (cacheResponse !== null) {
          const payload: ResponsePayload = {
            ...cacheResponse.data,
            buffer: Buffer.from(cacheResponse.data.buffer.data),
          };

          if (ifNoneMatch === payload.etag) {
            return new Response(null, {
              status: 304,
              headers: {
                Vary: "Accept",
                "Cache-Control": `public, max-age=${Math.floor(payload.maxAge / 1000)}, must-revalidate`,
                ETag: payload.etag,
                "X-SvelteAIO-Cache": "HIT",
                "X-Urami-Cache": "HIT",
              },
            });
          }
          return sendResponse(payload, "HIT");
        }

        // Need to fetch and process the image
        const fetchedImage = await fetch(url);
        
        // Handle fetch errors
        if (!fetchedImage.ok) {
          throw error(fetchedImage.status, `upstream error: ${fetchedImage.statusText}`);
        }
        
        // Get image buffer
        const upstreamBuffer = Buffer.from(await fetchedImage.arrayBuffer());
        
        // Compute hash once for various uses
        const upstreamHash = getHash([upstreamBuffer]);
        
        // Get content type and cache settings
        const upstreamType = detectContentType(upstreamBuffer) ||
                            (fetchedImage.headers.get("Content-Type") ?? "");
        const maxAge = getMaxAge(fetchedImage.headers.get("Cache-Control"));

        // Handle vector and animated images differently
        const vector = vectorTypes.includes(upstreamType);
        const animated = animateableTypes.includes(upstreamType) && isAnimated(upstreamBuffer);
        
        if (vector || animated) {
          // ETag check for unprocessed images
          if (ifNoneMatch === upstreamHash) {
            return new Response(null, {
              status: 304,
              headers: {
                Vary: "Accept",
                "Cache-Control": "public, max-age=0, must-revalidate",
                ETag: upstreamHash,
                "X-SvelteAIO-Cache": "MISS",
                "X-Urami-Cache": "MISS",
                "X-Urami-Optimization": "animate-ignore",
              },
            });
          }
          
          return sendResponse(
            {
              buffer: upstreamBuffer,
              contentType: upstreamType,
              maxAge: 0,
              etag: upstreamHash,
            },
            "MISS",
            {
              "X-Urami-Optimization": "animate-ignore",
            },
          );
        }

        if (targetContentType === "") {
          if (
            upstreamType?.startsWith("image/") &&
            getExtension(upstreamType) &&
            upstreamType !== WEBP &&
            upstreamType !== AVIF
          ) {
            targetContentType = upstreamType;
          } else {
            targetContentType = JPEG;
          }
        }

        // Optimize the image with the hash for metadata cache
        const optimizedBuffer = await optimizeImage(
          upstreamBuffer,
          targetContentType,
          quality,
          width,
          undefined, // height
          upstreamHash, // pass buffer hash for metadata caching
        );

        if (optimizedBuffer === null) {
          throw error(500, "unable to optimize image");
        }
        
        // Calculate ETag once
        const optimizedEtag = getHash([optimizedBuffer]);
        
        // Create response payload
        const payload: ResponsePayload = {
          buffer: optimizedBuffer,
          contentType: targetContentType,
          maxAge: Math.max(maxAge, mergedConfig.ttl),
          etag: optimizedEtag,
        };

        // Check ETag match for optimized image
        if (ifNoneMatch === optimizedEtag) {
          return new Response(null, {
            status: 304,
            headers: {
              Vary: "Accept",
              "Cache-Control": `public, max-age=${Math.floor(payload.maxAge / 1000)}, must-revalidate`,
              ETag: optimizedEtag,
              "X-SvelteAIO-Cache": "MISS",
              "X-Urami-Cache": "MISS",
            },
          });
        }

        // Store in filesystem cache (don't await)
        cache.write(cacheKeys, payload, payload.maxAge).catch(err => {
          // Log cache write failures but don't fail the request
          console.error("Cache write error:", err);
        });

        // Return optimized image
        return sendResponse(payload, "MISS");
      } catch (err) {
        // Better error handling with detailed messages when possible
        if (err instanceof Error && 'status' in err && typeof err.status === 'number') {
          throw err; // Rethrow our own error objects
        }
        console.error("Image processing error:", err);
        throw error(500, "unable to optimize image");
      }
    };
  };
