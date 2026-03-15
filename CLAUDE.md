# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio site for John Trinh (musician, audio engineer, developer, designer). Built with Eleventy 3.1.2 static site generator with advanced image optimization and responsive design features.

**Tech Stack:**

- Eleventy 3.1.2 (static site generator)
- Nunjucks templating
- markdown-it with plugins (implicit-figures, video embeds)
- Cheerio (HTML post-processing)
- @11ty/eleventy-img (responsive image generation)
- simple-git (git integration)

## Development Commands

```bash
npm install              # Install dependencies
npm start               # Start dev server with hot reload (http://localhost:8080)
npm run build           # Production build (site/ → dist/)
npm run clean           # Remove dist/ folder
npm run bench           # Run with performance metrics (DEBUG=Eleventy:Benchmark*)
npm run watch           # Build on file changes (no dev server)
```

## Architecture

### Directory Structure

```
/
├── lib/                        # Custom Eleventy utilities
│   ├── artifact-path-transform.js     # HTML transform: expand relative paths
│   ├── image-optimize-transform.js    # HTML transform: auto image optimization
│   └── image-shortcodes.js            # Manual image shortcodes (thumbnailImg, responsiveImg)
│
├── site/                       # SOURCE FILES (input directory)
│   ├── _data/
│   │   ├── credits.json               # Music credits data (structured JSON)
│   │   └── eleventyComputed.js        # Global computed data (auto-expands image paths in front matter)
│   │
│   ├── _includes/                     # Reusable templates
│   │   ├── logos/
│   │   │   └── github.svg             # GitHub icon for footer
│   │   ├── artifact.njk               # Artifact detail page layout
│   │   ├── base.njk                   # Root HTML wrapper (global layout)
│   │   ├── dev-hud.njk                # Dev/beta/draft warning banners
│   │   ├── footer.njk                 # Footer with git info
│   │   ├── head.njk                   # HTML head with comprehensive SEO, Open Graph
│   │   └── header.njk                 # Navigation header
│   │
│   ├── artifacts/                     # Portfolio items (collection)
│   │   ├── [artifact-name]/           # Each artifact in own folder
│   │   │   ├── index.md               # Markdown content
│   │   │   └── [images/videos]        # Asset files (auto-optimized)
│   │   └── artifacts.json             # Collection configuration
│   │
│   ├── about.md                       # About page
│   ├── categories.njk                 # Pagination template (generates /, /tech/, /art/, /brand/)
│   ├── credits.md                     # Music credits display page
│   └── lost.html                      # Lost item contact page (QR code destination)
│
├── dist/                       # BUILD OUTPUT (generated, gitignored)
│   ├── artifacts/
│   │   └── [name]/
│   │       ├── index.html             # Rendered artifact page
│   │       ├── [original images]      # Copied via passthrough
│   │       ├── thumb-300w.webp        # Generated thumbnail
│   │       ├── thumb-300w.jpeg        # Thumbnail fallback
│   │       ├── [name]-400w.webp       # Responsive sizes (400, 800, 1200, 1600)
│   │       ├── [name]-800w.webp
│   │       ├── [name]-1200w.webp
│   │       ├── [name]-1600w.webp
│   │       └── [name]-[size]w.jpeg    # JPEG fallbacks for all sizes
│   ├── about/index.html
│   ├── art/index.html                 # Category page
│   ├── brand/index.html               # Category page
│   ├── credits/index.html
│   ├── lost/index.html
│   ├── tech/index.html                # Category page
│   └── index.html                     # Homepage (all artifacts)
│
├── .github/workflows/main.yml  # GitHub Actions deployment
├── eleventy.config.js          # Main Eleventy configuration
├── package.json                # Dependencies and scripts
└── README.md                   # Project documentation
```

### Template Hierarchy

```
base.njk (root HTML wrapper)
├── head.njk (meta tags, SEO, Open Graph, favicons)
├── dev-hud.njk (conditional dev/beta/draft banners)
├── header.njk (navigation)
├── {{ content | safe }}
│   └── artifact.njk (for artifact pages)
│       └── {{ content | safe }} (markdown content)
└── footer.njk (copyright, git links with current branch/commit)
```

**Layout Application:**

- All pages use `base.njk` as default layout (set globally in eleventy.config.js)
- Artifacts use `artifact.njk` layout which extends `base.njk`
- Content is injected via `{{ content | safe }}`

