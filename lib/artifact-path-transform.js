/**
 * Eleventy Transform: Auto-prefix relative paths in artifact pages
 *
 * This transform runs AFTER all HTML is generated and fixes relative paths
 * in src="" and href="" attributes for artifact pages.
 *
 * Use cases:
 * - Markdown images: ![](image.png) → <img src="/artifacts/name/image.png">
 * - HTML images: <img src="image.png"> → <img src="/artifacts/name/image.png">
 * - HTML videos: <video><source src="demo.mp4"> → <source src="/artifacts/name/demo.mp4">
 * - Any relative links or asset references in the rendered HTML
 *
 * Does NOT transform:
 * - Already absolute paths: /artifacts/other/image.png (starts with /)
 * - External URLs: https://example.com/image.png (starts with http)
 * - Pages outside /artifacts/ directory
 * - Non-HTML files
 *
 * @param {string} content - The rendered HTML content
 * @param {string} outputPath - The output file path (e.g., dist/artifacts/bodach/index.html)
 * @returns {string} - Transformed HTML with expanded paths
 */
export default function artifactPathTransform(content, outputPath) {
	// Early returns: only process HTML files in the /artifacts/ directory
	if (!outputPath || !outputPath.endsWith(".html")) return content;
	if (!outputPath.includes("/artifacts/")) return content;

	// Extract the artifact name from the output file path
	// Example: dist/artifacts/bodach/index.html → "bodach"
	// The regex captures the folder name between /artifacts/ and the next /
	const match = outputPath.match(/\/artifacts\/([^\/]+)\//);
	if (!match) return content; // Safety check: no artifact name found

	const artifactName = match[1];

	// Find and replace all relative paths in src="" and href="" attributes
	// Regex breakdown:
	// - (src|href)= : Matches either src= or href=
	// - "(?!\/|http) : Matches opening quote, then negative lookahead for / or http
	//                  (this ensures we only match relative paths, not absolute/external)
	// - ([^"]+) : Captures everything up to the closing quote (the actual path)
	// - " : Matches the closing quote
	return content.replace(
		/(src|href)="(?!\/|http)([^"]+)"/g,
		(match, attr, path) => {
			// Expand the relative path to: /artifacts/{artifactName}/{originalPath}
			return `${attr}="/artifacts/${artifactName}/${path}"`;
		},
	);
}
