// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// SITE_URL is the public address of the site. Change it once the custom
// domain (or GitHub Pages URL) is known. RSS and the sitemap depend on it.
const SITE_URL = 'https://kitchnr.ca';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  // Content Security Policy: the browser will only run scripts this site
  // itself built (each one is fingerprinted with a hash). Injected or
  // third-party scripts are blocked. See CLAUDE.md before loosening it.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      // Shiki (code highlighting) and Mermaid (diagrams) use inline styles.
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
    },
  },
  vite: {
    // Mermaid (diagrams) is large but only downloads on pages that use it.
    build: { chunkSizeWarningLimit: 2000 },
  },
  markdown: {
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid', 'math'] },
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
      wrap: false,
    },
  },
});
