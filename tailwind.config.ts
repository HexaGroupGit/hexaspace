import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Hexa master brand palette (Brand Guidelines 10.10.24)
        ink: '#000000', // black — primary
        paper: '#FFFFFF', // white — primary
        hexa: {
          green: '#7F8B2F', // PMS 383U — accent only, never logo/type
          grey: '#EFEDF2', // light grey — accent only
        },
        // working neutrals derived for UI surfaces (luxury off-whites / charcoals)
        bone: '#F6F5F1',
        stone: '#E8E6E0',
        charcoal: '#161614',
        muted: '#6B6B66',
      },
      fontFamily: {
        // mapped to next/font CSS variables in layout.tsx
        display: ['var(--font-display)', 'Times New Roman', 'serif'], // Big Daily Short
        heading: ['var(--font-heading)', 'Arial', 'sans-serif'], // Rework Micro Semibold
        body: ['var(--font-body)', 'Arial', 'sans-serif'], // GT America Thin
      },
      letterSpacing: {
        nav: '0.18em',
        label: '0.24em',
      },
      maxWidth: {
        page: '1440px',
      },
      transitionTimingFunction: {
        lux: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        rise: 'rise 1s cubic-bezier(0.16,1,0.3,1) both',
        fade: 'fade 1.4s ease both',
      },
    },
  },
  plugins: [],
};

export default config;
