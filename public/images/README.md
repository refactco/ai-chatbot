# Static Images

This directory contains static image assets used throughout the application.

## Contents

- `demo-thumbnail.png` - Thumbnail image used for demonstration purposes in the UI

## Usage Guidelines

1. Place all application-wide static images in this directory
2. Use descriptive filenames that indicate the image's purpose
3. Consider using SVG format for icons and simple graphics when possible
4. Optimize images before adding them to reduce bundle size
5. Reference these images in components using the `/images/filename.ext` path

## Image Optimization

Before adding new images to this directory, optimize them using one of these methods:
- Use [TinyPNG](https://tinypng.com/) for PNG/JPEG compression
- Use [SVGOMG](https://jakearchibald.github.io/svgomg/) for SVG optimization
- Use the Next.js Image component with appropriate sizing when displaying these images

This helps maintain fast page load times and improves overall application performance. 