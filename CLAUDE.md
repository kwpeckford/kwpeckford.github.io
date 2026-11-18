# CLAUDE.md — Kitchener Peckford's personal website

Instructions for Claude Code sessions working on this repo. Read this first and follow it.

## What this is

A static personal site (blog + side projects) built with **Astro 7**, written in Markdown/MDX, and deployed for free to **GitHub Pages** by GitHub Actions on every push to `main`. There is no server, no database, no paid service and no API key.

## Ground rules

1. **Keep Kitchener's writing exactly as written.** When importing or editing posts, fix only formatting (headings, lists, links, code fences, front-matter). Never reword, "improve", shorten or add to the prose unless he explicitly asks.
2. **Never add secrets.** The site needs none. Don't add `.env` files, API keys, tokens, analytics keys or third-party scripts. If a feature seems to need one, stop and ask.
3. **No third-party scripts, fonts or CDNs.** Everything is self-hosted through npm, so it passes the Content Security Policy (see Security). Ask before adding any external service.
4. **No paid services.** Ask before anything that costs money or touches his accounts (GitHub settings, DNS, domain).
5. **Run `npm run build` before committing.** It type-checks, validates every post's front-matter, and fails on mistakes. Never push a failing build.
6. Keep the design minimal. Change colours, fonts and spacing through the tokens at the top of `src/styles/global.css`, not with one-off values.

## Project structure

```
src/
  content/
    posts/              one .md or .mdx file per post (file name = URL slug)
    projects/           one folder per project: <slug>/index.md(x) + images
  content.config.ts     required front-matter fields (schema) for posts and projects
  components/
    embeds/             interactive pieces usable inside MDX posts (Chart, CommissionCalculator, Callout)
    CodeEnhance.astro   copy buttons on code blocks + Mermaid diagram rendering
    Header / Footer / PostList / ProjectCard / ProjectGrid / ThemeToggle
  layouts/
    Base.astro          <html> shell: meta tags, theme script, header/footer
    Post.astro          article layout used by posts and project pages
  pages/                routes: index, about, 404, rss.xml, robots.txt,
                        writing/ (index, [...slug], tags/[tag]), projects/ (index, [...slug])
  styles/global.css     design tokens (light + dark) and base typography
  assets/               optional portrait.jpg for the home page hero
  site.ts               name, email, LinkedIn, GitHub URL, nav links
  lib.ts                helpers: getPosts/getProjects (handle drafts + sorting), dates, tags
public/                 favicon and files served as-is
astro.config.mjs        site URL, integrations, Markdown/Shiki settings, CSP
.github/workflows/deploy.yml   build + deploy to GitHub Pages
.github/dependabot.yml         monthly dependency update PRs
```

## Add a new post

1. Create `src/content/posts/<slug>.md`. Use `.mdx` only if the post embeds components. The slug becomes the URL: `/writing/<slug>/`.
2. Start with this front-matter. All fields are validated:

   ```yaml
   ---
   title: "The post title"
   date: 2026-11-18            # YYYY-MM-DD; drives sort order (newest first)
   summary: "One or two sentences shown in lists, RSS and search results."
   tags: [essay, AI]           # optional; free-form; each tag gets a /writing/tags/<tag>/ page
   draft: false                # true = visible in `npm run dev` only, never published
   # updated: 2026-12-01       # optional
   ---
   ```

3. Write the body in Markdown. Don't repeat the title as an `# H1`; the layout renders it. Start body headings at `##`.
4. Images: put them next to the post (or in `src/assets/`) and reference them with a relative path, e.g. `![Alt text](./my-image.png)`. Always write alt text.
5. Run `npm run build`, then commit and push.

Recommended tags: `essay`, `technical`, `AI`, `work`, `personal`. Reuse existing tags before inventing new ones (run `grep -h "^tags:" src/content/posts/*` to list them).

## Add a new project

1. Create the folder `src/content/projects/<slug>/` with an `index.md` (or `index.mdx`). URL: `/projects/<slug>/`.
2. Front-matter:

   ```yaml
   ---
   title: "Project name"
   date: 2026-11-18
   summary: "One sentence for the card."
   tags: [tool]                # first tag shows as the pill on the card
   tech: [Python, Astro]       # shown on the card and as "Built with"
   featured: true              # true = shown on the home page (max 3, newest first)
   draft: false
   repo: https://github.com/user/repo   # optional; renders a "Code on GitHub" button
   demo: https://example.com            # optional; renders a "Live demo" button
   cover: ./cover.png          # optional; image in the same folder, used on the card + page
   coverAlt: "Describe the screenshot"
   ---
   ```

