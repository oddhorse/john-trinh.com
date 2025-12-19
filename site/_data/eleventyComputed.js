/**
 * Global Eleventy Computed Data
 *
 * This file runs at DATA-TIME (before templates render) and is available
 * GLOBALLY across all pages in the site.
 *
 * Why we need this:
 * The HTML transform (artifact-path-transform.js) fixes paths AFTER rendering,
 * but that doesn't help when OTHER pages reference an artifact's front matter data.
 *
 * Example problem:
 * - Artifact front matter: image: "cover.png"
 * - Listing page (categories.njk) uses: {{ artifact.data.image }}
 * - Without this: Would output "cover.png" (broken)
 * - With this: Outputs "/artifacts/artifact-name/cover.png" (works!)
 *
 * This computed data runs BEFORE templates, so the transformed image path
 * is available to ANY template that references it.
 */
export default {
	/**
	 * Transform the 'image' field for artifact pages
	 *
	 * Expands relative image paths in front matter to full artifact paths.
	 * This ensures thumbnails work correctly in listing pages.
	 *
	 * @param {Object} data - The page's data object
	 * @param {string} data.image - The image path from front matter
	 * @param {Object} data.page - Page metadata
	 * @param {string} data.page.url - The page URL (e.g., /artifacts/bodach/)
	 * @returns {string} - The transformed image path
	 */
	image: (data) => {
		// If no image defined in front matter, nothing to transform
		if (!data.image) return data.image;

		// Extract the artifact name from the page URL
		// Example: /artifacts/bodach/ → "bodach"
		// Only matches pages in the /artifacts/ directory
		const artifactMatch = data.page?.url?.match(/\/artifacts\/([^\/]+)\//);

		// If this isn't an artifact page, return the image path unchanged
		if (!artifactMatch) return data.image;

		const artifactName = artifactMatch[1];

		// Only transform RELATIVE paths (not already absolute or external URLs)
		// Relative path examples: "cover.png", "images/cover.png"
		// Already absolute: "/artifacts/other/image.png" (starts with /)
		// External URL: "https://example.com/image.png" (starts with http)
		if (!data.image.startsWith("/") && !data.image.startsWith("http")) {
			// Expand to full artifact path: /artifacts/{artifactName}/{relativePath}
			return `/artifacts/${artifactName}/${data.image}`;
		}

		// Path is already absolute or external, return unchanged
		return data.image;
	},
};
