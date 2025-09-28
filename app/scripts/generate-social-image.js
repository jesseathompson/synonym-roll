import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSocialImage() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport to social media dimensions
  await page.setViewport({ width: 1200, height: 630 });
  
  // Create HTML with the cinnamon roll image and app's color theme
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Synonym Roll - Social Preview</title>
      <style>
        :root {
          /* Colors - Main Palette */
          --color-primary: #411f07; /* Warm brown for the cinnamon roll crust */
          --color-primary-light: #723911; /* Lighter variant of primary */
          --color-primary-dark: #2a1504; /* Darker variant of primary */
          --color-secondary: #c19a6b; /* Lighter brown for secondary elements */
          --color-secondary-light: #e6d7c3; /* Even lighter variant for subtle elements */
          --color-secondary-dark: #9a7a53; /* Darker variant of secondary */
          
          /* Text Colors */
          --color-text-primary: #411f07; /* Main text color - dark brown */
          --color-text-secondary: #c19a6b; /* Secondary text - lighter brown */
          --color-text-muted: #8c775d; /* Muted text for less emphasis */
          --color-text-inverse: #fefdf8; /* Text on dark backgrounds */
          --color-text-shadow: #c19a6b; /* For text shadows */
          
          /* Background Colors */
          --color-background-light: #fefdf8; /* Main cream-colored background */
          --color-background-medium: #f8f4ea; /* Slightly darker background for cards/sections */
          --color-background-dark: #411f07; /* Dark background for contrast */
          
          /* Border Colors */
          --color-border-light: #e6d7c3; /* Light borders */
          --color-border-medium: #c19a6b; /* Medium emphasis borders */
          --color-border-dark: #9a7a53; /* Dark borders */
          
          /* Typography */
          --font-family-base: "Outfit", sans-serif;
          --font-family-game: "KG Kiss Me Slowly", cursive; /* Game-specific stylized font */
          
          /* Font Weights */
          --font-weight-regular: 400;
          --font-weight-medium: 500;
          --font-weight-semibold: 600;
          --font-weight-bold: 700;
          
          /* Letter Spacing */
          --letter-spacing-tight: -0.025em;
          --letter-spacing-normal: 0;
          --letter-spacing-wide: 0.025em;
          
          /* Line Heights */
          --line-height-tight: 1.2;
          --line-height-normal: 1.5;
          --line-height-relaxed: 1.75;
          
          /* Border Radius */
          --border-radius-md: 0.5rem;   /* 8px */
          
          /* Effects */
          --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          width: 1200px;
          height: 630px;
          background: linear-gradient(135deg, var(--color-background-light) 0%, var(--color-background-medium) 100%);
          font-family: var(--font-family-base);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          color: var(--color-text-primary);
        }
        
        .container {
          text-align: center;
          z-index: 2;
          position: relative;
          max-width: 1000px;
          padding: 40px;
        }
        
        .header {
          margin-bottom: 40px;
        }
        
        .logoContainer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 16px;
        }
        
        .logo {
          width: 80px;
          height: 80px;
          object-fit: contain;
          filter: drop-shadow(0 4px 8px var(--color-text-shadow));
        }
        
        .title {
          font-size: 72px;
          font-weight: var(--font-weight-bold);
          margin: 0;
          text-shadow: 0 4px 8px var(--color-text-shadow);
          letter-spacing: var(--letter-spacing-tight);
          color: var(--color-text-primary);
          font-family: var(--font-family-game);
        }
        
        .subtitle {
          font-size: 32px;
          font-weight: var(--font-weight-semibold);
          margin: 0;
          opacity: 0.95;
          text-shadow: 0 2px 4px var(--color-text-shadow);
          color: var(--color-text-secondary);
        }
        
        .gamePath {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin: 40px 0;
          flex-wrap: wrap;
        }
        
        .wordTile {
          background: var(--color-background-light);
          border: 2px solid var(--color-border-medium);
          border-radius: var(--border-radius-md);
          padding: 12px 24px;
          font-size: 24px;
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-primary);
          backdrop-filter: blur(10px);
          min-width: 80px;
          text-align: center;
          box-shadow: var(--shadow-md);
        }
        
        .arrow {
          color: var(--color-text-secondary);
          font-size: 28px;
          font-weight: var(--font-weight-bold);
          text-shadow: 0 2px 4px var(--color-text-shadow);
        }
        
        .description {
          margin: 30px 0;
          font-size: 24px;
          line-height: var(--line-height-normal);
          opacity: 0.9;
          text-shadow: 0 2px 4px var(--color-text-shadow);
          color: var(--color-text-primary);
        }
        
        .description p {
          margin: 8px 0;
        }
        
        .stats {
          display: flex;
          justify-content: center;
          gap: 40px;
          margin-top: 40px;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        
        .statNumber {
          font-size: 32px;
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
          text-shadow: 0 2px 4px var(--color-text-shadow);
        }
        
        .statLabel {
          font-size: 16px;
          font-weight: var(--font-weight-medium);
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: var(--letter-spacing-wide);
          color: var(--color-text-secondary);
        }
        
        /* Background pattern */
        body::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 20% 80%, var(--color-secondary-light) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, var(--color-secondary-light) 0%, transparent 50%);
          z-index: 1;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logoContainer">
            <img src="file://${path.join(__dirname, '..', 'public', 'cinnamonroll_large.png')}" alt="Synonym Roll" class="logo" />
            <h1 class="title">Synonym Roll</h1>
          </div>
          <p class="subtitle">A Daily Word Game</p>
        </div>
        
        <div class="gamePath">
          <div class="wordTile">START</div>
          <div class="arrow">→</div>
          <div class="wordTile">WORD</div>
          <div class="arrow">→</div>
          <div class="wordTile">END</div>
        </div>
        
        <div class="description">
          <p>Find paths between words using synonyms.</p>
          <p>Challenge your vocabulary and share your results!</p>
        </div>
        
        <div class="stats">
          <div class="stat">
            <span class="statNumber">3</span>
            <span class="statLabel">Steps</span>
          </div>
          <div class="stat">
            <span class="statNumber">2:30</span>
            <span class="statLabel">Time</span>
          </div>
          <div class="stat">
            <span class="statNumber">85%</span>
            <span class="statLabel">Efficiency</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Write the HTML to a temporary file
  const tempHtmlPath = path.join(__dirname, '..', 'temp-social-preview.html');
  fs.writeFileSync(tempHtmlPath, htmlContent);
  
  // Load the HTML file
  await page.goto(`file://${tempHtmlPath}`);
  
  // Wait for fonts and styles to load
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Take screenshot
  const screenshot = await page.screenshot({
    type: 'png',
    fullPage: false,
    clip: { x: 0, y: 0, width: 1200, height: 630 }
  });
  
  // Save the image
  fs.writeFileSync(path.join(__dirname, '..', 'public', 'og-image.png'), screenshot);
  
  // Clean up temporary file
  fs.unlinkSync(tempHtmlPath);
  
  console.log('✅ Social media image generated with cinnamon roll logo: public/og-image.png');
  
  await browser.close();
}

generateSocialImage().catch(console.error);
