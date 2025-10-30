---
title: glove midi controller
time: feb 2025
subtitle: hardware
date: 2025-02-01
tags:
  - tech
  - performance
  - hardware
image: /assets/images/glove-controller/demo-video.mp4
---

<video controls width="100%">
  <source src="/assets/images/glove-controller/demo-video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

![conductive fabric on fingers](/assets/images/glove-controller/conductive-fabric-on-fingers.jpeg "conductive fabric on fingers")

![image](/assets/images/glove-controller/image-3.jpg)

i wanted a midi controller that wasn't stuck in one place on stage, burdened by wired connections, or gesture-based (eg. imogen heap's mimu). 

typical stationary midi controllers keep you locked to their location on stage. gesture-based controls on wearable controllers necessarily tie every movement you make to control changes, keeping your motion locked to your functional control scheme. with this glove controller, i can move around as crazy as i want on stage and have all my controls right on me! any control sent from the glove must be deliberately triggered by my actions.

! ! ! currently fabricating for stage use; everything shown here is implemented with a prototyping breadboard.

three control types, as demonstrated in the video:

note (outputs midi note on trigger)
momentary cc (toggles cc output for duration of trigger)
dial cc (updates cc output based on wrist rotation for duration of trigger)

works on thumb-to-finger contact. conductive fabric is sewn onto the pads of the fingers and thumb. each finger is connected to a control pin, and the thumb is connected to ground. while the exposed conductive surfaces aren't ideal, i found that using pull-up resistors effectively limits the range of valid signal strengths for a closed connection, and normal stage equipment—mic chassis, metal stands, macbook shells—did not cause unwanted connections.

uses adafruit itsybitsy nrf52840 microcontroller for its tiny footprint and built-in support for ble midi (underrated platform btw). programmed in c++ using arduino platform libraries and platformio microcontroller dev environment. code [here](https://github.com/oddhorse/horse-controller/tree/0.0.2)
