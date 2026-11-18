---
title: This website
date: 2026-11-18
summary: A fast, minimal personal site for writing and side projects. Free to host, and every post is a plain file.
tags: [web]
tech: [Astro, MDX, TypeScript, GitHub Actions, GitHub Pages]
featured: true
draft: false
repo: https://github.com/kwpeckford/kwpeckford.github.io
---

## What it is

The site you're reading: a home for my writing and side projects.

## Why I built it

I wanted a place I fully own, with no platform lock-in and no monthly bill. Adding a new post or project should be as simple as adding a file.

## How it works

- **Astro** turns Markdown files into a static HTML site, with no server and no database.
- **MDX** lets a post embed interactive charts, calculators and diagrams.
- **GitHub Actions** rebuilds the site and publishes it to **GitHub Pages** on every push.
- A strict **Content Security Policy** means the browser runs only the scripts this site built itself.
