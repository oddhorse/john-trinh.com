import markdownIt from "markdown-it";
import implicitFigures from "markdown-it-implicit-figures";

export default async function (eleventyConfig) {
	// source dir
	eleventyConfig.setInputDirectory("site");
	// for parts and pieces (relative to source dir)
	eleventyConfig.setIncludesDirectory("_includes");

	// copy to exports verbatim
	eleventyConfig.addPassthroughCopy("site/assets");

	// output dir
	eleventyConfig.setOutputDirectory("dist");

	// set default layout to base.njk
	eleventyConfig.addGlobalData("layout", "base.njk");

	// configure markdown-it plugin to add markdown captions to photos
	const options = {
		html: true,
	};
	eleventyConfig.setLibrary(
		"md",
		markdownIt(options).use(implicitFigures, {
			figcaption: true,
		}),
	);
}
