/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'sarabun': ['var(--font-sarabun)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'kanit': ['var(--font-kanit)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'sans': ['Inter', 'var(--font-sarabun)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        primary: "var(--primary)",
        secondary: "var(--foreground-secondary)",
        muted: "var(--foreground-muted)",
      },
      borderRadius: {
        'DEFAULT': 'var(--radius)',
        'sm': 'var(--radius-sm)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'slide-in-left': 'slideInFromLeft 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        slideInFromLeft: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        }
      },
      typography: {
        thai: {
          css: {
            'h1, h2, h3, h4, h5, h6': {
              fontFamily: 'var(--font-kanit)',
            },
            'p, li, td, th': {
              fontFamily: 'var(--font-sarabun)',
              lineHeight: '1.7',
            },
          },
        },
      },
    },
  },
  plugins: [],
};