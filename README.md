# Kitchener Peckford — personal website

My writing and side projects. Built with [Astro](https://astro.build) and hosted free on GitHub Pages. Every post is a plain Markdown file in this repo, so I own all of it.

## Run it on your computer

You need [Node.js](https://nodejs.org) 22 or newer.

```bash
npm install      # first time only
npm run dev      # open http://localhost:4321 (drafts are visible here)
```

Before pushing, check that the production build passes:

```bash
npm run build
```

## Write a post

1. Add a file to `src/content/posts/`, for example `my-new-post.md`. The file name becomes the URL (`/writing/my-new-post/`).
2. Put this at the top:

   ```yaml
   ---
   title: "My new post"
   date: 2026-11-18
   summary: "One or two sentences for the list page and RSS."
   tags: [essay]
   draft: true
   ---
   ```

3. Write the post in Markdown below that block.
4. When it's ready, change `draft: true` to `draft: false`, then commit and push. It goes live in about two minutes.

To add charts, calculators or other interactive pieces, name the file `.mdx` and see `src/content/posts/style-guide.mdx` for examples. Diagrams are just a `mermaid` code block.

## Add a project

Make a folder `src/content/projects/<name>/` with an `index.md` inside. Copy the front-matter from `src/content/projects/personal-website/index.md`. Put screenshots in the same folder. Set `featured: true` to show it on the home page.

## How it gets published

Every push to the `main` branch runs `.github/workflows/deploy.yml`. It installs dependencies, checks them for known vulnerabilities, builds the site, and publishes it to GitHub Pages. Progress shows in the repo's **Actions** tab.

## Security

- The site is static HTML: there's no server, database, login or API key to steal.
- Deploys use GitHub's built-in, short-lived token. No secrets are stored in the repo or its settings.
- A Content Security Policy blocks any script the site didn't build itself.
- Only accounts with write access can change the site. Keep GitHub two-factor authentication on, and keep the `main` branch protected (Settings → Branches).
- Dependabot opens a pull request when a dependency needs an update.

## Where things live

| What | Where |
| --- | --- |
| Posts | `src/content/posts/` |
| Projects | `src/content/projects/` |
| Name, email, social links | `src/site.ts` |
| About page | `src/pages/about.astro` |
| Colours, fonts, spacing | top of `src/styles/global.css` |
| Home page portrait (optional) | `src/assets/portrait.jpg` |
| Site URL / domain | `astro.config.mjs` (`SITE_URL`) |

More detail for AI-assisted maintenance is in [CLAUDE.md](CLAUDE.md).
