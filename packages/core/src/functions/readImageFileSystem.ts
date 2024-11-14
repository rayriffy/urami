import fs from "node:fs";
import path from "node:path";

import { detectContentType } from "./detectContentType.js";

import type { ResponsePayload } from "../@types/ResponsePayload.js";

export const readImageFileSystem = async (
  cacheKey: string,
  cacheDirectory: string,
): Promise<ResponsePayload | null> => {
  const now = Date.now();

  try {
    const requestedDirectory = path.join(cacheDirectory, cacheKey);
    const files = await fs.promises.readdir(requestedDirectory);

    for (const file of files) {
      const [maxAgeString, expireAtString, etag, extension] = file.split(".");
      const filePath = path.join(requestedDirectory, file);
      const expireAt = Number(expireAtString);
      const maxAge = Number(maxAgeString);

      if (expireAt < now) {
        await fs.promises.rm(filePath);
      } else {
        const buffer = await fs.promises.readFile(
          path.join(requestedDirectory, file),
        );

        return {
          buffer,
          etag,
          maxAge,
          contentType: detectContentType(buffer),
        };
      }
    }
  } catch (_) {}

  return null;
};
