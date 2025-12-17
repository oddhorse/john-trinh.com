---
title: ARTIFACT TITLE
time: semantic time, can be as specific or nonspecific as you want!
subtitle: brief description or medium or category
date: 2003-10-24
tags: 
  - etc
image: /artifacts/artifact-slug/cover-image.png
draft: true
---

Brief intro paragraph about the project.

## Section Heading (optional)

More details about the project. You can use:

- Bullet points
- **Bold text**
- *Italic text*
- [Links](https://example.com)

<!-- Recommended: Use relative paths for images in this artifact folder -->
![Alt text for image](image-name.png "caption for image")

<!-- Also works: Subdirectories -->
![Another image](subfolder/image.png)

<!-- Absolute paths still work (for referencing other artifacts or /assets/) -->
![External reference](/artifacts/other-artifact/image.png)

<!-- External URLs work -->
![External image](https://example.com/image.png)

Images with caption text at end automatically get wrapped in `<figure>` tags with captions.

## Embedded HTML (if needed)

You can embed HTML directly.

Note: HTML video/img tags still need absolute paths (auto-prefixing only works for markdown images):

<video controls style="max-width:100%;">
  <source src="/artifacts/artifact-slug/video.mp4" type="video/mp4">
</video>

## Credits or Additional Info

Any other details about the project.
