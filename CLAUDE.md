# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio site for John Trinh (musician, audio engineer, developer, designer). Built with Eleventy 3.1.2 static site generator.

**Tech Stack:**

- Eleventy 3.1.2 (static site generator)
- Nunjucks templating
- markdown-it with implicit-figures plugin (for image captions)
- ES6 modules

## Development Commands

```bash
npm install              # Install dependencies
npm start               # Start dev server with hot reload (http://localhost:8080)
npm run build           # Production build (site/ → dist/)
npm run clean           # Remove dist/ folder
npm run bench           # Run with performance metrics (DEBUG=Eleventy:Benchmark*)
```

## Architecture

### Directory Structure

```
/site/                   # Source files (input directory)
├── _includes/           # Reusable templates
│   ├── base.njk        # Root HTML wrapper (applied to all pages via global layout)
│   ├── head.njk        # SEO meta tags, favicons, Open Graph
│   ├── header.njk      # Navigation with logo
│   ├── footer.njk      # Footer
│   └── artifact.njk    # Artifact detail page template
├── artifacts/          # Portfolio items (collection)
│   ├── bodach/         # Individual artifact folder
│   │   ├── index.md    # Artifact content
│   │   ├── *.png       # Images directly alongside
│   │   └── *.mp4       # Videos directly alongside
│   ├── [13 more artifacts]
│   └── artifacts.json  # Collection metadata (layout, tags)
├── assets/             # Static assets (pass-through copied)
├── index.md            # Homepage
├── about.md            # About page
└── artifacts.njk       # Artifacts listing page

/dist/                   # Build output (generated)
```

### Template Hierarchy

- All pages use `base.njk` as default layout (set globally in eleventy.config.js)
- `base.njk` includes: head.njk, header.njk, content block, footer.njk
- Artifacts use `artifact.njk` layout (inherits from base.njk)
- Content is injected via `{{ content | safe }}`

### Collections

- **artifacts collection**: Auto-generated from index.md files in `/site/artifacts/*/` subdirectories
- Collection configuration in `/site/artifacts/artifacts.json`
- All artifacts tagged with `["artifacts", "portfolio"]`

## Image Optimization

**All images are automatically optimized at build time** - no manual intervention required!

### How It Works

1. **Markdown images** (`![alt](image.png)`) are automatically converted to responsive `<picture>` elements
2. **Multiple sizes generated**: 400px, 800px, 1200px, 1600px (covers mobile to desktop)
3. **Modern formats**: WebP (smaller, modern) + JPEG (fallback for older browsers)
4. **Lazy loading**: `loading="lazy"` and `decoding="async"` added automatically
5. **GIFs preserved**: Animated GIFs kept as regular `<img>` tags (no conversion)
6. **Thumbnails**: Listing pages use 300px optimized thumbnails via `thumbnailImg` shortcode

### Generated Output

Images are optimized and stored in their artifact folders:
- `/dist/artifacts/[name]/[filename]-400w.webp`
- `/dist/artifacts/[name]/[filename]-800w.jpeg`
- `/dist/artifacts/[name]/thumb-300w.webp` (for listings)

### Manual Control (Optional)

Add attributes to images in markdown for custom behavior:
- `data-no-optimize` - Skip optimization entirely
- `data-sizes="(max-width: 768px) 100vw, 50vw"` - Custom sizes attribute

**Example:**
```html
<img src="image.png" data-no-optimize>
```

### Implementation Files

- `/lib/image-optimize-transform.js` - HTML transform for automatic optimization
- `/lib/image-shortcodes.js` - Shortcodes for thumbnails and manual responsive images
- `/lib/artifact-path-transform.js` - Converts relative paths to absolute
- `/site/_data/eleventyComputed.js` - Pre-processes front matter image paths

### Build Time Impact

- **First build**: ~30 seconds (generates all optimized images)
- **Subsequent builds**: ~2-5 seconds (uses cached optimized images)
- Images are cached in `node_modules/.cache/eleventy-img/`

## Configuration Files

### eleventy.config.js

