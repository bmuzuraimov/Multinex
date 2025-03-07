const defaultTheme = require('tailwindcss/defaultTheme');
const { resolveProjectPath } = require('wasp/dev');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [resolveProjectPath('./src/**/*.{js,jsx,ts,tsx}')],
  darkMode: 'class',
  important: true,
  theme: {
    extend: {
      fontFamily: {
        // Primary brand fonts
        manrope: ['Manrope', 'sans-serif'], // Modern, clean font for headings
        montserrat: ['Montserrat', 'sans-serif'], // Professional font for body text
        satoshi: ['Satoshi', 'sans-serif'], // Minimal, contemporary font for UI elements
        
        // Decorative fonts - use sparingly
        dancing: ['Dancing Script', 'sans-serif'], // Script font for special occasions
        courgette: ['Courgette', 'sans-serif'], // Casual handwritten style
      },
      colors: {
        // Brand color palette
        primary: {
          // Teal/Green - Main brand color for key UI elements
          50: '#ebfef7',  // Background, hover states
          100: '#cefdea', // Borders, dividers
          200: '#a2f8da', // Secondary backgrounds
          300: '#66efc9', // Accents
          400: '#29deb1', // Hover states
          500: '#05c49b', // Primary buttons, CTAs
          600: '#00a07f', // Hover states for primary
          700: '#008069', // Active states
          800: '#006655', // Dark accents
          900: '#015346', // Text on light backgrounds
          950: '#002f28', // Deep backgrounds
        },
        secondary: {
          // Blue - Supporting color for interactive elements
          50: '#e4f3ff',  // Light backgrounds
          100: '#cfe8ff', // Subtle highlights
          200: '#a8d3ff', // Borders
          300: '#74b4ff', // Icons, links
          400: '#3e81ff', // Buttons
          500: '#134fff', // Primary actions
          600: '#003aff', // Hover states
          700: '#003aff', // Active states
          800: '#0034e4', // Dark accents
          900: '#0022b0', // Deep accents
          950: '#000b42', // Dark backgrounds
        },
        tertiary: {
          // Orange - Used for warnings, highlights
          50: '#fef5ef',  // Light backgrounds
          100: '#ffdfc8', // Subtle highlights
          200: '#ffbf90', // Borders
          300: '#f79e51', // Icons
          400: '#e4801d', // Text
          500: '#c76905', // Primary actions
          600: '#a15500', // Hover states
          700: '#804805', // Active states
          800: '#653d0a', // Dark accents
          900: '#53350e', // Deep accents
          950: '#050300', // Dark backgrounds
        },
        // Semantic colors for consistent messaging
        success: '#219653', // Positive actions/feedback
        danger: '#D34053',  // Errors/destructive actions
        warning: '#FFA70B', // Warnings/caution states
        // Exercise mode colors
        listen: '#a8d3ff',  // Listen mode highlight
        type: '#a2f8da',    // Type mode highlight
        write: '#ffc9c9',   // Write mode highlight
      },
      screens: {
        ...defaultTheme.screens, // Using Tailwind's default breakpoints
      },
      fontSize: {
        // Consistent type scale for headings
        'title-xxl': ['44px', '55px'], // Hero headlines
        'title-xl': ['36px', '45px'],  // Main headlines
        'title-lg': ['28px', '35px'],  // Section headlines
        'title-md': ['24px', '30px'],  // Subsection headlines
        'title-sm': ['20px', '26px'],  // Card headlines
        'title-xsm': ['18px', '24px'], // Small headlines
      },
      spacing: {
        // Standard spacing scale
        0.5: '0.125rem', // 2px - Minimal spacing
        1: '0.25rem',    // 4px - Tight spacing
        2: '0.5rem',     // 8px - Default compact spacing
        3: '0.75rem',    // 12px - Medium spacing
        4: '1rem',       // 16px - Standard spacing
        5: '1.25rem',    // 20px - Comfortable spacing
        6: '1.5rem',     // 24px - Generous spacing
        8: '2rem',       // 32px - Section spacing
        10: '2.5rem',    // 40px - Large spacing
        12: '3rem',      // 48px - Extra large spacing
        16: '4rem',      // 64px - Section breaks
        20: '5rem',      // 80px - Major section breaks
        24: '6rem',      // 96px
        32: '8rem',      // 128px
        40: '10rem',     // 160px
        48: '12rem',     // 192px
        56: '14rem',     // 224px
        64: '16rem',     // 256px
        72: '18rem',     // 288px
        80: '20rem',     // 320px
        96: '24rem',     // 384px
      },
      maxWidth: {
        // Container width constraints
        xs: '20rem',  // 320px - Mobile
        sm: '24rem',  // 384px - Large mobile
        md: '28rem',  // 448px - Small tablet
        lg: '32rem',  // 512px - Tablet
        xl: '36rem',  // 576px - Small desktop
        '2xl': '42rem', // 672px - Desktop
        '3xl': '48rem', // 768px - Large desktop
        '4xl': '56rem', // 896px - Extra large desktop
        '5xl': '64rem', // 1024px - Wide desktop
        '6xl': '72rem', // 1152px - Super wide
        '7xl': '80rem', // 1280px - Ultra wide
      },
      maxHeight: {
        // Vertical constraints
        xs: '20rem',  // 320px - Small cards
        sm: '24rem',  // 384px - Medium cards
        md: '28rem',  // 448px - Large cards
        lg: '32rem',  // 512px - Small sections
        xl: '36rem',  // 576px - Medium sections
        '2xl': '42rem', // 672px - Large sections
      },
      minWidth: {
        // Minimum width constraints
        xs: '20rem', // 320px - Small components
        sm: '24rem', // 384px - Medium components
        md: '28rem', // 448px - Large components
        lg: '32rem', // 512px - Extra large components
      },
      zIndex: {
        // Z-index scale for consistent layering
        behind: -1,    // Below normal flow
        normal: 0,     // Default
        above: 1,      // Slightly elevated
        dropdown: 10,  // Dropdown menus
        sticky: 20,    // Sticky elements
        fixed: 30,     // Fixed elements
        modal: 40,     // Modal dialogs
        popover: 50,   // Popovers
        tooltip: 60,   // Tooltips
      },
      boxShadow: {
        // Elevation scale
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        none: 'none',
      },
      animation: {
        // Standard animations
        spin: 'spin 1s linear infinite',
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
