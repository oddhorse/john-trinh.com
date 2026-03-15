---
name: design-playground
description: Generate interactive design decision playgrounds for testing fonts, colors, spacing, and layouts. Opens automatically in browser for live testing. Use when user needs to make visual design choices.
allowed_tools:
  - Read
  - Write
  - Bash
  - Glob
---

# Design Playground Skill

## Purpose

Helps users make design decisions through interactive browser-based playgrounds instead of iterative back-and-forth that creates code bloat.

## When to Use

- User needs to choose fonts, colors, spacing, or layouts
- User says "help me pick..." or "show me options for..."
- User wants to test design decisions visually
- User needs to make aesthetic choices before implementation

## Workflow

1. **Ask what to test** (fonts, colors, spacing, layouts)
2. **Generate playground HTML** using appropriate template
3. **Auto-open in browser** using `open` command
4. **User interacts** with playground in browser
5. **User exports choice** via "Export" button in playground
6. **User provides exported tokens** back to Claude
7. **Claude implements** tokens in project files

## Templates Available

- `font-picker.html` - Test font pairings with real content
- `color-palette.html` - Test color schemes
- `spacing-tester.html` - Test spacing scales
- `layout-tester.html` - Test layout options

## How to Generate Playground

1. Read the appropriate template from `.claude/skills/design-playground/templates/`
2. Customize with user's actual content (read from their project)
3. Write to `/tmp/design-playground-[type].html`
4. Open automatically: `open /tmp/design-playground-[type].html` (macOS)
5. Tell user the playground is open
6. Wait for user to provide their choice

## Export Format

User will copy design tokens from playground export. Format:

```json
{
  "fonts": {
    "heading": "...",
    "body": "...",
    "mono": "..."
  },
  "colors": {
    "text": "...",
    "background": "...",
    "accent": "..."
  },
  "spacing": {
    "scale": "..."
  }
}
```

## Implementation

After user provides exported tokens:
1. Parse the JSON
2. Convert to CSS custom properties
3. Write to project's CSS file
4. Explain what was implemented

## Important Notes

- Always use real content from user's project (not Lorem Ipsum)
- Open browser automatically - don't make user do it
- Keep playgrounds simple and focused (one decision type at a time)
- Export must be easy (one-click copy)
- Clean up after: delete temp files when done
