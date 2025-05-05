import starlightPlugin from '@astrojs/starlight-tailwind';
import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#FFFBEF',
          100: '#FFF7DE',
          200: '#FFF2C8',
          300: '#FFEAB7',
          400: '#FFE29F',
          500: '#FFD480',
          600: '#FFC57F',
          700: '#FFA84C',
          800: '#FF8B25',
          900: '#FF6D00',
        },
      },
    },
  },
  plugins: [starlightPlugin(), typographyPlugin()],
};
