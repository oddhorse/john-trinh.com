export default function artifactPathsPlugin(md) {
	// Store original image renderer
	const defaultImageRender =
		md.renderer.rules.image ||
		((tokens, idx, options, _env, self) =>
			self.renderToken(tokens, idx, options));

	// Override image renderer to prefix relative paths
	md.renderer.rules.image = (tokens, idx, options, env, self) => {
		const token = tokens[idx];
		const srcIndex = token.attrIndex("src");

		if (srcIndex >= 0) {
			let src = token.attrs[srcIndex][1];

			// Extract artifact name from page URL
			// e.g., /artifacts/bodach/ → bodach
			const artifactMatch = env.page?.url?.match(/\/artifacts\/([^\/]+)\//);
			const artifactName = artifactMatch ? artifactMatch[1] : "";

			// Only prefix if:
			// - We're in an artifact page (artifactName exists)
			// - Path is relative (doesn't start with / or http)
			if (artifactName && !src.startsWith("/") && !src.startsWith("http")) {
				src = `/artifacts/${artifactName}/${src}`;
				token.attrs[srcIndex][1] = src;
			}
		}

		// Call original renderer
		return defaultImageRender(tokens, idx, options, env, self);
	};
}
