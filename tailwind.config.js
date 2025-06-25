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
        // Extend the default Tailwind typography styles
        typography: ({ theme }) => ({
          DEFAULT: {
            css: {
              // Target paragraph elements within prose content
              p: {
                // Increase the bottom margin for paragraphs
                // theme('spacing.6') is typically 1.5rem (24px)
                // You can change '6' to '8' (2rem/32px) or a custom value like '1.5em'
                marginBottom: theme('spacing.8'), // Increased spacing
                marginTop: theme('spacing.8'),   // Added top margin for consistency
              },
              // You can uncomment and adjust these if you need more control
              // over other elements within your prose content (e.g., headings, lists).
              // h1: {
              //   marginTop: theme('spacing.12'),
              //   marginBottom: theme('spacing.6'),
              // },
              // h2: {
              //   marginTop: theme('spacing.10'),
              //   marginBottom: theme('spacing.5'),
              // },
              // li: {
              //   marginBottom: theme('spacing.2'), // Adjust list item spacing
              // },
              // ul: {
              //   marginBottom: theme('spacing.6'), // Adjust unordered list spacing
              //   marginTop: theme('spacing.6'),
              // },
              // ol: {
              //   marginBottom: theme('spacing.6'), // Adjust ordered list spacing
              //   marginTop: theme('spacing.6'),
              // },
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
  