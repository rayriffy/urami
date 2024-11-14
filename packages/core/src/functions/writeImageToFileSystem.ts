import fs from "node:fs";
import path from "node:path";
import { getExtension } from "./getExtension.js";

export const writeImageToFileSystem = async (
  cacheKey: string,
  contentType: string,
  maxAge: number,
  etag: string,
  buffer: Buffer,
  cacheDirectory: string,
) => {
  // get file extension by content type
  let extension = getExtension(contentType);

  // build final file path
  const targetDirectory = path.join(cacheDirectory, cacheKey);
  const targetFileName = `${maxAge}.${maxAge + Date.now()}.${etag}.${extension}`;

  // any case of failure (maybe due to filesystem space ran out) can be ignored,
  // but it need to make sure it properly cleaned up
  try {
    await fs.promises.mkdir(targetDirectory, { recursive: true });
    await fs.promises.writeFile(
      path.join(targetDirectory, targetFileName),
      buffer,
    );
  } catch (e) {
    await fs.promises
      .rm(path.join(targetDirectory, targetFileName))
      .catch(() => {});
  }
};
