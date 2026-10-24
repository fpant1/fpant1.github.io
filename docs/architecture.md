# Architecture and maintenance

## Shared page structure

`_layouts/default.liquid` owns the document, navigation, main landmark, footer, and shared asset loading. The header uses the same brand, navigation items, font weights, and geometry on every route. Its sticky position stays in normal document flow, so the content needs no guessed header-height padding.

Navigation comes from `_data/navigation.yml`. Active items use `aria-current` and the accent colour; they do not change font weight or width. On small screens the menu expands in document flow, closes with Escape, and restores focus. Links remain usable with JavaScript disabled.

Layouts compose shared includes:

- `page-heading.liquid`: page title, optional description and metadata.
- `media.liquid`: image loading, intrinsic dimensions and optional reduced-motion poster.
- `project-card.liquid`: project media, title, description and separate source link; its featured variant uses a summary and a level-three heading beneath the homepage section heading.
- `post-summary.liquid`: blog index entries.
- `resume/entry.liquid`: work, education and other dated CV entries.

Keep prose in Markdown and data in `_data/`. Avoid duplicating rendering loops inside page content and its layout. The blog layout renders `content` before its shared post list.

## CSS ownership

`_sass/_layout.scss` defines site width, reading width, gutters, spacing, landmarks and sidebar layout. `_sass/components/` contains navigation, hero, content, project-card and CV styles. `assets/css/main.scss` is the only Sass entry point.

The header and wide pages span the viewport with small edge gutters. The `home` width variant removes the gap below the header and uses an asymmetric hero: thin Inter text aligned low on the left, with the portrait on the right. Its heading remains available to assistive technology without repeating the visible header name. Reading pages retain a constrained line length; mobile uses a single column with the portrait before the introduction and natural content height.

The remaining theme styles support existing post, book and optional feature markup. Vendored icon styles are excluded from linting. The abandoned `custom.scss` and duplicate About layout have been removed. Do not reintroduce global Bootstrap `.container` overrides or viewport-sized hero children.

## Design decisions

The visual direction follows Frank's original portfolio and the [Impeccable design review guidance](https://impeccable.style/slop/). Treat automated design findings as prompts for judgment, not reasons to replace the site's identity.

- Keep the large name on the left and the navigation at the far right, aligned to the same outer gutters as the content. Keep their geometry identical between pages.
- Retain Inter: light 300 for the introduction and navigation, regular 400 for section titles, bold 700 for the name. The asymmetry and empty space on the homepage are intentional. Long-form reading columns stay constrained.
- Use white or charcoal surfaces with one magenta accent (`#8b208c` in light mode, `#d68bd6` in dark mode). Project titles use the text colour at rest; reserve accent colour for navigation state, links and interaction.
- Photographs and project thumbnails have square corners. Present projects as images with captions, without decorative card borders, shadows or background panels. Use spacing to separate projects.
- New visitors start in light mode, regardless of device preference. Saved dark/light/system choices are respected. The theme control uses a thin SVG outline and a minimum 44px target. Its icon reflects the displayed theme; its accessible label and tooltip identify the current preference and next action, including system mode.
- Use balanced headings and natural paragraph wrapping. Avoid new badge rows, metrics, decorative labels, gradients, icon tiles, hover movement and entrance animations unless the content gives them a purpose.
- Theme transitions affect colours only. Respect reduced-motion settings and keep keyboard focus visible.

When changing shared styles, inspect About, Projects, Blog and CV in both themes at desktop and mobile sizes. Check the actual composition alongside the existing layout, accessibility, keyboard and reduced-motion tests.

## Content and media

The sole CV source is `_data/resume.json`. `assets/json/resume.liquid` preserves its public JSON URL. Do not edit generated `_site/` files.

Card thumbnails are separate from original media. Keep animation frame count, timing and loop behaviour when compressing. Use `poster` metadata for animations so reduced-motion visitors receive a still image. The robotics original is excluded from the build, but retained for regeneration.

The homepage selects up to two projects with `featured_order`, sorted numerically, and uses each project's `featured_summary` to explain the problem, contribution and outcome. Keep those fields on the project itself so the homepage reuses the same media and destination as the project grid. Featured projects should have a readable local case study, with a separate `github` link for code and reports. The homepage's email action reads `_data/socials.yml`; its social icons omit the duplicate email link.

The agrivoltaics story is grounded in the existing CV and [model repository](https://github.com/fpant1/AgrivoltaicsDP5Model). The robotics story credits Aasav Patel and Frank Panton, matching the [joint project report summary](https://github.com/Aasavmp/Robotics-Systems-A2). Keep simulated results distinct from field measurements and do not invent performance figures or individual responsibilities.

The former placeholder CV PDF is not linked. Set `cv_pdf` only when an actual CV PDF is available. Existing personal project/blog content and routes are preserved; unpublished theme demos are retained for reference.

## Quality and publication

Production CSS is compiled by Sass and trimmed by PurgeCSS. Owned JavaScript is minified by Node/Terser after Jekyll finishes. The old Ruby minification plugins were removed: they repeatedly initialized JavaScript engines and made Windows builds slow; one also swallowed compilation errors. HTML is left readable, and any error in the Node build step fails publication.

`npm test` is the local end-to-end check. It runs the same source checks, build, link checks and browser suite as CI. Browser checks run after PurgeCSS, so dynamically activated navigation/theme/gallery styles must survive in the published output. Add dynamic selectors to `purgecss.config.js` with a corresponding behavioural test when necessary.

Checks cover:

- YAML/front-matter syntax, existing layouts and explicit width variants.
- JavaScript correctness and SCSS rules across owned source files.
- Local files, anchors, duplicate IDs, one main landmark and one h1 per generated page.
- Image alt attributes and a 2.5 MiB per-card thumbnail budget.
- Development files and the large source GIF excluded from publication.
- Main routes plus project and blog details at 390px, 768px and 1280px.
- Both colour themes, accessibility, browser exceptions, header geometry and horizontal overflow.
- Keyboard navigation, Escape, no-JavaScript navigation, reduced motion and visible hero media.

The workflow builds once and publishes the verified artifact only from `main`. Required PR checks must also be enabled in GitHub branch rules. The workflow itself prevents publication if its checks fail, including direct pushes.

## Retired workflows

The old independent formatting/accessibility/link jobs have been consolidated into the deployment gate. The generated-HTML formatter, automatic documentation commits, upstream Docker publishing jobs, and Lighthouse workflow targeting the upstream demo have been removed. CodeQL is retained.

A performance budget for project media replaces the misleading upstream Lighthouse badge. For broader performance work, run Lighthouse against this site's actual production or preview URL and record the measured viewport and network profile.

## Updating dependencies

Update dependencies intentionally in a branch, keep both lockfiles, and run the full suite. Ruby and Node versions must agree across version files and Docker. Use `npm audit` and `bundle outdated` during maintenance; lint/build dependencies do not ship as browser runtime packages. Review upstream advisories against the way tools are used rather than applying major upgrades automatically.

As of 18 October 2026, npm audit reports an unpatched transitive `braces` advisory ([GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)) through lint/build glob dependencies. These tools receive repository-controlled glob patterns, not website visitor input. Recheck for an upstream fix when updating dependencies; do not force a downgrade that breaks the toolchain.
