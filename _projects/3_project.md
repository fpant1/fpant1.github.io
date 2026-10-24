---
layout: page
title: Agrivoltaic Simulation
description: Modelling how solar panels and crops can share the same land.
img: assets/img/gif1-thumb.webp
poster: assets/img/gif1-poster.webp
image_width: 480
image_height: 286
github: https://github.com/fpant1/AgrivoltaicsDP5Model
featured_order: 1
featured_summary: >-
  How can farmland produce both food and electricity? I built a MATLAB model
  linking solar generation, shade and crop growth, so panel layouts could be
  compared against both energy output and agricultural yield.
importance: 1
category: work
published: true
---

Solar panels and crops both need sunlight. Agrivoltaics brings them onto the same land, making the layout of the panels a question about food production as well as electricity.

## My contribution

As part of my Engineering Design degree, I built a MATLAB digital twin: a computational model of an agrivoltaic system. It brings solar generation and crop growth into one framework, helping compare designs before building them.

<figure class="case-study-media">
  {% include media.liquid path=page.img poster=page.poster alt='Simulation of solar panel rows and the shadows they cast on the ground' width=page.image_width height=page.image_height %}
  <figcaption>A simulated panel array and its changing ground shadows.</figcaption>
</figure>

## How the model works

- **Define the layout.** Set panel geometry, spacing, height and tracking, alongside weather and crop inputs.
- **Follow the light.** Calculate sunlight reaching the panels and the ground, including the shade cast by the array.
- **Estimate crop growth.** Feed the changing light and water conditions into a crop model, comparing shaded land with an open-field baseline.

## What it produced

The result is a reusable simulation for exploring the trade-off between electricity generation and crop yield. It supports comparisons of panel arrangements and growing conditions, including rainfed and irrigated scenarios.

These are modelled scenarios. They help investigate design choices; they do not establish how every farm will perform. The modelling approach and assumptions are documented with the project.

[View the model and technical report on GitHub]({{ page.github }})
