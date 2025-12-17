---
title: ARTIFACT TITLE
time: semantic time, can be as specific or nonspecific as you want!
subtitle: brief description or medium or category
date: 2003-10-24
tags:
  - etc
image: cover-image.png
draft: true
---

Brief intro paragraph about the project.

## Section Heading (optional)

More details about the project. You can use:

- Bullet points
- **Bold text**
- *Italic text*
- [Links](https://example.com)

## Images

Use relative paths - they'll auto-expand to `/artifacts/artifact-slug/...`:

![Alt text for image](image-name.png "caption for image")

<!-- Subdirectories work too -->
![Another image](subfolder/image.png)

<!-- Absolute paths for referencing other artifacts or /assets/ -->
![External reference](/artifacts/other-artifact/image.png)

<!-- External URLs work -->
![External image](https://example.com/image.png)

Images with caption text automatically get wrapped in `<figure>` tags with captions.

## Videos

### Local Videos

Use HTML with relative paths (auto-expanded):

<video controls style="max-width:100%;">
  <source src="demo-video.mp4" type="video/mp4">
</video>

### YouTube

Use clean markdown syntax:

@[youtube](VIDEO_ID)

### Vimeo

@[vimeo](VIDEO_ID)

## Credits or Additional Info

Any other details about the project.