### Collections

**artifacts collection:**

- Auto-generated from all `index.md` files in `/site/artifacts/*/` subdirectories
- Configuration in `/site/artifacts/artifacts.json`
- All artifacts must be tagged with `["artifacts", "portfolio"]`
- **Draft filtering:** Drafts (`draft: true`) are visible in dev mode but hidden in production builds

### Global Data

Available in all templates:

- `gitInfo` - Object with `{ branch, commit, shortCommit }` (via simple-git)
- `year` - Current year for copyright
- `isDev` - Boolean, true when `ELEVENTY_RUN_MODE === 'serve'`

## Build Process Flow

The Eleventy build runs in four phases:

### 1. Data Phase

```
Load credits.json
Run eleventyComputed.js → Expand image paths in artifact front matter
  (Converts: image: "cover.png" → image: "/artifacts/name/cover.png")
Fetch git info (branch, commit hash)
Generate artifacts collection (filter drafts in production)
```

### 2. Template Phase

```
Process .md files through markdown-it:
  → markdown-it-implicit-figures (auto-wrap images in <figure> with <figcaption>)
  → markdown-it-video (process @[youtube] and @[vimeo] syntax)
  → Render to HTML
Apply layouts (artifact.njk → base.njk)
Insert includes (head, header, footer, dev-hud)
```

### 3. Transform Phase (HTML Post-Processing)

Transforms run in order on final HTML:

**a) artifactPathTransform** (`lib/artifact-path-transform.js`)

- Finds relative `src` and `href` attributes in artifact pages
- Expands to absolute paths: `image.png` → `/artifacts/[name]/image.png`
- Works with images, videos, links, any asset references
- Only affects pages matching `/artifacts/*/` URL pattern

**b) imageOptimizeTransform** (`lib/image-optimize-transform.js`)

- Parses HTML with Cheerio
- Finds all `<img>` tags in artifact pages (skips `_template`)
- Skips GIFs (preserves animation) and images with `data-no-optimize` attribute
- Generates 4 sizes (400px, 800px, 1200px, 1600px) × 2 formats (WebP, JPEG)
- Replaces `<img>` with responsive `<picture>` element
- Adds `loading="lazy"` and `decoding="async"`
- Supports custom `data-sizes` attribute for responsive sizes

### 4. Output Phase

```
Write HTML files to dist/
Copy passthrough files (artifacts/*, assets/*)
Optimized images already generated in dist/artifacts/[name]/
```

## Image Optimization System

The project has a **two-tier image optimization system**:

### Tier 1: Automatic Transform (For Markdown Images)

**How it works:**

- Runs after HTML generation via `imageOptimizeTransform`
- Uses Cheerio to parse HTML and find `<img>` tags
- Automatically converts to responsive `<picture>` elements
- Only affects artifact detail pages (not listing pages)

**Output format:**

```html
<picture>
  <source type="image/webp"
    srcset="/artifacts/name/img-400w.webp 400w,
            /artifacts/name/img-800w.webp 800w,
            /artifacts/name/img-1200w.webp 1200w,
            /artifacts/name/img-1600w.webp 1600w"
    sizes="100vw">
  <source type="image/jpeg"
    srcset="/artifacts/name/img-400w.jpeg 400w,
            /artifacts/name/img-800w.jpeg 800w,
            /artifacts/name/img-1200w.jpeg 1200w,
            /artifacts/name/img-1600w.jpeg 1600w"
    sizes="100vw">
  <img src="/artifacts/name/img-1600w.jpeg"
       alt="..."
       loading="lazy"
       decoding="async">
</picture>
```

**Special cases:**

- **GIFs:** Automatically preserved as-is (no optimization to maintain animation)
- **Skip optimization:** Add `data-no-optimize` attribute to any `<img>` tag
- **Custom sizes:** Add `data-sizes="(max-width: 768px) 100vw, 50vw"` to customize responsive sizes

### Tier 2: Manual Shortcodes

Defined in `lib/image-shortcodes.js`:

**thumbnailImg** - For listing pages

```njk
{% thumbnailImg "/artifacts/name/cover.png", "Alt text" %}
```

- Generates 300px width thumbnail
- WebP + JPEG fallback
- Output filename: `thumb-300w.{webp,jpeg}`
- Used in category listing pages

