const fs = require('fs');
const path = require('path');

// Create SVG icon template
const createSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#7C3AED"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="700" fill="white" text-anchor="middle" dy="${size * 0.13}">DJ</text>
</svg>`;

async function generateIcons() {
  const publicDir = path.join(__dirname, 'public');
  
  // Try to use sharp for PNG generation
  try {
    const sharp = require('sharp');
    
    // Generate 192x192 PNG
    const svg192 = Buffer.from(createSVG(192));
    await sharp(svg192)
      .png()
      .toFile(path.join(publicDir, 'icon-192x192.png'));
    
    // Generate 512x512 PNG
    const svg512 = Buffer.from(createSVG(512));
    await sharp(svg512)
      .png()
      .toFile(path.join(publicDir, 'icon-512x512.png'));
    
    console.log('✓ PNG icons created successfully (192x192, 512x512)');
  } catch (err) {
    // Fallback to SVG if sharp is not available
    console.log('⚠ Sharp not available, creating SVG icons instead');
    fs.writeFileSync(path.join(publicDir, 'icon-192x192.svg'), createSVG(192));
    fs.writeFileSync(path.join(publicDir, 'icon-512x512.svg'), createSVG(512));
    console.log('✓ SVG icons created (install sharp for PNG generation)');
  }
}

generateIcons().catch(console.error);
