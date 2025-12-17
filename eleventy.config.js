import markdownIt from "markdown-it";
import implicitFigures from "markdown-it-implicit-figures";
import markdownItVideo from "@vrcd-community/markdown-it-video";
import artifactPathTransform from "./lib/artifact-path-transform.js";

// get git info
import simpleGit from "simple-git";

// git info prep function
const git = simpleGit();
async function getGitInfo() {
	const branchSummary = await git.branch();
	const log = await git.log({ n: 1 });
	return {
		branch: branchSummary.current,
		commit: log.latest.hash,
		shortcommit: log.latest.hash.slice(0, 7),
	};
}

export default async function (eleventyConfig) {
	// fetches git info as `gitInfo` to use at build time and inject in pages
	eleventyConfig.addGlobalData("gitInfo", await getGitInfo());

	// current year for copyright footer
	eleventyConfig.addGlobalData("year", new Date().getFullYear());

	// dev mode?
	eleventyConfig.addGlobalData(
		"isDev",
		process.env.ELEVENTY_RUN_MODE === "serve",
	);

	// source dir
	eleventyConfig.setInputDirectory("site");
	// for parts and pieces (relative to source dir)
	eleventyConfig.setIncludesDirectory("_includes");

	// copy to exports verbatim
	eleventyConfig.addPassthroughCopy("site/assets");
	// copy artifact assets (images, videos) from artifact folders
	eleventyConfig.addPassthroughCopy(
		"site/artifacts/**/*.{png,jpg,jpeg,gif,mp4,mov}",
	);

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
		markdownIt(options)
			.use(implicitFigures, {
				figcaption: true,
			})
			.use(markdownItVideo, {
				youtube: { width: 560, height: 315 },
				vimeo: { width: 560, height: 315 },
			}),
	);

	// Add transform for artifact relative paths
	eleventyConfig.addTransform("artifactPaths", artifactPathTransform);

	// Filter out draft content in production
	eleventyConfig.addCollection("artifacts", (collectionApi) => {
		const isDev = process.env.ELEVENTY_RUN_MODE === "serve";

		return collectionApi
			.getFilteredByGlob("site/artifacts/*/index.md")
			.filter((item) => {
				// Show drafts in dev mode, hide in production
				return isDev || !item.data.draft;
			});
	});
}
