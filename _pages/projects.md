---
layout: page
title: projects
permalink: /projects/
content_width: reading
description: Engineering, sustainability, and software projects.
---

{% assign sorted_projects = site.projects | sort: 'importance' %}
<div class="project-grid">
  {% for project in sorted_projects %}
    {% include project-card.liquid project=project %}
  {% endfor %}
</div>
