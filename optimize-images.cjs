const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = [
  {
    input: 'FCT Logo.png',
    output: 'FCT Logo.webp',
    width: 128,
    height: 128,
    quality: 85
  },
  {
    input: 'advertisement-CqiYVZlG.jpg',
    output: 'advertisement-CqiYVZlG.webp',
    width: 800,
    quality: 75
  },
  {
    input: 'flyer-designoutput-TPdGMFzh.jpg',
    output: 'flyer-designoutput-TPdGMFzh.webp',
    width: 800,
    quality: 75
  },
  {
    input: 'socialmedia-design-UIXQ9LEi.jpg',
    output: 'socialmedia-design-UIXQ9LEi.webp',
    width: 800,
    quality: 75
  },
  {
    input: 'thumbnail-design-CeVru7gf.jpg',
    output: 'thumbnail-design-CeVru7gf.webp',
    width: 800,
    quality: 75
  }
];

async function optimizeImages() {
  const publicDir = path.join(__dirname, 'public');
  
  for (const image of images) {
    const inputPath = path.join(publicDir, image.input);
    const outputPath = path.join(publicDir, image.output);
    
    try {
      let transformer = sharp(inputPath);
      
      if (image.width && image.height) {
        transformer = transformer.resize(image.width, image.height, {
          fit: 'cover',
          position: 'center'
        });
      } else if (image.width) {
        transformer = transformer.resize(image.width, null, {
          fit: 'cover',
          position: 'center'
        });
      }
      
      await transformer
        .webp({ quality: image.quality })
        .toFile(outputPath);
      
      console.log(`✅ Optimized ${image.input} -> ${image.output}`);
    } catch (error) {
      console.error(`❌ Error optimizing ${image.input}:`, error.message);
    }
  }
}

optimizeImages().then(() => {
  console.log('🎉 Image optimization complete!');
}).catch(console.error);
