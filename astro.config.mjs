// @ts-check
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeCallouts from 'rehype-callouts';

export default defineConfig({
  site: 'https://actualfuckingwebsite.com',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: false,
    },
    processor: unified({
      rehypePlugins: [rehypeCallouts],
    }),
  },
});