**responsiveImg** - Custom responsive images

```njk
{% responsiveImg "/path/to/image.jpg", "Alt text", "(max-width: 768px) 100vw, 50vw" %}
```

- Generates 4 sizes: 400, 800, 1200, 1600px
- Custom sizes attribute (default: "100vw")
- Outputs to `/dist/img/` directory

## Path Resolution System

### Problem It Solves

Artifacts need relative paths in markdown (clean authoring) but absolute paths when referenced elsewhere (listing pages, cross-references).

### Two-Part Solution

**1. eleventyComputed.js** (Data-time transformation)

- Runs during data phase BEFORE template rendering
- Transforms the `image` field in artifact front matter
- Converts: `image: "cover.png"` → `image: "/artifacts/[name]/cover.png"`
- Only affects artifact pages (checks URL pattern)
- Preserves absolute paths and external URLs unchanged

**Why this is needed:**

```
Without computed data:
- Artifact frontmatter: image: "cover.png"
- Listing page: {% thumbnailImg artifact.data.image %}
- Result: ❌ BROKEN (tries to load /cover.png)

With computed data:
- Computed transforms to: image: "/artifacts/bodach/cover.png"
- Listing page: {% thumbnailImg artifact.data.image %}
- Result: ✅ WORKS
```

**2. artifact-path-transform.js** (HTML-time transformation)

- Runs during transform phase AFTER HTML generation
- Expands relative paths in `src` and `href` attributes
- Only affects artifact pages (URL pattern: `/artifacts/*/`)
- Example: `<img src="photo.png">` → `<img src="/artifacts/name/photo.png">`
- Works with images, videos, links, any HTML element with src/href

### Path Authoring Guide

In artifact markdown, you can use:

**Relative paths (auto-expanded):**

```markdown
![Caption](image.png)                    → /artifacts/my-project/image.png
![Caption](subfolder/image.png)          → /artifacts/my-project/subfolder/image.png
<video src="demo.mp4"></video>           → /artifacts/my-project/demo.mp4
```

**Absolute paths (unchanged):**

```markdown
![Caption](/artifacts/other/image.png)   → /artifacts/other/image.png
![Caption](/assets/images/global.png)    → /assets/images/global.png
```

**External URLs (unchanged):**

```markdown
![Caption](https://example.com/img.png)  → https://example.com/img.png
```

## Configuration Files

### eleventy.config.js

**Basic Settings:**

- Input directory: `site/`
- Output directory: `dist/`
- Includes directory: `site/_includes/`
- Default layout: `base.njk` (applied globally)

**Markdown Configuration:**

- Library: markdown-it
- Options: `{ html: true }` (allows embedded HTML)
- Plugins:
  - `markdown-it-implicit-figures` - Auto-wraps images in `<figure>` with `<figcaption>` from alt text
  - `@vrcd-community/markdown-it-video` - YouTube/Vimeo embeds (default size: 560x315)

**Transforms (run in order):**

1. `artifactPaths` - Expands relative paths to absolute
2. `optimizeImages` - Converts images to responsive picture elements

**Async Shortcodes:**

- `thumbnailImg` - 300px optimized thumbnails
- `responsiveImg` - Multi-size responsive images

**Global Data:**

- `gitInfo` - From simple-git: `{ branch, commit, shortCommit }`
- `year` - Current year
- `isDev` - Boolean for dev server mode

**Collections:**

- `artifacts` - Auto-generated from `site/artifacts/*/index.md`
- Draft filtering logic (lines 82-91)

**Passthrough Copy:**

- `site/assets/` → `dist/assets/` (verbatim)
- `site/artifacts/**/*.{png,jpg,jpeg,gif,mp4,mov}` → Respective artifact folders in dist/

### package.json

**Production Dependencies:**

- `@11ty/eleventy@3.1.2` - Static site generator
- `@vrcd-community/markdown-it-video@1.1.1` - Video embed support
- `del-cli@6.0.0` - Clean script utility
- `markdown-it@14.1.0` - Markdown parser
- `markdown-it-implicit-figures@0.12.0` - Auto image captions
- `simple-git@3.30.0` - Git integration for footer

**Dev Dependencies:**

- `@11ty/eleventy-img@6.0.4` - Image optimization
- `cheerio@1.1.2` - HTML parsing for transforms

