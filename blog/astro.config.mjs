import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://multinex.app',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Multinex',
      customCss: ['./src/styles/tailwind.css'],
      description: 'Documentation for Multinex.',
      logo: {
        src: '/src/assets/logo.png',
        alt: 'Multinex',
      },
      head: [
        // Add your script tags here. Below is an example for Google analytics, etc.
        {
          tag: 'script',
          attrs: {
            src: 'https://www.googletagmanager.com/gtag/js?id=GTM-WLRRFD65',
          },
        },
        {
          tag: 'script',
          content: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', '<YOUR-GOOGLE-ANALYTICS-ID>');
          `,
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/bmuzuraimov/Multinex',
      },
      components: {
        SiteTitle: './src/components/MyHeader.astro',
        ThemeSelect: './src/components/MyThemeSelect.astro',
        Head: './src/components/HeadWithOGImage.astro',
        PageTitle: './src/components/TitleWithBannerImage.astro',
      },
      social: {
        github: 'https://github.com/bmuzuraimov/Multinex',
      },
      sidebar: [
        {
          label: 'Start Here',
          items: [
            {
              label: 'Introduction',
              link: '/',
            },
          ],
        },
        {
          label: 'Guides',
          items: [
            {
              label: 'Example Guide',
              link: '/guides/example/',
            },
          ],
        },
        {
          label: 'Start',
          items: [
            {
              label: 'Prerequisites',
              link: '/start/prerequisites/',
            },
            {
              label: 'Installation',
              link: '/start/installation/',
            },
            {
              label: 'Setup',
              link: '/start/setup/',
            },
          ],
        },
        {
          label: 'Project Structure',
          link: '/structure/',
        },
        // Optional
        // {
        //   label: 'Data Model',
        //   link: '/model/',
        // },
      ],
      plugins: [
        starlightBlog({
          title: 'Blog',
          customCss: ['./src/styles/tailwind.css'],
          authors: {
            Dev: {
              name: 'Baiel',
              title: 'Founder @ Multinex',
              picture: '/founder.jpeg', // Images in the `public` directory are supported.
              url: 'https://multinex.app',
            },
          },
        }),
      ],
    }),
    tailwind({ applyBaseStyles: false }),
  ],
});
