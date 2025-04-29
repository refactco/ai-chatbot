/**
 * PostCSS Configuration
 *
 * This file configures PostCSS processing for CSS files.
 * Features:
 * - Tailwind CSS integration for utility-first styling
 * - CSS nesting support for more maintainable stylesheets
 * - Plugin configuration for CSS transformation pipeline
 *
 * PostCSS processes CSS with JavaScript to transform styles
 * during the build process, enabling modern CSS features.
 */

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    'tailwindcss/nesting': {},
  },
};

export default config;