### .editorconfig

- Default: Tab indentation
- JS/JSX/TS files: 2-space indents
- CSS files: 3-space indents

## Creating New Content

### Adding an Artifact

**1. Create folder structure:**

```bash
mkdir site/artifacts/my-project
cd site/artifacts/my-project
```

**2. Create index.md with front matter:**

```yaml
---
title: Project Name
time: dec 2025              # Human-readable time period
subtitle: Brief description or medium
date: 2025-12-25            # YYYY-MM-DD for sorting (newest first)
tags:
  - artifacts               # Required
  - portfolio               # Required
  - tech                    # Category (tech/art/brand)
  - max for live            # Optional subcategories
  - dsp
image: cover.png            # Relative path (auto-expanded to /artifacts/my-project/cover.png)
draft: true                 # Optional: hide from production, show in dev
---

Project description and content here.

## Section Heading

Markdown content with **formatting**.

![Image caption](image.png)

<video controls style="max-width:100%;">
  <source src="demo.mp4" type="video/mp4">
</video>

@[youtube](VIDEO_ID)
```

**3. Add asset files:**

- Place images/videos in same folder as index.md
- Use relative paths in markdown
- Images automatically optimize to responsive formats
- GIFs preserved (no optimization)

**4. Preview in dev mode:**

```bash
npm start
# Visit http://localhost:8080/artifacts/my-project/
# Draft artifacts visible in dev, hidden in production
```

**5. Publish:**

- Remove `draft: true` from front matter (or set to `false`)
- Commit and push to `main` branch
- GitHub Actions automatically deploys

### Artifact Front Matter Reference

**Required fields:**

- `title` - Project name (string)
- `date` - ISO date for sorting, YYYY-MM-DD format (newest first)
- `tags` - Must include `["artifacts", "portfolio"]` at minimum

**Recommended fields:**

- `time` - Human-readable time period (e.g., "nov 2022", "ongoing since 2021")
- `subtitle` - Brief description or medium
- `image` - Cover image (relative path, auto-expanded)
- Category tag: One of `tech`, `art`, or `brand`

**Optional fields:**

- `draft` - Boolean, hides from production if `true`
- Additional tags for filtering/organization

### Markdown Features

**Standard markdown:**

- Headings (`#`, `##`, etc.)
- Lists (ordered/unordered)
- Links, emphasis, code blocks
- Tables, blockquotes

**Embedded HTML:**

- Full HTML support (markdown-it configured with `html: true`)
- Mix markdown and HTML freely

**Automatic image captions:**

- Alt text becomes `<figcaption>` automatically
- Example: `![My caption](image.png)` → `<figure><img><figcaption>My caption</figcaption></figure>`

**Video embeds:**

- YouTube: `@[youtube](VIDEO_ID)`
- Vimeo: `@[vimeo](VIDEO_ID)`
- Native: `<video src="file.mp4" controls></video>` (paths auto-expand)

**Image optimization control:**

- Automatic by default (responsive `<picture>` element)
- Skip optimization: Add `data-no-optimize` attribute
- Custom responsive sizes: Add `data-sizes="(max-width: 768px) 100vw, 50vw"`
- GIFs automatically preserved (no optimization)

### Tag Taxonomy

**Categories (for filtering):**

- `tech` - Technical/development projects
- `art` - Artistic/creative work
- `brand` - Branding/identity design

**Common subcategories:**

- `max for live` - Ableton Live plugins
- `dsp` - Digital signal processing
- `3d` - 3D modeling/rendering
- `performance` - Live performance projects
- `video` - Video projects
- `animation` - Animated work
- `graphic design` - Graphic design work
- `web dev` - Web development
- `hardware` - Physical hardware

**Attributes:**

- `silly + fun` - Lighthearted projects
- `collab` - Collaborative work
- `performance tool` - Tools for live performance

**Required on all artifacts:**

- `artifacts` - Marks as part of artifacts collection
- `portfolio` - Marks as portfolio item

## Special Pages

### Homepage & Category Pages (categories.njk)

**Single template generates 4 pages via pagination:**

- `/` - All artifacts (no filter)
- `/tech/` - Tech category
- `/art/` - Art category
- `/brand/` - Brand category

**Features:**

- Filters artifacts by tags
- Uses `thumbnailImg` shortcode for optimized 300px thumbnails
- Shows "(DRAFT)" indicator for unpublished artifacts
- Chronological order (newest first via `date` field)

