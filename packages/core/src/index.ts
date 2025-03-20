import path from "node:path";
import { URL } from "node:url";
import isAnimated from "is-animated";

import { AVIF, JPEG, WEBP } from "./constants/mimeTypes.js";
import { animateableTypes } from "./constants/animateableTypes.js";
import { defaultConfig } from "./constants/defaultConfig.js";
import { vectorTypes } from "./constants/vectorTypes.js";

import { detectContentType } from "./functions/detectContentType.js";
import { error } from "./functions/error.js";
import { getCacheKey } from "./functions/getCacheKey.js";
import { getExtension } from "./functions/getExtension.js";
import { getHash } from "./functions/getHash.js";
import { getMaxAge } from "./functions/getMaxAge.js";
import { getSupportedMimeType } from "./functions/getSupportedMimeType.js";
import { optimizeImage } from "./functions/optimizeImage.js";
import { readImageFileSystem } from "./functions/readImageFileSystem.js";
import { sendResponse } from "./functions/sendResponse.js";
import { writeImageToFileSystem } from "./functions/writeImageToFileSystem.js";

import type { Config } from "./@types/Config.js";
import type { ResponsePayload } from "./@types/ResponsePayload.js";
import type { RequestHandler } from "./@types/RequestHandler.js";

export const createRequestHandler =
  (config: Partial<Config> = {}): RequestHandler =>
  async (request) => {
    // build general config
    const mergedConfig = {
      ...defaultConfig,
      ...config,
    };
    const targetCacheDirectory = path.join(
      process.cwd(),
      mergedConfig.storePath,
    );

    // Get If-None-Match header early for consistent use
    const ifNoneMatch = request.headers.get("If-None-Match");

    try {
      // parse variables
      const fullRequestUrl = new URL(request.url);
      let url = fullRequestUrl.searchParams.get("url") ?? "";
      const width = Number(fullRequestUrl.searchParams.get("w") ?? "");
      const quality = Number(fullRequestUrl.searchParams.get("q") ?? "");

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

      // Get supported mime type for response
      const mimeType = getSupportedMimeType(
        ["image/webp", ...(mergedConfig.avif ? ["image/avif"] : [])],
        request.headers.get("accept") ?? "",
      );

      // Generate cache key once
      const cacheKey = getCacheKey(url, width, quality, mimeType);

      // Try to get cached response first
      const cacheResponse = await readImageFileSystem(
        cacheKey,
        targetCacheDirectory,
      );

      // If cache hit, check ETag and return appropriate response
      if (cacheResponse !== null) {
        if (ifNoneMatch === cacheResponse.etag) {
          return new Response(null, {
            status: 304,
            headers: {
              Vary: "Accept",
              "Cache-Control": `public, max-age=${Math.floor(cacheResponse.maxAge / 1000)}, must-revalidate`,
              ETag: cacheResponse.etag,
              "X-SvelteAIO-Cache": "HIT",
              "X-Urami-Cache": "HIT",
            },
          });
        }
        return sendResponse(cacheResponse, "HIT");
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

      // Determine target content type once
      let contentType: string;
      if (mimeType) {
        contentType = mimeType;
      } else if (
        upstreamType?.startsWith("image/") &&
        getExtension(upstreamType) &&
        upstreamType !== WEBP &&
        upstreamType !== AVIF
      ) {
        contentType = upstreamType;
      } else {
        contentType = JPEG;
      }

      // Optimize the image with the hash for metadata cache
      const optimizedBuffer = await optimizeImage(
        upstreamBuffer,
        contentType,
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
        contentType,
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
      writeImageToFileSystem(
        cacheKey,
        contentType,
        payload.maxAge,
        payload.etag,
        payload.buffer,
        targetCacheDirectory,
      ).catch(err => {
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
