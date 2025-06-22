import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
			firstColor: "#3BA94A", // background color
			secondColor: "#FF4A4A", // nav + footer color
			thirdColor: "#272835", // button normal color
			fourthColor: "#EEF1F4", // button hover color
			fifthColor: "#E8EFF6", // bg for dark mode and text color for light mode
			sixthColor: "#D7DFEF", // text color for dark mode
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
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
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
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},	
  		backgroundImage: {
  			'dashboard-background': '#E8EFF6',
			'light-orange-gradient': 'linear-gradient(240deg, rgba(253,186,116,0.15) -11.5%, rgba(255,255,255,0.05) 86.78%)',
  		},	
		fontFamily: {
			poppins: [
				'Poppins',
				'sans-serif'
			],
			roboto: [
				'Roboto',
				'sans-serif'
			],
			instrumentSans: [
				'Instrument Sans',
				'sans-serif'
			],
			tiroBangla: [
				'Tiro Bangla',
				'sans-serif'
			],
			hindSiliguri: [
				'Hind Siliguri',
				'sans-serif'
			],
			notoSans: [
				'Noto Sans',
				'sans-serif'
			],
			montserrat: [
				'Montserrat',
				'sans-serif'
			],
			raleway: [
				'Raleway',
				'sans-serif'
			],
			inter: [
				'Inter',
				'sans-serif'
			]
		},
  	}
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