**Note:** There is no dedicated `site/index.md` - homepage is generated by categories.njk with empty filter.

### Credits Page (credits.md)

**Data source:** `/site/_data/credits.json`

**Data structure:**

```json
{
  "title": "Song Title",
  "artist": "Artist Name",
  "role": "Producer, Mixing Engineer, Mastering Engineer",
  "date": "2025-01-01",
  "type": "client" | "original",
  "format": "single" | "EP" | "album",
  "project": "Optional parent project name",
  "url": "Optional external link"
}
```

**Page sections:**

- Client Work (type: "client")
- Original Work (type: "original")
- Chronological display with format indicators
- Shows project relationships

### Lost Item Page (lost.html)

**Purpose:** QR code destination for lost items

**Features:**

- Standalone HTML (no base layout)
- Contact methods: email, phone, SMS, Instagram
- Pre-filled email/SMS templates
- SEO blocked (`noindex, nofollow, noai`)
- Centered, minimal design

## Dev Mode Features

### Dev HUD (dev-hud.njk)

Displays context-aware banners at top of page:

**1. Dev Server Mode** (yellow banner)

- Shows when `ELEVENTY_RUN_MODE === 'serve'`
- Message: "DEVELOPMENT SERVER"

**2. Beta Branch** (orange banner)

- Shows when deployed on beta branch
- Includes link to production site
- Message: "BETA SITE - View production at [link]"

**3. Draft Pages** (gray banner)

- Shows on individual pages with `draft: true`
- Message: "THIS PAGE IS A DRAFT"

**Positioning:** Sticky at top, z-index 1000

### Draft System

**Visibility:**

- Dev mode (`npm start`): All artifacts visible including drafts
- Production build (`npm run build`): Drafts filtered out
- Draft pages show gray banner in dev mode

**Configuration:**

- Set `draft: true` in artifact front matter
- Draft filtering logic in eleventy.config.js (lines 82-91)
- 18 artifacts currently marked as draft (as of Dec 25, 2025)

## Deployment

### GitHub Actions Workflow

**File:** `.github/workflows/main.yml`

**Trigger:**

- Push to `main` branch
- Manual workflow dispatch

**Steps:**

1. Checkout repository
2. Setup Node.js 20 with npm caching
3. Install dependencies (`npm ci`)
4. Build site (`npm run build`)
5. Install SSH key from GitHub secrets
6. Add server to known hosts
7. Deploy via rsync to production server

**Deployment command:**

```bash
rsync -avz --delete ./dist/ $SSH_USER@$SSH_HOST:/home/[user]/john-trinh.com/
```

**Required GitHub Secrets:**

- `SSH_PRIVATE_KEY` - Server SSH private key
- `SSH_HOST` - Server IP address
- `SSH_USER` - SSH username

**Notes:**

- `--delete` flag removes files from server that aren't in dist/
- Deployment target: `/home/[user]/john-trinh.com/` on remote server

## Routing

File-based routing (Eleventy default):

```
site/categories.njk (pagination) → /index.html (all artifacts)
                                 → /tech/index.html
                                 → /art/index.html
                                 → /brand/index.html
site/about.md                    → /about/index.html
site/credits.md                  → /credits/index.html
site/lost.html                   → /lost/index.html
site/artifacts/my-project/index.md → /artifacts/my-project/index.html
```

**URL patterns:**

- Pretty URLs enabled (index.html files in folders)
- `/artifacts/name/` shows `/artifacts/name/index.html`
- No file extensions in URLs

## Common Tasks

### Add a new artifact

```bash
mkdir site/artifacts/project-name
# Create index.md with front matter
# Add images to same folder
npm start  # Preview at localhost:8080/artifacts/project-name/
```

### Update credits

Edit `site/_data/credits.json` with new entries

### Clean and rebuild

```bash
npm run clean
npm run build
```

### Preview production build locally

```bash
npm run build
# Serve dist/ folder with any static server
npx http-server dist/
```

### Check performance

```bash
npm run bench
# Shows timing for each template rendering
```

### Force image re-optimization

Delete generated images in `dist/artifacts/[name]/` and rebuild:

```bash
rm dist/artifacts/project-name/*-{400,800,1200,1600}w.{webp,jpeg}
npm run build
```

