/**
 * Cloudinary image optimization utility
 * Generates optimized image URLs with automatic format conversion and responsive sizing
 */

const CLOUDINARY_CLOUD_NAME = "dnjilyjr4";
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

interface CloudinaryOptions {
  width?: number;
  quality?: "auto" | number;
  format?: "auto" | "webp" | "jpg" | "png";
  crop?: "fill" | "scale" | "fit";
}

/**
 * Extracts public ID from a full Cloudinary URL or returns the string if it's already an ID
 */
function getPublicId(urlOrId: string): string {
  if (urlOrId.startsWith("http")) {
    const parts = urlOrId.split("/upload/");
    if (parts.length > 1) {
      // Remove version (v17...) and extension if present
      const idPath = parts[1].replace(/^v\d+\//, "");
      return idPath.split(".")[0];
    }
  }
  return urlOrId;
}

/**
 * Generate optimized Cloudinary URL
 * @param publicIdOrUrl - Cloudinary public ID or full URL
 * @param options - Transformation options
 * @returns Optimized image URL
 */
export function getCloudinaryUrl(
  publicIdOrUrl: string,
  options: CloudinaryOptions = {},
): string {
  const publicId = getPublicId(publicIdOrUrl);
  const { width, quality = "auto", format = "auto", crop = "fill" } = options;

  const transformations: string[] = [];

  if (width) transformations.push(`w_${width}`);
  if (quality || quality === 0) transformations.push(`q_${quality || "auto"}`);
  if (format) transformations.push(`f_${format}`);
  if (crop && width) transformations.push(`c_${crop}`);

  const transformString = transformations.join(",");
  return `${CLOUDINARY_BASE_URL}/${transformString}/${publicId}`;
}

/**
 * Generate responsive srcSet for Cloudinary images
 * @param publicIdOrUrl - Cloudinary public ID or full URL
 * @param widths - Array of widths for srcSet
 * @returns srcSet string
 */
export function getCloudinarySrcSet(
  publicIdOrUrl: string,
  widths: number[] = [400, 800, 1200],
): string {
  return widths
    .map((width) => {
      const url = getCloudinaryUrl(publicIdOrUrl, {
        width,
        format: "auto",
        quality: "auto",
      });
      return `${url} ${width}w`;
    })
    .join(", ");
}
