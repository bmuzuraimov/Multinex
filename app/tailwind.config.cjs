const defaultTheme = require('tailwindcss/defaultTheme');
const { resolveProjectPath } = require('wasp/dev');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [resolveProjectPath('./src/**/*.{js,jsx,ts,tsx}')],
  darkMode: ['class', 'class'],
  important: true,
  theme: {
  	extend: {
  		fontFamily: {
  			manrope: [
  				'Manrope',
  				'sans-serif'
  			],
  			montserrat: [
  				'Montserrat',
  				'sans-serif'
  			],
  			satoshi: [
  				'Satoshi',
  				'sans-serif'
  			],
  			dancing: [
  				'Dancing Script',
  				'sans-serif'
  			],
  			courgette: [
  				'Courgette',
  				'sans-serif'
  			]
  		},
  		colors: {
  			primary: {
  				'50': '#ebfef7',
  				'100': '#cefdea',
  				'200': '#a2f8da',
  				'300': '#66efc9',
  				'400': '#29deb1',
  				'500': '#05c49b',
  				'600': '#00a07f',
  				'700': '#008069',
  				'800': '#006655',
  				'900': '#015346',
  				'950': '#002f28',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'50': '#e4f3ff',
  				'100': '#cfe8ff',
  				'200': '#a8d3ff',
  				'300': '#74b4ff',
  				'400': '#3e81ff',
  				'500': '#134fff',
  				'600': '#003aff',
  				'700': '#003aff',
  				'800': '#0034e4',
  				'900': '#0022b0',
  				'950': '#000b42',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			tertiary: {
  				'50': '#fef5ef',
  				'100': '#ffdfc8',
  				'200': '#ffbf90',
  				'300': '#f79e51',
  				'400': '#e4801d',
  				'500': '#c76905',
  				'600': '#a15500',
  				'700': '#804805',
  				'800': '#653d0a',
  				'900': '#53350e',
  				'950': '#050300'
  			},
  			success: '#219653',
  			danger: '#D34053',
  			warning: '#FFA70B',
  			listen: '#a8d3ff',
  			type: '#a2f8da',
  			write: '#ffc9c9',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		screens: {
                ...defaultTheme.screens
  		},
  		fontSize: {
  			'title-xxl': [
  				'44px',
  				'55px'
  			],
  			'title-xl': [
  				'36px',
  				'45px'
  			],
  			'title-lg': [
  				'28px',
  				'35px'
  			],
  			'title-md': [
  				'24px',
  				'30px'
  			],
  			'title-sm': [
  				'20px',
  				'26px'
  			],
  			'title-xsm': [
  				'18px',
  				'24px'
  			]
  		},
  		spacing: {
  			'1': '0.25rem',
  			'2': '0.5rem',
  			'3': '0.75rem',
  			'4': '1rem',
  			'5': '1.25rem',
  			'6': '1.5rem',
  			'8': '2rem',
  			'10': '2.5rem',
  			'12': '3rem',
  			'16': '4rem',
  			'20': '5rem',
  			'24': '6rem',
  			'32': '8rem',
  			'40': '10rem',
  			'48': '12rem',
  			'56': '14rem',
  			'64': '16rem',
  			'72': '18rem',
  			'80': '20rem',
  			'96': '24rem',
  			'0.5': '0.125rem'
  		},
  		maxWidth: {
  			xs: '20rem',
  			sm: '24rem',
  			md: '28rem',
  			lg: '32rem',
  			xl: '36rem',
  			'2xl': '42rem',
  			'3xl': '48rem',
  			'4xl': '56rem',
  			'5xl': '64rem',
  			'6xl': '72rem',
  			'7xl': '80rem'
  		},
  		maxHeight: {
  			xs: '20rem',
  			sm: '24rem',
  			md: '28rem',
  			lg: '32rem',
  			xl: '36rem',
  			'2xl': '42rem'
  		},
  		minWidth: {
  			xs: '20rem',
  			sm: '24rem',
  			md: '28rem',
  			lg: '32rem'
  		},
  		zIndex: {
  			behind: '-1',
  			normal: 0,
  			above: 1,
  			dropdown: 10,
  			sticky: 20,
  			fixed: 30,
  			modal: 40,
  			popover: 50,
  			tooltip: 60
  		},
  		boxShadow: {
  			sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  			DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  			md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  			lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  			xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  			inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  			none: 'none'
  		},
  		animation: {
  			spin: 'spin 1s linear infinite',
  			ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
  			pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			bounce: 'bounce 1s infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		}
  	}
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('@tailwindcss/forms'), require("tailwindcss-animate")],
};
