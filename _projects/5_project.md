---
layout: page
title: Optimising Robotic Search Algorithms
description: Comparing how a small robot searches for targets accurately and efficiently.
img: assets/img/robot-thumbnail.webp
image_width: 480
image_height: 480
poster: assets/img/robot-poster.webp
github: https://github.com/Aasavmp/Robotics-Systems-A2
featured_order: 2
featured_summary: >-
  A fast search is not always a thorough one. With Aasav Patel, I tested search
  patterns on a small mobile robot. The experiments showed how path spacing
  changes the balance between finding more targets and locating them accurately.
importance: 2
category: work
published: true
---

How should a robot search an area when it needs to find targets quickly and record their positions accurately?

## Our approach

In this joint project with Aasav Patel, we programmed a Pololu 3Pi+ robot and tested sine-wave and square-wave search paths at different spacings and speeds. We compared targets found, position error and time per target.

<figure class="case-study-media">
  {% include media.liquid path=page.img poster=page.poster alt='A small mobile robot searching a paper test area marked with black targets' width=page.image_width height=page.image_height %}
  <figcaption>The robot searching for marked targets in the test environment.</figcaption>
</figure>

## What we found

Closer search paths improved coverage, while wider paths improved position accuracy. The choice of pattern depended on which mattered most: finding more targets, locating them precisely, or reducing search time.

The experiments used a controlled paper test area. They show trade-offs within that setup, rather than a universal best search strategy.

[View the code and joint report on GitHub]({{ page.github }})