## Project Statistics (as of Dec 25, 2025)

- **Total artifacts:** 34 folders (including `_template`)
- **Published artifacts:** 16 (18 marked as draft)
- **New artifacts since Dec 16:** 7 (SFFH campaign)
- **Template files:** 6 in `_includes/`
- **Custom utilities:** 3 JavaScript files in `lib/`
- **Data files:** 2 (`credits.json`, `eleventyComputed.js`)
- **Generated pages:** 4 category pages + individual artifact pages
- **Image formats generated:** WebP + JPEG fallbacks (2 formats × 4 sizes = 8 files per image)

## Code Quality Standards

### Commenting Requirements

**CRITICAL: ALL code must be thoroughly commented following this standard.**

Reference examples:

- [site/_data/eleventyComputed.js](site/_data/eleventyComputed.js) - Exemplary file-level and inline commenting
- [eleventy.config.js](eleventy.config.js) - Clean inline comments explaining each configuration

**File-level documentation:**

```javascript
/**
 * Brief description of file purpose
 *
 * Detailed explanation of:
 * - What this file does
 * - Why it exists (what problem does it solve?)
 * - How it fits into the build process
 *
 * Include examples showing:
 * - Problem without this code
 * - Solution with this code
 */
```

**Function-level documentation:**

```javascript
/**
 * Brief description of what function does
 *
 * Longer explanation if needed, including edge cases.
 *
 * @param {Type} paramName - Description of parameter
 * @param {Type} paramName.property - Description of nested property
 * @returns {Type} - Description of return value
 */
```

**Inline comments:**

- Explain WHAT each section does
- Explain WHY decisions were made
- Call out edge cases and special handling
- Clarify non-obvious logic
- Use inline comments liberally - better too many than too few

**Key principle:** Someone unfamiliar with the codebase should be able to understand what code does and why it exists by reading comments alone.

**For CSS:** Comment every section, explain design decisions, document magic numbers, link to references when using specific techniques.

## Known Issues & Limitations

### Stale Build Artifacts

- Some deleted artifacts may still exist in `dist/` folder
- Recommendation: Run `npm run clean && npm run build` periodically

### Draft Artifacts

- 18 artifacts currently marked as draft (mostly SFFH campaign)
- Won't appear in production until `draft: true` removed

### No Dedicated Homepage

- Homepage generated by categories.njk pagination (unconventional but functional)
- Consider creating dedicated `site/index.njk` if custom homepage needed

### Build Output Cleanup

- `.DS_Store` files may appear in dist/ folder
- Consider adding to `.gitignore` or cleaning in build script

## GIT COMMIT STYLE

- Always use the user's exact commit phrasing when they provide one. Do not prepend, append, reword, scope, or otherwise modify the message — use it verbatim.
- If the assistant must write commit messages without an explicit user-provided message, copy the user's terse style exactly: a single short line, minimal punctuation, no body, and no extra metadata. Emulate the user's tone so commits read like they were all written by one person, even if that style is very reductive.
- When the user later supplies a different phrasing or pattern, adopt that new style consistently for subsequent commits.

### Profile (how to write like the user)

- Voice: single-author, informal and conversational — sometimes profane, often terse.
- Case & punctuation: follow the user's exact casing and punctuation (often lowercase or sentence-style); expressive punctuation is allowed.
- Length: prefer a single short subject line. Avoid bodies unless the user explicitly requests a longer message.
- Tone: direct, occasionally playful/angry, minimal polish. Use colloquial words and contractions freely.
- Prefixes: the user sometimes uses conventional prefixes (`refactor:`, `chore:`) but often writes freeform; prefer freeform unless recent history shows a prefix pattern.

Guidelines the assistant must follow when composing commits:

- If the user supplies a message: commit verbatim, no edits.
- If composing for the user: produce a one-line subject, mimic their tone and casing, and keep it compact (<~60 chars preferred).
- Do not add metadata, scopes, or explanatory bodies unless the user requests them.
- When in doubt, ask the user for the exact line to use.

Examples (real patterns from the repo):

- "fixed that bullshit about page man"
- "whatever man!! whatever changed idk about it."
- "trying to fix fucking encoding issue"
- "bunchhh of new portfolio entriesss"
- "fixed all the video shit and borken youtube links"
- "added lost item page!!! and updated other fings"
