// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(),
    starlight({
      title: 'LureGuard.ai Docs',
      social: [
        { label: 'GitHub', href: 'https://github.com/MajdKhalaf12/LureGuard.ai', icon: 'github' },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { slug: 'guides/01-overview', badge: { text: 'Core', variant: 'tip' } },
            { slug: 'guides/07-quickstart', badge: { text: 'New', variant: 'success' } },
            { slug: 'guides/02-architecture', badge: { text: 'Pipeline', variant: 'note' } },
          ],
        },
        {
          label: 'Core Engines & Defense',
          collapsed: false,
          items: [
            { slug: 'guides/03-ml-engine', badge: { text: 'AI', variant: 'tip' } },
            { slug: 'guides/04-decision-engine', badge: { text: 'Security', variant: 'danger' } },
            { slug: 'guides/05-byollm', badge: { text: 'BYOLLM', variant: 'caution' } },
          ],
        },
        {
          label: 'Operations & Reference',
          items: [
            { slug: 'guides/06-api-operations', badge: { text: 'REST', variant: 'note' } },
            { slug: 'guides/08-configuration', badge: { text: 'Config', variant: 'note' } },
          ],
        },
        {
          label: 'Resources & External',
          items: [
            { label: 'Main Platform Dashboard', link: '/' },
            {
              label: 'GitHub Repository',
              link: 'https://github.com/MajdKhalaf12/LureGuard.ai',
              attrs: { target: '_blank', rel: 'noopener noreferrer' },
            },
            {
              label: 'Wazuh Documentation',
              link: 'https://documentation.wazuh.com/',
              attrs: { target: '_blank', style: 'font-style: italic' },
            },
          ],
        },
      ],
    }),
  ]
});