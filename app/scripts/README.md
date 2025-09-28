# Scripts Directory

This directory contains utility scripts for the Synonym Roll project.

## Social Media Image Generation

### `generate-social-image.js`

Generates a social media preview image (1200x630) for Open Graph and Twitter Card sharing.

#### Usage

```bash
# From the app directory
node scripts/generate-social-image.js
```

#### What it does

- Creates a 1200x630 pixel social media preview image
- Uses the app's actual color theme and design system
- Includes the cinnamon roll logo
- Generates `public/og-image.png` for social media sharing
- Uses Puppeteer to render the HTML with proper styling

#### Requirements

- Node.js with ES modules support
- Puppeteer installed (`npm install puppeteer`)
- The `cinnamonroll_large.png` image in the `public` directory

#### Output

The script generates `public/og-image.png` which is used by:
- Open Graph meta tags in `index.html`
- Twitter Card meta tags
- Social media platform previews

#### Customization

To modify the social media preview:

1. Edit the HTML content in the script
2. Update the CSS styles to match your design
3. Modify the text content, stats, or layout
4. Run the script to regenerate the image

#### Example Output

The generated image includes:
- Cinnamon roll logo
- "Synonym Roll" title with game font
- Word path visualization (START → WORD → END)
- Game description
- Performance stats (Steps, Time, Efficiency)
- App's warm brown color theme
- Subtle background patterns
