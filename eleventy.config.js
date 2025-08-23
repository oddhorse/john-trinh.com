export default async function(eleventyConfig) {
	// source dir
	eleventyConfig.setInputDirectory("site");
	// for parts and pieces (relative to source dir)
	eleventyConfig.setIncludesDirectory("_includes");
};