- Input directory: `site/`
- Includes directory: `site/_includes/`
- Output directory: `dist/`
- Pass-through copy: `site/assets/` → `dist/assets/`, artifact images (source files)
- Global layout: `base.njk`
- Markdown library: markdown-it with HTML support + implicit-figures plugin (figcaption enabled)
- Transforms: `artifactPaths` (path resolution) → `optimizeImages` (automatic optimization)
- Shortcodes: `thumbnailImg`, `responsiveImg`

### .editorconfig

- Default: tab indentation
- JS/JSX/TS files: 2-space indents
- CSS files: 3-space indents

## Creating New Content

### Adding an Artifact

1. Create folder `/site/artifacts/[artifact-name]/`
2. Create `index.md` inside the folder
3. Add front-matter:

```yaml
---
title: Artifact Title
time: nov 2022                    # Display format for time period
subtitle: Brief description
date: 2022-11-15                  # YYYY-MM-DD for sorting
tags: [artifacts, portfolio]      # Required for collection
image: /artifacts/[artifact-name]/cover.png
layout: artifact.njk              # Auto-applied via artifacts.json
---
```

4. Add images/videos directly in the same folder (alongside index.md)
5. Write content in markdown (HTML supported)
6. Reference assets using `/artifacts/[artifact-name]/filename.ext`
7. Images automatically get figcaption support via markdown-it-implicit-figures

### Markdown Features

- Standard markdown syntax supported
- HTML can be embedded directly (html: true in markdown-it config)
- Images with alt text automatically wrapped in `<figure>` tags with `<figcaption>`

## Deployment

**Automatic deployment via GitHub Actions on push to `main` branch.**

### Workflow Steps

1. Checkout code
2. Setup Node.js 20 with npm caching
3. Install dependencies (`npm ci`)
4. Build site (`npm run build`)
5. Install SSH key from secrets
6. Deploy via rsync to production server

### Required GitHub Secrets

- `SSH_PRIVATE_KEY` - Private key for server authentication
- `SSH_HOST` - Server IP address
- `SSH_USER` - SSH username

See detailed setup instructions in `.github/workflows/main.yml` comments.

## Routing

File-based routing (Eleventy default):

- `site/index.md` → `/index.html`
- `site/about.md` → `/about/index.html`
- `site/artifacts/[name].md` → `/artifacts/[name]/index.html`
- `site/artifacts.njk` → `/artifacts/index.html`

## Development Standards

**Always use best practices and modern standards when implementing features:**

### CSS

- Use flexbox/grid for layouts (avoid floats, absolute positioning hacks)
- Use viewport units (`vh`, `vw`) for responsive sizing
- Prefer modern properties: `gap` over margins, logical properties when appropriate
- Use semantic selectors (element selectors, direct child `>`) over unnecessary classes
- Follow the project's minimal styling philosophy - keep HTML semantic and CSS scoped

### Eleventy/Nunjucks

- Use native Nunjucks filters and syntax over custom implementations when possible
- Leverage Eleventy's collections, pagination, and data cascade features
- Keep templates DRY - use includes and layouts appropriately
- Use front matter for page-specific configuration
- Respect the directory structure and naming conventions

### JavaScript (ES6 Modules)

- Use ES6 module syntax (`import`/`export`)
- Use modern JavaScript features: destructuring, arrow functions, template literals, async/await
- Follow the project's minimal JavaScript philosophy - only add JS when necessary
- Respect the `.editorconfig` settings (2-space indents for JS files)

### HTML

- Semantic HTML first - use appropriate elements (`<article>`, `<dl>`, `<nav>`, etc.)

### Markdown

- Use MarkdownLint style

### Code Documentation

- **Always comment liberally** - Future you (and other developers) should understand the code without having to trace through logic
- Use JSDoc-style comments for file-level and function-level documentation
- Include:
  - **Why** the code exists (what problem it solves)
  - **When** it runs (lifecycle timing for transforms, hooks, etc.)
  - **What** it does (with concrete examples)
  - **What it doesn't do** (edge cases, limitations)
  - **How** it works (explain complex regex, logic, algorithms)
- Add inline comments for non-obvious logic, regex patterns, and business rules
- See `/lib/artifact-path-transform.js` and `/site/_data/eleventyComputed.js` as examples of good commenting

### General Principles

- Minimal and intentional - only add what's needed
- Use the most modern standards for development
- Mobile-first and responsive by default
- Keep code readable and maintainable over clever solutions