3. Body: use the sections **What it is**, **Why I built it**, **How it works / Tech**, **Screenshots or demo**.
4. Screenshots go in the same folder; reference them with `![alt](./screenshot.png)`.

## Add an interactive element to a post

Posts that embed components must be `.mdx`. Import components after the front-matter:

```mdx
import Chart from '../../components/embeds/Chart.astro';
import CommissionCalculator from '../../components/embeds/CommissionCalculator.astro';
import Callout from '../../components/embeds/Callout.astro';

<Chart title="Payout by quarter" type="bar" labels={['Q1','Q2']} series={[{ name: '2026', values: [10, 20] }]} unit="k" />
<CommissionCalculator target={500000} baseRate={4} accelRate={7} />
<Callout title="Note">Text</Callout>
```

`src/content/posts/style-guide.mdx` (a permanent draft) demonstrates every feature. Keep it working.

### Writing a new embed

Copy `src/components/embeds/CommissionCalculator.astro` as the template:

- Render the markup on the server, wrapped in `<div class="embed" data-my-thing ...>`. Put settings in `data-` attributes.
- Put behaviour in a plain `<script>` block (no `is:inline`, no `define:vars`). Astro bundles it into a file, so it passes the CSP. Use `document.querySelectorAll('[data-my-thing]')` so several instances work on one page.
- Prefer computing things at build time (like `Chart.astro`, which draws SVG and ships zero JS).
- Use the CSS tokens (`var(--text)`, `var(--rule)`, `var(--card)`...) so it works in light and dark mode.
- If you need a library (for example a charting lib), install it with npm and import it inside the `<script>`. Never load it from a CDN.
- Make it accessible: labels for inputs, `aria-live` for changing results, and a text or table fallback for visuals.

### Diagrams

Write a fenced code block with the language `mermaid`. It renders as a diagram, follows the light/dark theme, and loads Mermaid only on pages that contain one.

### Code blocks

Fenced code blocks with a language (`ts`, `python`, `sql`, `bash`, ...) are highlighted at build time by Shiki and get a Copy button automatically.

## Preview locally

```bash
npm install        # first time only
npm run dev        # http://localhost:4321, live reload, drafts visible
npm run build      # production build into dist/ (drafts excluded); must pass before pushing
npm run preview    # serve the production build, the only mode where the CSP is active
```

In the Claude desktop app, `.claude/launch.json` defines the `site` preview server.

## How deploys work

- Pushing to `main` triggers `.github/workflows/deploy.yml`: `npm ci` → `npm audit` (fails on high/critical vulnerabilities) → `npm run build` → upload `dist/` → deploy to GitHub Pages. It takes about 1–2 minutes. Check the **Actions** tab on GitHub if a deploy fails.
- The workflow uses only GitHub's short-lived built-in token, with `contents: read`, `pages: write` and `id-token: write`. No secrets are configured or needed.
- `site` in `astro.config.mjs` must match the public URL, because canonical links, RSS and the sitemap use it. Update it if the domain changes. With a custom domain, also add `public/CNAME` containing just the domain.
- Dependabot opens monthly PRs for npm and Actions updates. To merge one: check it out, run `npm run build`, and merge if it passes.

## Security

- **Content Security Policy** (configured in `astro.config.mjs` under `security.csp`): scripts run only from this site, each one hash-pinned by Astro, and styles are limited to this site plus inline styles (Shiki and Mermaid need them). Fonts are self-hosted. Don't loosen these directives without asking. The CSP is not applied in `npm run dev`, so test embeds with `npm run build && npm run preview`.
- Mermaid runs with `securityLevel: 'strict'`.
- `.gitignore` excludes `.env*`, `*.pem` and `*.key`.
- Repository protection (branch protection, 2FA) is configured in GitHub settings by Kitchener. See README.

## Personal details

Name, email, LinkedIn, GitHub and location live in `src/site.ts`. The bio is in `src/pages/about.astro`. It is written in Kitchener's own words (from his answers, with only spoken filler removed). Don't rewrite it. Ask him for new wording instead.
