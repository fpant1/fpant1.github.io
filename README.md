# Frank Panton's portfolio

Personal website at [fpant1.github.io](https://fpant1.github.io), built with Jekyll and Liquid from the [al-folio theme](https://github.com/alshedivat/al-folio).

[![Check and deploy site](https://github.com/fpant1/fpant1.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/fpant1/fpant1.github.io/actions/workflows/deploy.yml)

## Quick start

On the Windows machine with the preconfigured portable tools, activate them from the repository root before using the commands below:

```powershell
. .\artifacts\activate-tools.ps1
```

This optional helper is local to this checkout and ignored by Git. For a fresh clone or another machine, follow the installation steps below.

Install **Ruby 3.3.12** (with Devkit on Windows), **Bundler 2.6.9**, and **Node.js 24** with npm. Versions are recorded in `.ruby-version`, `.node-version` and the lockfiles. Python and a venv are not needed for the website.

On Windows, use [RubyInstaller](https://rubyinstaller.org/downloads/) and install the MSYS2 development tools when prompted. Open a new PowerShell window after installing Ruby and [Node.js](https://nodejs.org/).

Run from this repository:

```powershell
ruby --version
node --version
gem install bundler -v 2.6.9 --no-document
bundle config set --local path vendor/bundle
bundle install
npm ci
npx playwright install chromium
npm run dev
```

Open **http://localhost:4000**. Stop the server with Ctrl+C. Restart it after editing `_config.yml`. On Linux CI, install browser system libraries with `npx playwright install --with-deps chromium`.

Do not delete `Gemfile.lock` or `package-lock.json` to fix an installation error. They keep local builds and CI aligned.

## Test before publishing

```powershell
# Fix formatting, then run the complete suite.
npm run format
npm test
```

`npm test` runs formatting, JavaScript and SCSS linting, YAML/front-matter validation, a production Jekyll build, CSS purging, internal-link/HTML checks, and Chromium accessibility/layout tests. The browser tests use the same purged output that is deployed.

Individual commands:

| Command                      | Purpose                                                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- |
| `npm run check`              | Formatting and source lint checks                                                                     |
| `npm run build`              | Production build and CSS optimisation into `_site/`                                                   |
| `npm run test:site`          | Built-page links, anchors, landmarks, image metadata, thumbnail size budget and deployment exclusions |
| `npm run test:ui`            | Desktop, tablet and mobile checks in light/dark themes; menu, keyboard, motion and hero tests         |
| `npm run preview`            | Serve the production build at http://127.0.0.1:4173                                                   |
| `npx playwright show-report` | Open the most recent browser report                                                                   |
| `npm run media:robot`        | Regenerate the smaller robotics animation and reduced-motion poster                                   |

Run `npm run build` before `test:site`, `test:ui` or `preview`. Browser tests start their own preview server. Close an old preview server before testing a different build if needed.

Workflow syntax is also checked by **actionlint 1.7.12** in CI. If installed locally, run `actionlint` from the repo root.

An optional pre-commit hook is provided for people already using pre-commit: `pre-commit install`. CI always runs the checks, so this Python-based hook is not required.

## Deploy to GitHub Pages

### One-time migration from the old gh-pages branch

This repository now publishes a **tested build artifact** using GitHub Actions.

1. Open [Settings → Pages](https://github.com/fpant1/fpant1.github.io/settings/pages).
2. Under **Build and deployment**, choose **Source: GitHub Actions**.
3. Merge the refactor into `main`.
4. In repository branch rules, require the **Lint, build and test** check before merging.

The old `gh-pages` branch is no longer the publishing source. Do not run the old destructive deployment procedure or edit generated HTML. `bin/deploy` now only prints guidance.

### Publish changes

```powershell
git switch -c update/my-change
# Edit files.
npm run format
npm test
git add .
git commit -m "Describe the website change"
git push -u origin update/my-change
```

Open a pull request into `main`. After checks pass, merge it. A push to `main` starts [Check and deploy site](https://github.com/fpant1/fpant1.github.io/actions/workflows/deploy.yml). Publishing depends on all checks passing and uses that exact build. PRs never publish.

To redeploy the current `main` without a new commit, choose **Actions → Check and deploy site → Run workflow → main**. With the optional GitHub CLI:

```powershell
gh workflow run deploy.yml --ref main
gh run list --workflow deploy.yml --limit 5
```

To roll back, revert the unwanted source commit through a PR and merge it. This rebuilds and tests the reverted site. Do not force-push generated branches.

Keep `url: https://fpant1.github.io` and an empty `baseurl` in `_config.yml` for this user-site repository.

## Edit the website

| What to change                            | Source                                    |
| ----------------------------------------- | ----------------------------------------- |
| Navigation labels and order               | `_data/navigation.yml`                    |
| Homepage biography/photo                  | `_pages/about.md`                         |
| Projects                                  | `_projects/*.md`                          |
| Blog posts                                | `_posts/YYYY-MM-DD-title.md`              |
| CV                                        | `_data/resume.json`                       |
| Contact links                             | `_data/socials.yml`                       |
| Metadata, feature flags, CV section order | `_config.yml`                             |
| Shared markup                             | `_includes/`                              |
| Page composition                          | `_layouts/`                               |
| Shared spacing, widths and components     | `_sass/_layout.scss`, `_sass/components/` |

Use `content_width: reading` (default) or `content_width: wide` in front matter. Page titles never determine layout. Content authors should not add global container/header CSS.

The CV is generated from one data file. Its existing public JSON URL is generated from that same source. To offer a real PDF, put it in `assets/pdf/` and set `cv_pdf: your-cv.pdf` in `_pages/cv.md`. The placeholder download has been removed.

The robotics card uses `robot-thumbnail.webp`, preserving the full 137-frame, 10.96-second loop at about 2 MB instead of 91 MB. The original GIF remains available for regeneration but is excluded from publication. Cards lazy-load images and show a still poster when reduced motion is requested.

Unpublished theme examples remain available as references. Published book/news/archive URLs are retained. Before enabling a demo that needs an optional library or plugin, follow its front matter and add the necessary dependency explicitly.

See [architecture and maintenance](docs/architecture.md) for component boundaries and test coverage.

## Docker alternative

Docker Desktop can provide Ruby and Node without host installations:

```powershell
docker compose up --build
```

Open http://localhost:4000. After changing dependencies, rebuild the image and recreate the dependency volume:

```powershell
docker compose down --volumes
docker compose up --build
```

The named volume contains only installed Node dependencies. Source files are bind-mounted from this repository.

To run the full test suite inside the development container:

```powershell
docker compose run --rm web sh -c "npm ci && npx playwright install --with-deps chromium && npm test"
```

## Troubleshooting

- **Ruby or bundle is missing:** install the pinned Ruby version and Bundler, then reopen your terminal.
- **Native extension compilation fails on Windows:** run `ridk install`, select the MSYS2 development toolchain, then retry `bundle install`.
- **PowerShell blocks npm.ps1:** use `npm.cmd` and `npx.cmd` instead; no execution-policy change is needed.
- **Browser executable missing:** run `npx playwright install chromium`.
- **Formatting fails:** run `npm run format`, inspect the diff, then rerun `npm run check`.
- **Pages deployment fails after tests pass:** verify the one-time GitHub Pages source setting above and the `github-pages` environment allows `main`.
- **A CDN is unavailable:** network-dependent fonts/galleries may fail browser checks. Check the reported resource before rerunning; do not remove the check to hide the failure.

## Attribution

The original al-folio theme and its bundled third-party assets retain their licenses. See [LICENSE](LICENSE). This README documents this portfolio, rather than the upstream theme's installation and publishing workflows.
