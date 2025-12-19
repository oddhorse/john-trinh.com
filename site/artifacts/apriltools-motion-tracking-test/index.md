---
title: apriltools motion tracking test
time: may 2022
subtitle: blender
date: 2022-05-01
tags:
  - tech
  - 3d
  - silly + fun
image: hdri-of-my-living-room.png
---

<video controls width="100%" loop>
  <source src="magic.mov" type="video/quicktime">
  Your browser does not support the video tag.
</video>

<video controls width="100%">
  <source src="the-raw-footage.mov" type="video/quicktime">
  Your browser does not support the video tag.
</video>

![hdri of my living room](hdri-of-my-living-room.png)

![render](render.png)

my first attempt at a few things: motion tracking, photorealistic 3d, integrating 3d renders into real footage, and compositing for vfx. no purpose. i just wanted to do it.

started with [university of michigan's apriltags](https://github.com/thegoodhen/AprilTools) to track camera movement in blender.

to match the room lighting, i used an app called hdreye to stitch together an HDRI in absence of a real 360deg camera. the stitching is never good on there but perfectly fine for reflections and lighting i think!

i picked random free models from a 3d asset site and placed them in the scene. only other component i needed was a shadow catcher that matched the table.

most important step for matching the live footage was turning on motion blur in blender rendering! the only real headache was matching color spaces between the HDRI and my iphone's weird prores 10-bit log color-space.

compositing, color grading, and the glow-in visual effect were all done in davinci resolve.
