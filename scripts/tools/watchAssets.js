import chokidar from 'chokidar';
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

async function optimizeImage(inputPath) {
    try {
        // Skip if this is already an optimized image
        if (inputPath.includes('_optimized')) {
            return;
        }

        // Determine size based on directory name
        let size = SIZES.resources; // default size
        const dirName = path.basename(path.dirname(inputPath)).toLowerCase();
        
        if (dirName in SIZES) {
            size = SIZES[dirName];
        }

        const optimizedPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '_optimized.png');

        // Check if optimized version exists and is newer
        try {
            const inputStats = await fs.stat(inputPath);
            const outputStats = await fs.stat(optimizedPath);
            
            if (outputStats.mtime > inputStats.mtime) {
                console.log(`⏭️ Skipping ${path.basename(inputPath)} - optimized version is up to date`);
                return;
            }
        } catch (err) {
            // Optimized version doesn't exist, continue with optimization
        }

        await sharp(inputPath)
            .resize(size.width, size.height, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png({ quality: 90, compressionLevel: 9 })
            .toFile(optimizedPath);
        
        console.log(`✨ Optimized: ${path.basename(inputPath)}`);
        
        // Log size reduction
        const inputStats = await fs.stat(inputPath);
        const outputStats = await fs.stat(optimizedPath);
        const reduction = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(2);
        console.log(`  Size reduced by ${reduction}% (${(inputStats.size/1024).toFixed(2)}KB → ${(outputStats.size/1024).toFixed(2)}KB)`);
    } catch (error) {
        console.error(`❌ Error optimizing ${inputPath}:`, error);
    }
}

// Set up watcher
const assetsDir = path.join(__dirname, '../../assets');
console.log('👀 Watching for image changes in:', assetsDir);

const watcher = chokidar.watch(path.join(assetsDir, '**/*.{png,jpg,jpeg}'), {
    ignored: /_optimized\.png$/,
    persistent: true,
    ignoreInitial: false
});

watcher
    .on('add', path => {
        console.log(`📸 New image detected: ${path}`);
        optimizeImage(path);
    })
    .on('change', path => {
        console.log(`🔄 Image changed: ${path}`);
        optimizeImage(path);
    })
    .on('unlink', path => {
        const optimizedPath = path.replace(/\.(png|jpg|jpeg)$/i, '_optimized.png');
        fs.unlink(optimizedPath).catch(() => {});
        console.log(`🗑️ Removed: ${path}`);
    })
    .on('error', error => console.error(`Watcher error: ${error}`));

console.log('🚀 Asset watcher started! Press Ctrl+C to stop.');
