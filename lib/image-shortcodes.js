/**
 * Eleventy Image Shortcodes
 *
 * Provides two shortcodes for image optimization:
 * 1. thumbnailImg - Fixed 300px width for artifact listing thumbnails
 * 2. responsiveImg - Multiple sizes with srcset for artifact detail pages
 *
 * Handles GIFs specially - keeps them as-is to preserve animation
 */

import Image from "@11ty/eleventy-img";
import path from "path";

/**
 * Generate optimized thumbnail (300px width) in artifact folder
 * Used in artifact listing pages
 *
 * @param {string} src - Image path (relative to artifact folder or absolute)
 * @param {string} alt - Alt text for accessibility
 * @returns {Promise<string>} HTML img tag with optimized image
 */
export async function thumbnailImg(src, alt = "") {
  // Handle relative paths from artifact folders
  const inputPath = src.startsWith('/') ? `./site${src}` : src;

  // Extract artifact name from path (e.g., /artifacts/bodach/cover.png -> bodach)
  const artifactMatch = src.match(/\/artifacts\/([^\/]+)\//);
  if (!artifactMatch) {
    console.warn(`Could not extract artifact name from path: ${src}`);
    return `<img src="${src}" alt="${alt}" loading="lazy" style="width:300px;height:auto;">`;
  }
  const artifactName = artifactMatch[1];

  // Check if it's a GIF - keep GIFs as-is to preserve animation
  const isGif = path.extname(inputPath).toLowerCase() === '.gif';

  if (isGif) {
    // For GIFs, just return a regular img tag without optimization
    return `<img src="${src}" alt="${alt}" loading="lazy" style="width:300px;height:auto;">`;
  }

  // Check if the source file exists before trying to optimize
  // This prevents crashes when front matter references missing images
  try {
    const fs = await import('fs');
    if (!fs.existsSync(inputPath)) {
      console.warn(`Image file not found: ${inputPath} (referenced in ${artifactName})`);
      return `<!-- Missing image: ${src} -->`;
    }
  } catch (err) {
    console.warn(`Error checking if image exists: ${inputPath}`, err);
    return `<!-- Error checking image: ${src} -->`;
  }

  // Generate optimized image at 300px width IN the artifact folder
  try {
    const metadata = await Image(inputPath, {
      widths: [300],
      formats: ["webp", "jpeg"], // WebP first (modern), JPEG fallback
      outputDir: `./dist/artifacts/${artifactName}/`,
      urlPath: `/artifacts/${artifactName}/`,
      filenameFormat: (id, src, width, format) => {
        return `thumb-${width}w.${format}`;
      }
    });

    // Generate HTML with picture element for format fallback
    const imageAttributes = {
      alt,
      loading: "lazy",
      decoding: "async",
    };

    return Image.generateHTML(metadata, imageAttributes);
  } catch (err) {
    console.error(`Error generating thumbnail for ${src}:`, err.message);
    return `<!-- Error generating thumbnail: ${src} -->`;
  }
}

/**
 * Generate responsive image with multiple sizes
 * Used in artifact detail pages
 *
 * @param {string} src - Image path (relative to artifact folder or absolute)
 * @param {string} alt - Alt text for accessibility
 * @param {string} sizes - Sizes attribute for responsive images (default: 100vw)
 * @returns {Promise<string>} HTML picture element with srcset
 */
export async function responsiveImg(src, alt = "", sizes = "100vw") {
  // Handle relative paths from artifact folders
  const inputPath = src.startsWith('/') ? `./site${src}` : src;

  // Check if it's a GIF - keep GIFs as-is to preserve animation
  const isGif = path.extname(inputPath).toLowerCase() === '.gif';

  if (isGif) {
    // For GIFs, just return a regular img tag without optimization
    return `<img src="${src}" alt="${alt}" loading="lazy" style="max-width:100%;height:auto;">`;
  }

  // Generate responsive images at multiple sizes
  const metadata = await Image(inputPath, {
    widths: [400, 800, 1200, 1600], // Multiple sizes for different screen sizes
    formats: ["webp", "jpeg"], // WebP first (modern), JPEG fallback
    outputDir: "./dist/img/",
    urlPath: "/img/",
    filenameFormat: (id, src, width, format) => {
      const name = path.basename(src, path.extname(src));
      return `${name}-${width}w.${format}`;
    }
  });

  // Generate HTML with picture element and srcset
  const imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}
