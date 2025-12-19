/**
 * Eleventy Transform: Automatic Image Optimization
 *
 * This transform runs AFTER all HTML is generated and automatically optimizes
 * all <img> tags in artifact pages by converting them to responsive <picture>
 * elements with multiple sizes and modern formats.
 *
 * Why an HTML transform?
 * - Works with existing markdown syntax (no changes to artifact .md files)
 * - Handles both markdown-rendered images AND embedded HTML images
 * - Runs after markdown-it, so <figure> wrappers are already in place
 * - Easy to add exceptions via data attributes
 *
 * What it does:
 * - Finds all <img> tags in artifact detail pages
 * - Skips GIFs (preserves animation)
 * - Skips images with data-no-optimize attribute
 * - Generates responsive versions: 400px, 800px, 1200px, 1600px
 * - Generates modern formats: webp (smaller) + jpeg (fallback)
 * - Replaces <img> with <picture> element containing srcset
 * - Adds lazy loading and async decoding for performance
 * - Preserves all original attributes, alt text, and figure wrappers
 */

import Image from "@11ty/eleventy-img";
import { load } from "cheerio";
import path from "path";

/**
 * Transform function called by Eleventy for each output file
 *
 * @param {string} content - The HTML content to transform
 * @param {string} outputPath - The output file path (e.g., /dist/artifacts/bodach/index.html)
 * @returns {Promise<string>} - The transformed HTML with optimized images
 */
export default async function imageOptimizeTransform(content, outputPath) {
	// Only process HTML files
	if (!outputPath || !outputPath.endsWith(".html")) {
		return content;
	}

	// Only process artifact detail pages (not listing pages, not homepage)
	if (!outputPath.includes("/artifacts/")) {
		return content;
	}

	// Skip the template artifact
	if (outputPath.includes("/artifacts/_template/")) {
		return content;
	}

	// Extract artifact name from output path for organizing generated images
	// Example: /dist/artifacts/bodach/index.html → "bodach"
	const artifactMatch = outputPath.match(/\/artifacts\/([^\/]+)\//);
	if (!artifactMatch) {
		console.warn(
			`Could not extract artifact name from output path: ${outputPath}`,
		);
		return content;
	}
	const artifactName = artifactMatch[1];

	// Parse HTML with cheerio (jQuery-like API for server-side HTML manipulation)
	const $ = load(content);

	// Find all <img> tags that need optimization
	const images = $("img");

	// Process each image (must be done sequentially due to async image generation)
	for (let i = 0; i < images.length; i++) {
		const img = $(images[i]);

		// Skip if image has data-no-optimize attribute (manual escape hatch)
		if (img.attr("data-no-optimize") !== undefined) {
			continue;
		}

		const src = img.attr("src");
		if (!src) {
			console.warn(
				`Image in ${artifactName} has no src attribute, skipping`,
			);
			continue;
		}

		// Skip external images (CDNs, etc.)
		if (src.startsWith("http://") || src.startsWith("https://")) {
			continue;
		}

		// Skip GIFs to preserve animation
		if (src.toLowerCase().endsWith(".gif")) {
			continue;
		}

		// Convert URL path to file system path
		// Example: /artifacts/bodach/image.png → ./site/artifacts/bodach/image.png
		const inputPath = src.startsWith("/") ? `./site${src}` : src;

		// Check if source file exists before trying to optimize
		try {
			const fs = await import("fs");
			if (!fs.existsSync(inputPath)) {
				console.warn(
					`Image file not found: ${inputPath} (referenced in ${artifactName}), skipping optimization`,
				);
				continue;
			}
		} catch (err) {
			console.warn(
				`Error checking if image exists: ${inputPath}`,
				err,
			);
			continue;
		}

		try {
			// Generate optimized responsive images using @11ty/eleventy-img
			const metadata = await Image(inputPath, {
				// Generate 4 different sizes for responsive images
				widths: [400, 800, 1200, 1600],

				// Generate both webp (modern, smaller) and jpeg (fallback)
				formats: ["webp", "jpeg"],

				// Output optimized images to the artifact's folder
				outputDir: `./dist/artifacts/${artifactName}/`,
				urlPath: `/artifacts/${artifactName}/`,

				// Filename format: original-name-800w.webp
				filenameFormat: (id, src, width, format) => {
					const ext = path.extname(src);
					const name = path.basename(src, ext);
					return `${name}-${width}w.${format}`;
				},
			});

			// Get custom sizes attribute if provided, otherwise default to 100vw
			// User can add data-sizes="(max-width: 768px) 100vw, 50vw" for custom behavior
			const customSizes = img.attr("data-sizes") || "100vw";

			// Generate HTML for responsive <picture> element
			// This creates <source> tags for each format with srcset
			const pictureHTML = Image.generateHTML(metadata, {
				alt: img.attr("alt") || "",
				sizes: customSizes,
				loading: "lazy",
				decoding: "async",
			});

			// Parse the generated picture HTML
			const $picture = load(pictureHTML);

			// Preserve any additional attributes from original img
			// (except src, which is handled by picture element)
			const attributes = img.attr();
			const preservedAttrs = {};
			for (const [key, value] of Object.entries(attributes)) {
				if (
					key !== "src" &&
					key !== "alt" &&
					key !== "loading" &&
					key !== "decoding" &&
					!key.startsWith("data-")
				) {
					preservedAttrs[key] = value;
				}
			}

			// Apply preserved attributes to the img inside picture
			const $generatedImg = $picture("img");
			for (const [key, value] of Object.entries(preservedAttrs)) {
				$generatedImg.attr(key, value);
			}

			// Replace original <img> with optimized <picture>
			img.replaceWith($picture.html());
		} catch (err) {
			console.error(
				`Error optimizing image ${src} in ${artifactName}:`,
				err.message,
			);
			// On error, keep original <img> tag (graceful degradation)
			continue;
		}
	}

	// Return the transformed HTML
	return $.html();
}
