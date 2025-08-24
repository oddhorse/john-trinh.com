export default async function (eleventyConfig) {
	// source dir
	eleventyConfig.setInputDirectory("site");
	// for parts and pieces (relative to source dir)
	eleventyConfig.setIncludesDirectory("_includes");

	eleventyConfig.setOutputDirectory("dist");

	// set default layout to base.njk
	eleventyConfig.addGlobalData("layout", "base.njk");
}
