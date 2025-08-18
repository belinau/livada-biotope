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
          'display': ['Comfortaa', 'sans-serif'],
          'body': ['Inter', 'sans-serif'],
          'accent': ['Quicksand', 'sans-serif'],
          'mono': ['JetBrains Mono', 'monospace'],
        },
        // Nature-inspired colors
        colors: {
          'forest': '#2d5a3d',
          'sage': '#87a96b',
          'earth': '#8b7355',
          'sky': '#5c7cfa',
          'sunset': '#ff8787',
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
          // This targets elements within the 'prose-lg' class, which you use.
          // It provides even more spacing for larger text sizes.
          lg: {
            css: {
              p: {
                marginBottom: theme('spacing.10'), // More spacing for 'prose-lg'
                marginTop: theme('spacing.10'),
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
