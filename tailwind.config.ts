
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				cyber: {
					blue: '#1EAEDB',
					purple: '#9b87f5',
					pink: '#F81CE5',
					yellow: '#fcee09',
					red: '#ff003c',
					black: '#0d0e16',
					darkgray: '#1A1F2C',
					gray: '#403E43',
					'light-gray': '#606060'
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
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 5px rgba(158, 87, 245, 0.5)' 
					},
					'50%': { 
						boxShadow: '0 0 20px rgba(158, 87, 245, 0.8)' 
					}
				},
				'text-shimmer': {
					'0%': {
						backgroundPosition: '0% 50%'
					},
					'100%': {
						backgroundPosition: '100% 50%'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s infinite',
				'text-shimmer': 'text-shimmer 4s ease-in-out infinite alternate',
				'float': 'float 3s ease-in-out infinite'
			},
			backgroundImage: {
				'cyber-grid': "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.05\" fill-rule=\"evenodd\"%3E%3Cpath d=\"M0 40L40 0H20L0 20M40 40V20L20 40\"%3E%3C/path%3E%3C/g%3E%3C/svg%3E')",
				'gradient-purple': 'linear-gradient(90deg, rgba(158, 87, 245, 0.4) 0%, rgba(77, 20, 140, 0.2) 100%)',
				'gradient-pink': 'linear-gradient(90deg, rgba(248, 28, 229, 0.4) 0%, rgba(143, 0, 158, 0.2) 100%)',
				'gradient-blue': 'linear-gradient(90deg, rgba(30, 174, 219, 0.4) 0%, rgba(0, 82, 140, 0.2) 100%)',
				'gradient-yellow': 'linear-gradient(90deg, rgba(252, 238, 9, 0.4) 0%, rgba(181, 140, 0, 0.2) 100%)',
				'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
