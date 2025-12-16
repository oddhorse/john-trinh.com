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

## Configuration Files

### eleventy.config.js
- Input directory: `site/`
- Includes directory: `site/_includes/`
- Output directory: `dist/`
- Pass-through copy: `site/assets/` → `dist/assets/`
- Global layout: `base.njk`
- Markdown library: markdown-it with HTML support + implicit-figures plugin (figcaption enabled)

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
