import { describe, it, expect, vi, afterEach } from "vitest";
import { buildSource } from "./buildSource";
import { defaultLoader } from ".";

describe("buildSource", () => {
  const loader = vi.fn(defaultLoader);

  const src = "https://example.com/image.jpg";
  const width = 640;
  const quality = 80;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should return a valid source string", () => {
    const result = buildSource(loader, src, width, quality);

    expect(loader).toBeCalled();
    expect(result.src).toBe(defaultLoader(src, 1920, quality));
  });
});
