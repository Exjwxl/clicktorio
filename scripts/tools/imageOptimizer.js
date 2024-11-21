import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIZES = {
    logo: { width: 256, height: 256 },
    resources: { width: 64, height: 64 },
    craftedItems: { width: 64, height: 64 }
};

async function optimizeImage(inputPath, outputPath, size) {
    try {
        await sharp(inputPath)
            .resize(size.width, size.height, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png({ quality: 90, compressionLevel: 9 })
            .toFile(outputPath);
        
        console.log(`✓ Optimized: ${path.basename(inputPath)}`);
        
        // Log size reduction
        const inputStats = await fs.stat(inputPath);
        const outputStats = await fs.stat(outputPath);
        const reduction = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(2);
        console.log(`  Size reduced by ${reduction}% (${(inputStats.size/1024).toFixed(2)}KB → ${(outputStats.size/1024).toFixed(2)}KB)`);
    } catch (error) {
        console.error(`❌ Error optimizing ${inputPath}:`, error);
    }
}

async function processDirectory(directory) {
    try {
        const files = await fs.readdir(directory);
        
        for (const file of files) {
            const filePath = path.join(directory, file);
            const stat = await fs.stat(filePath);
            
            if (stat.isDirectory()) {
                await processDirectory(filePath);
                continue;
            }
            
            if (!['.png', '.jpg', '.jpeg'].includes(path.extname(file).toLowerCase())) {
                continue;
            }
            
            // Determine size based on directory name
            let size = SIZES.resources; // default size
            const dirName = path.basename(path.dirname(filePath)).toLowerCase();
            
            if (dirName in SIZES) {
                size = SIZES[dirName];
            }
            
            const optimizedPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '_optimized.png');
            await optimizeImage(filePath, optimizedPath, size);
        }
    } catch (error) {
        console.error('Error processing directory:', error);
    }
}

// Usage
const assetsDir = path.join(__dirname, '../../assets');
console.log('🎨 Starting image optimization...');
console.log('📁 Assets directory:', assetsDir);

processDirectory(assetsDir)
    .then(() => console.log('✨ Image optimization complete!'))
    .catch(console.error);
