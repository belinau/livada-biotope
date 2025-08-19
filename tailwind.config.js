/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      // It's good practice to include paths to your Markdown content files
      // so Tailwind can correctly purge unused CSS, especially for prose styles.
      "./content/**/*.md",
    ],
    theme: {
      extend: {
        // Ecofeminist Font Family System
        fontFamily: {
          display: 'var(--font-display)',
          body: 'var(--font-body)',
          accent: 'var(--font-accent)',
          mono: 'var(--font-mono)',
        },
        // Ecofeminist Typography System
        fontSize: {
          'xs': 'var(--text-xs)',
          'sm': 'var(--text-sm)',
          'base': 'var(--text-base)',
          'lg': 'var(--text-lg)',
          'xl': 'var(--text-xl)',
          '2xl': 'var(--text-2xl)',
          '3xl': 'var(--text-3xl)',
          '4xl': 'var(--text-4xl)',
          '5xl': 'var(--text-5xl)',
          '6xl': 'var(--text-6xl)',
        },
        // Nature-inspired colors
        colors: {
          forest: 'var(--text-forest)',
          sage: 'var(--text-sage)',
          earth: 'var(--text-earth)',
          sky: 'var(--text-sky)',
          sunset: 'var(--text-sunset)',
          primary: 'var(--primary)',
          'primary-light': 'var(--primary-light)',
          'primary-dark': 'var(--primary-dark)',
          'bg-main': 'var(--bg-main)',
          'text-main': 'var(--text-main)',
          'text-muted': 'var(--text-muted)',
        },
        // Extend the default Tailwind typography styles
        typography: ({ theme }) => ({
          DEFAULT: {
            css: {
              // Enhanced readability with Inter body font
              fontFamily: theme('fontFamily.body'),
              lineHeight: '1.8',
              fontSize: '1.05rem',
              color: theme('colors.gray.800'),
              // Target paragraph elements within prose content
              p: {
                marginBottom: theme('spacing.6'),
                marginTop: theme('spacing.2'),
                lineHeight: '1.8',
              },
              // Organic heading styles
              h1: {
                fontFamily: theme('fontFamily.display'),
                fontWeight: '700',
                color: theme('colors.forest'),
                marginTop: theme('spacing.12'),
                marginBottom: theme('spacing.6'),
                lineHeight: '1.1',
              },
              h2: {
                fontFamily: theme('fontFamily.display'),
                fontWeight: '600',
                color: theme('colors.forest'),
                marginTop: theme('spacing.10'),
                marginBottom: theme('spacing.5'),
                lineHeight: '1.2',
              },
              h3: {
                fontFamily: theme('fontFamily.accent'),
                fontWeight: '600',
                color: theme('colors.sage'),
                marginTop: theme('spacing.8'),
                marginBottom: theme('spacing.4'),
                lineHeight: '1.3',
              },
              strong: {
                fontWeight: '600',
                color: theme('colors.forest'),
              },
              em: {
                fontStyle: 'italic',
                color: theme('colors.sage'),
              },
              // Better list spacing
              li: {
                marginBottom: theme('spacing.1'),
              },
              ul: {
                marginBottom: theme('spacing.6'),
                marginTop: theme('spacing.4'),
              },
              ol: {
                marginBottom: theme('spacing.6'),
                marginTop: theme('spacing.4'),
              },
            },
          },
          // Enhanced large prose variant for better readability
          lg: {
            css: {
              fontSize: '1.125rem',
              lineHeight: '1.8',
              p: {
                marginBottom: theme('spacing.8'),
                marginTop: theme('spacing.3'),
                fontSize: '1.125rem',
                lineHeight: '1.8',
              },
              h1: {
                fontSize: 'clamp(2rem, 4vw, 3rem)',
              },
              h2: {
                fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              },
              h3: {
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              },
            },
          },
        }),
      },
    },
    plugins: [
      // Make sure the @tailwindcss/typography plugin is included here.
      require('@tailwindcss/typography'),
      // ... any other Tailwind plugins you might already have
    ],
  };
