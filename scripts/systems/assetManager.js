// Asset Manager for Clicktorio
class AssetManager {
    constructor() {
        this.loadedAssets = new Map();
        this.assetPaths = {
            resource: './assets/images/resources/',
            craftedItem: './assets/images/craftedItems/',
            item: './assets/images/items/'
        };
        this.defaultAssets = {
            item: './assets/images/placeholder.png',
            craftedItem: './assets/images/placeholder.png',
            resource: './assets/images/placeholder.png'
        };
        // Removed preload queue - we'll handle this differently
    }

    formatAssetId(id) {
        // Convert camelCase to kebab-case for file names
        return id.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    }

    async getAssetPath(assetId, type = 'item') {
        // If we've already checked this asset, return the cached result
        const cacheKey = `${type}:${assetId}`;
        if (this.loadedAssets.has(cacheKey)) {
            return this.loadedAssets.get(cacheKey);
        }

        // Get base path for this asset type
        const basePath = this.assetPaths[type] || './assets/images/';
        
        // Try regular version first
        const path = `${basePath}${assetId}.png`;

        try {
            const exists = await this.checkImageExists(path);
            if (exists) {
                this.loadedAssets.set(cacheKey, path);
                return path;
            }
        } catch (error) {
            console.warn(`Failed to load asset: ${path}`, error);
        }

        // Return default asset for this type if original not found
        const defaultPath = this.defaultAssets[type] || this.defaultAssets.item;
        this.loadedAssets.set(cacheKey, defaultPath);
        return defaultPath;
    }

    async checkImageExists(path) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = path;
        });
    }

    formatDisplayName(id) {
        return id
            .replace(/[-_]/g, ' ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/\b\w/g, c => c.toUpperCase())
            .trim();
    }

    // Helper method to check if an asset exists
    assetExists(assetId, type = 'item') {
        const path = this.getAssetPath(assetId, type);
        return path !== this.defaultAssets[type];
    }

    // Simplified preload method that only loads essential assets
    async preloadAssets() {
        const essentialAssets = [
            { id: 'iron-ore', type: 'resource' },
            { id: 'copper-ore', type: 'resource' }
        ];

        try {
            await Promise.all(
                essentialAssets.map(async ({ id, type }) => {
                    await this.getAssetPath(id, type);
                })
            );
            console.log('Essential assets preloaded successfully');
        } catch (error) {
            console.error('Error preloading assets:', error);
        }
    }

    // Add asset to preload queue
    addToPreloadQueue(src) {
        if (!this.preloadQueue.includes(src)) {
            this.preloadQueue.push(src);
        }
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            if (this.loadedAssets.has(src)) {
                resolve(this.loadedAssets.get(src));
                return;
            }

            const img = new Image();
            img.onload = () => {
                this.loadedAssets.set(src, img);
                resolve(img);
            };
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            img.src = src;
        });
    }

    getAsset(src) {
        return this.loadedAssets.get(src);
    }
}

// Create and export singleton instance
export const assetManager = new AssetManager();
